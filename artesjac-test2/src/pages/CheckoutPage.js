import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { api } from '../api';
import '../styles/checkout.css';

export const CheckoutPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [shippingData, setShippingData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        province: 'San José',
        postalCode: '',
        specialInstructions: ''
    });

    const [paymentData, setPaymentData] = useState({
        method: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        bankTransfer: {
            bank: '',
            accountType: 'current'
        }
    });

    const provinces = [
        'San José', 'Alajuela', 'Cartago', 'Heredia',
        'Guanacaste', 'Puntarenas', 'Limón'
    ];

    const banks = [
        'Banco Nacional de Costa Rica',
        'Banco de Costa Rica',
        'BAC San José',
        'Scotiabank',
        'Banco Popular',
        'Banco Promerica'
    ];

    useEffect(() => {
        loadCartItems();
    }, []);

    const normalizeItems = (raw) => {
        if (!Array.isArray(raw)) return [];
        return raw.map((it) => {
            if (it?.productId && typeof it.productId === 'object') {
                const p = it.productId;
                return {
                    id: p._id || p.id || it.id || String(Math.random()),
                    name: p.title || p.name || 'Producto',
                    numericPrice: Number(p.price || 0),
                    quantity: Number(it.quantity || 1),
                    category: p.category || ''
                };
            }
            return {
                id: it.id || String(Math.random()),
                name: it.name || it.title || 'Producto',
                numericPrice: Number(it.numericPrice ?? it.price ?? 0),
                quantity: Number(it.quantity || 1),
                category: it.category || ''
            };
        }).filter(x => x.quantity > 0 && !Number.isNaN(x.numericPrice));
    };

    const loadCartItems = async () => {
        try {
            setIsLoading(true);

            try {
                const { data } = await api.get('/cart');
                if (data?.ok && Array.isArray(data?.data?.items)) {
                    const normalized = normalizeItems(data.data.items);
                    if (normalized.length === 0) {
                        navigate('/cart');
                        return;
                    }
                    setCartItems(normalized);
                    return;
                }
            } catch {
                // Fallback a localStorage
            }

            const savedCart = localStorage.getItem('artesjac-cart');
            if (savedCart && savedCart !== 'null') {
                const cart = JSON.parse(savedCart);
                const normalized = normalizeItems(cart);
                if (normalized.length === 0) {
                    navigate('/cart');
                    return;
                }
                setCartItems(normalized);
            } else {
                navigate('/cart');
                return;
            }
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            navigate('/cart');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShippingChange = (field, value) => {
        setShippingData(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setPaymentData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setPaymentData(prev => ({ ...prev, [field]: value }));
        }
    };

    const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);
    const validatePhoneCR = (v) => /^\+?506?\s?-?\s?\d{4}\s?-?\s?\d{4}$|^\d{8}$/.test(v.trim());

    const validateStep1 = () => {
        const required = ['fullName', 'email', 'phone', 'address', 'city', 'province'];
        const filled = required.every(field => String(shippingData[field] || '').trim() !== '');
        if (!filled) return false;
        if (!validateEmail(shippingData.email)) return false;
        if (!validatePhoneCR(shippingData.phone)) return false;
        return true;
    };

    const validateStep2 = () => {
        if (paymentData.method === 'card') {
            const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
            const filled = required.every(field => String(paymentData[field] || '').trim() !== '');
            if (!filled) return false;
            const cardDigits = paymentData.cardNumber.replace(/\s+/g, '');
            if (!/^\d{13,19}$/.test(cardDigits)) return false;
            if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) return false;
            if (!/^\d{3,4}$/.test(paymentData.cvv)) return false;
            return true;
        } else if (paymentData.method === 'bank_transfer') {
            return String(paymentData.bankTransfer.bank || '').trim() !== '';
        }
        return true;
    };

    const calculateSubtotal = () => {
        const total = cartItems.reduce((acc, item) => {
            const line = Number(item.numericPrice || 0) * Number(item.quantity || 0);
            return acc + (Number.isFinite(line) ? line : 0);
        }, 0);
        return Number.isFinite(total) ? total : 0;
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal >= 50000 ? 0 : 3500;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!validateStep1()) {
                alert('Revisá los datos de envío (correo/teléfono válidos).');
                return;
            }
            setCurrentStep(2);
            return;
        }
        if (currentStep === 2) {
            if (!validateStep2()) {
                alert('Revisá los datos de pago.');
                return;
            }
            setCurrentStep(3);
            return;
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmitOrder = async () => {
        if (!validateStep1() || !validateStep2()) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }
        setIsProcessing(true);

        console.log('🛒 Iniciando proceso de pedido...');

        try {
            const payload = {
                customer: shippingData,
                payment: paymentData,
                items: cartItems,
                subtotal: calculateSubtotal(),
                shipping: calculateShipping(),
                total: calculateTotal(),
            };

            console.log('📦 Enviando pedido al servidor...');

            const { data } = await api.post('/buyer-orders', payload);
            console.log('✅ Respuesta del servidor:', data);

            if (data?.ok && data?.order?.code) {
                console.log('🎉 Pedido creado exitosamente:', data.order.code);

                // Limpiar carrito local y del backend
                localStorage.setItem('artesjac-cart', JSON.stringify([]));
                try {
                    await api.delete('/cart');
                    console.log('🧹 Carrito backend limpiado');
                } catch (cartError) {
                    console.log('⚠️ No se pudo limpiar carrito backend:', cartError.message);
                }

                // Navegar a la confirmación con el código del pedido
                navigate(`/order-confirmation/${data.order.code}`);
                return;
            } else {
                throw new Error('Respuesta del servidor no válida');
            }

        } catch (error) {
            console.error('💥 Error al crear pedido:', error);
            alert('Error al procesar el pedido. Por favor intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="checkout-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando información del pedido...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h1>🛒 Finalizar Compra</h1>
                <div className="checkout-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Envío</span>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Pago</span>
                    </div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Confirmar</span>
                    </div>
                </div>
            </div>

            <div className="checkout-content">
                <div className="checkout-form">
                    {/* Paso 1: Información de Envío */}
                    {currentStep === 1 && (
                        <div className="checkout-step">
                            <h2>📦 Información de Envío</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={shippingData.fullName}
                                        onChange={(e) => handleShippingChange('fullName', e.target.value)}
                                        placeholder="Tu nombre completo"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Correo Electrónico *</label>
                                    <input
                                        type="email"
                                        value={shippingData.email}
                                        onChange={(e) => handleShippingChange('email', e.target.value)}
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Teléfono *</label>
                                    <input
                                        type="tel"
                                        value={shippingData.phone}
                                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                                        placeholder="+506 8888-8888"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Provincia *</label>
                                    <select
                                        value={shippingData.province}
                                        onChange={(e) => handleShippingChange('province', e.target.value)}
                                        required
                                    >
                                        {provinces.map(province => (
                                            <option key={province} value={province}>{province}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label>Dirección Completa *</label>
                                    <input
                                        type="text"
                                        value={shippingData.address}
                                        onChange={(e) => handleShippingChange('address', e.target.value)}
                                        placeholder="Dirección exacta de entrega"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Ciudad *</label>
                                    <input
                                        type="text"
                                        value={shippingData.city}
                                        onChange={(e) => handleShippingChange('city', e.target.value)}
                                        placeholder="Ciudad"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Código Postal</label>
                                    <input
                                        type="text"
                                        value={shippingData.postalCode}
                                        onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                                        placeholder="Código postal"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Instrucciones Especiales</label>
                                    <textarea
                                        value={shippingData.specialInstructions}
                                        onChange={(e) => handleShippingChange('specialInstructions', e.target.value)}
                                        placeholder="Indicaciones adicionales para la entrega..."
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Método de Pago */}
                    {currentStep === 2 && (
                        <div className="checkout-step">
                            <h2>💳 Método de Pago</h2>

                            <div className="payment-methods">
                                <div className="payment-method">
                                    <input
                                        type="radio"
                                        id="card"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentData.method === 'card'}
                                        onChange={(e) => handlePaymentChange('method', e.target.value)}
                                    />
                                    <label htmlFor="card">
                                        <i className="fa fa-credit-card"></i>
                                        Tarjeta de Crédito/Débito
                                    </label>
                                </div>

                                <div className="payment-method">
                                    <input
                                        type="radio"
                                        id="bank_transfer"
                                        name="paymentMethod"
                                        value="bank_transfer"
                                        checked={paymentData.method === 'bank_transfer'}
                                        onChange={(e) => handlePaymentChange('method', e.target.value)}
                                    />
                                    <label htmlFor="bank_transfer">
                                        <i className="fa fa-university"></i>
                                        Transferencia Bancaria
                                    </label>
                                </div>

                                <div className="payment-method">
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentData.method === 'cash'}
                                        onChange={(e) => handlePaymentChange('method', e.target.value)}
                                    />
                                    <label htmlFor="cash">
                                        <i className="fa fa-money-bill"></i>
                                        Efectivo (Contra Entrega)
                                    </label>
                                </div>
                            </div>

                            {paymentData.method === 'card' && (
                                <div className="payment-form">
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>Número de Tarjeta *</label>
                                            <input
                                                type="text"
                                                value={paymentData.cardNumber}
                                                onChange={(e) => handlePaymentChange('cardNumber', e.target.value.replace(/[^\d\s]/g, ''))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Fecha de Vencimiento *</label>
                                            <input
                                                type="text"
                                                value={paymentData.expiryDate}
                                                onChange={(e) => handlePaymentChange('expiryDate', e.target.value.replace(/[^\d/]/g, ''))}
                                                placeholder="MM/AA"
                                                maxLength="5"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>CVV *</label>
                                            <input
                                                type="text"
                                                value={paymentData.cvv}
                                                onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/[^\d]/g, ''))}
                                                placeholder="123"
                                                maxLength="4"
                                                required
                                            />
                                        </div>

                                        <div className="form-group full-width">
                                            <label>Nombre en la Tarjeta *</label>
                                            <input
                                                type="text"
                                                value={paymentData.cardName}
                                                onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                                                placeholder="Nombre como aparece en la tarjeta"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentData.method === 'bank_transfer' && (
                                <div className="payment-form">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Banco *</label>
                                            <select
                                                value={paymentData.bankTransfer.bank}
                                                onChange={(e) => handlePaymentChange('bankTransfer.bank', e.target.value)}
                                                required
                                            >
                                                <option value="">Selecciona tu banco</option>
                                                {banks.map(bank => (
                                                    <option key={bank} value={bank}>{bank}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Tipo de Cuenta</label>
                                            <select
                                                value={paymentData.bankTransfer.accountType}
                                                onChange={(e) => handlePaymentChange('bankTransfer.accountType', e.target.value)}
                                            >
                                                <option value="current">Cuenta Corriente</option>
                                                <option value="savings">Cuenta de Ahorros</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="transfer-info">
                                        <p><strong>Información para la transferencia:</strong></p>
                                        <p>Te enviaremos los detalles bancarios por correo después de confirmar el pedido.</p>
                                    </div>
                                </div>
                            )}

                            {paymentData.method === 'cash' && (
                                <div className="cash-info">
                                    <div className="info-box">
                                        <i className="fa fa-info-circle"></i>
                                        <div>
                                            <h4>Pago Contra Entrega</h4>
                                            <p>Pagarás en efectivo al momento de recibir tu pedido. Asegúrate de tener el monto exacto.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Paso 3: Confirmación */}
                    {currentStep === 3 && (
                        <div className="checkout-step">
                            <h2>✅ Confirmar Pedido</h2>

                            <div className="confirmation-sections">
                                <div className="confirmation-section">
                                    <h3>📦 Información de Envío</h3>
                                    <div className="confirmation-data">
                                        <p><strong>{shippingData.fullName}</strong></p>
                                        <p>{shippingData.email}</p>
                                        <p>{shippingData.phone}</p>
                                        <p>{shippingData.address}</p>
                                        <p>{shippingData.city}, {shippingData.province}</p>
                                        {shippingData.specialInstructions && (
                                            <p><em>Instrucciones: {shippingData.specialInstructions}</em></p>
                                        )}
                                    </div>
                                </div>

                                <div className="confirmation-section">
                                    <h3>💳 Método de Pago</h3>
                                    <div className="confirmation-data">
                                        {paymentData.method === 'card' && (
                                            <p>Tarjeta terminada en ****{(paymentData.cardNumber || '').replace(/\s+/g, '').slice(-4)}</p>
                                        )}
                                        {paymentData.method === 'bank_transfer' && (
                                            <p>Transferencia - {paymentData.bankTransfer.bank}</p>
                                        )}
                                        {paymentData.method === 'cash' && (
                                            <p>Efectivo contra entrega</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botones de Navegación */}
                    <div className="checkout-navigation">
                        <div className="nav-buttons">
                            {currentStep > 1 && (
                                <button onClick={handlePreviousStep} className="btn-previous" type="button">
                                    <i className="fa fa-arrow-left"></i>
                                    Anterior
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    onClick={handleNextStep}
                                    className="btn-next"
                                    type="button"
                                    disabled={(currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2())}
                                >
                                    Siguiente
                                    <i className="fa fa-arrow-right"></i>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitOrder}
                                    className="btn-place-order"
                                    type="button"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <i className="fa fa-spinner fa-spin"></i>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-check"></i>
                                            Confirmar Pedido
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumen del Pedido */}
                <div className="order-summary">
                    <div className="summary-card">
                        <h3>Resumen del Pedido</h3>

                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                    </div>
                                    <span className="item-total">
                                        ₡{(Number(item.numericPrice || 0) * Number(item.quantity || 0)).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-line">
                                <span>Subtotal:</span>
                                <span>₡{calculateSubtotal().toLocaleString()}</span>
                            </div>
                            <div className="summary-line">
                                <span>Envío:</span>
                                <span>
                                    {calculateShipping() === 0 ? 'Gratis' : `₡${calculateShipping().toLocaleString()}`}
                                </span>
                            </div>
                            <div className="summary-line total">
                                <span>Total:</span>
                                <span>₡{calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/cart" className="btn-edit-cart">
                        <i className="fa fa-edit"></i>
                        Editar Carrito
                    </Link>
                </div>
            </div>
        </div>
    );
};