import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/checkout.css';

export const CheckoutPage = () => {
    const navigate = useNavigate();

    // Cargar productos del carrito desde localStorage
    const [cartItems, setCartItems] = useState([]);
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const [countdown, setCountdown] = useState(3);

    // Estados para los formularios
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Costa Rica'
    });

    const [paymentInfo, setPaymentInfo] = useState({
        paymentMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Debug: Verificar localStorage al cargar la página
    useEffect(() => {
        console.log('CheckoutPage montado');
        console.log('localStorage artesjac-cart:', localStorage.getItem('artesjac-cart'));
    }, []);

    // Cargar carrito desde localStorage
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem('artesjac-cart');
                console.log('Raw localStorage:', savedCart);
                
                if (savedCart && savedCart !== 'null' && savedCart !== '[]') {
                    const cart = JSON.parse(savedCart);
                    console.log('Carrito parseado:', cart);
                    
                    if (Array.isArray(cart) && cart.length > 0) {
                        setCartItems(cart);
                        console.log('Carrito cargado exitosamente:', cart.length, 'items');
                    } else {
                        console.log('Carrito está vacío o no es válido');
                        setCartItems([]);
                    }
                } else {
                    console.log('No hay carrito guardado o está vacío');
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Error al cargar carrito:', error);
                setCartItems([]);
            }
            
            setIsLoadingCart(false);
        };

        // Pequeño delay para asegurar que el DOM esté listo
        const timer = setTimeout(loadCart, 300);
        return () => clearTimeout(timer);
    }, []);

    // Redirigir si el carrito está vacío SOLO después de cargar
    useEffect(() => {
        if (!isLoadingCart && cartItems.length === 0) {
            console.log('Carrito vacío, iniciando cuenta regresiva...');
            
            // Cuenta regresiva
            const countdownTimer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        navigate('/cart');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownTimer);
        }
    }, [cartItems, navigate, isLoadingCart]);

    // Funciones para manejar cambios en los formularios
    const handlePersonalChange = (e) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value
        });
        // Limpiar error si existe
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ''
            }));
        }
    };

    const handleShippingChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
        // Limpiar error si existe
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ''
            }));
        }
    };

    const handlePaymentChange = (e) => {
        setPaymentInfo({
            ...paymentInfo,
            [e.target.name]: e.target.value
        });
        // Limpiar error si existe
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ''
            }));
        }
    };

    // Validación de formularios
    const validateForm = () => {
        const newErrors = {};

        // Validar información personal
        if (!personalInfo.firstName.trim()) newErrors.firstName = 'Nombre es requerido';
        if (!personalInfo.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
        if (!personalInfo.email.trim()) {
            newErrors.email = 'Email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
            newErrors.email = 'Email no es válido';
        }
        if (!personalInfo.phone.trim()) newErrors.phone = 'Teléfono es requerido';

        // Validar dirección
        if (!shippingInfo.address.trim()) newErrors.address = 'Dirección es requerida';
        if (!shippingInfo.city.trim()) newErrors.city = 'Ciudad es requerida';
        if (!shippingInfo.province.trim()) newErrors.province = 'Provincia es requerida';

        // Validar pago (solo para tarjeta)
        if (paymentInfo.paymentMethod === 'card') {
            if (!paymentInfo.cardNumber.trim()) {
                newErrors.cardNumber = 'Número de tarjeta es requerido';
            } else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
                newErrors.cardNumber = 'Número de tarjeta no es válido';
            }
            if (!paymentInfo.expiryDate.trim()) {
                newErrors.expiryDate = 'Fecha de vencimiento es requerida';
            } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
                newErrors.expiryDate = 'Formato debe ser MM/AA';
            }
            if (!paymentInfo.cvv.trim()) {
                newErrors.cvv = 'CVV es requerido';
            } else if (paymentInfo.cvv.length < 3) {
                newErrors.cvv = 'CVV debe tener 3-4 dígitos';
            }
            if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Nombre en la tarjeta es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Calcular totales
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
    };

    const shippingCost = calculateSubtotal() > 50000 ? 0 : 2500; // Envío gratis para compras > ₡50,000
    const tax = calculateSubtotal() * 0.13; // 13% IVA en Costa Rica
    const total = calculateSubtotal() + shippingCost + tax;

    // Formatear número de tarjeta con espacios
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    // Formatear fecha de expiración
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    // Manejar formato de número de tarjeta
    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setPaymentInfo({
            ...paymentInfo,
            cardNumber: formatted
        });
    };

    // Manejar formato de fecha de expiración
    const handleExpiryDateChange = (e) => {
        const formatted = formatExpiryDate(e.target.value);
        setPaymentInfo({
            ...paymentInfo,
            expiryDate: formatted
        });
    };

    // Procesar pedido
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Hacer scroll al primer error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setIsProcessing(true);

        // Simular procesamiento del pedido
        setTimeout(() => {
            setIsProcessing(false);
            const orderId = 'ORD-' + Date.now().toString().slice(-6);
            
            // Guardar información del pedido para la confirmación
            const orderData = {
                orderId,
                personalInfo,
                shippingInfo,
                paymentInfo,
                items: cartItems,
                totals: {
                    subtotal: calculateSubtotal(),
                    shipping: shippingCost,
                    tax: Math.round(tax),
                    total: Math.round(total)
                }
            };
            
            localStorage.setItem('last-order', JSON.stringify(orderData));
            navigate(`/order-confirmation?orderId=${orderId}`);
        }, 2000);
    };

    // Mostrar loading si está cargando el carrito
    if (isLoadingCart) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div style={{
                        textAlign: 'center', 
                        padding: '4rem 2rem',
                        backgroundColor: '#1f1f1f',
                        borderRadius: '12px',
                        marginTop: '2rem'
                    }}>
                        <i className="fa fa-spinner fa-spin" style={{fontSize: '3rem', color: '#ff5722', marginBottom: '1rem'}}></i>
                        <h2>Cargando checkout...</h2>
                        <p>Verificando productos en el carrito</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar mensaje si el carrito está vacío
    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div style={{
                        textAlign: 'center', 
                        backgroundColor: '#1f1f1f', 
                        padding: '4rem 2rem', 
                        borderRadius: '12px',
                        marginTop: '2rem'
                    }}>
                        <i className="fa fa-shopping-cart" style={{fontSize: '3rem', color: '#666', marginBottom: '1rem'}}></i>
                        <h2>Tu carrito está vacío</h2>
                        <p>No hay productos para proceder al checkout</p>
                        
                        <div style={{
                            backgroundColor: '#2b2b2b',
                            padding: '1rem',
                            borderRadius: '8px',
                            margin: '2rem 0',
                            border: '1px solid #ff5722'
                        }}>
                            <p style={{color: '#ff5722', margin: '0 0 0.5rem 0'}}>
                                Redirigiendo al carrito en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                            </p>
                            <div style={{
                                width: '100%',
                                height: '4px',
                                backgroundColor: '#444',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${((3 - countdown) / 3) * 100}%`,
                                    height: '100%',
                                    backgroundColor: '#ff5722',
                                    transition: 'width 1s ease'
                                }}></div>
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
                            <Link to="/shop" style={{
                                backgroundColor: '#ff5722',
                                color: 'white',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                            }}>
                                Ir a la tienda
                            </Link>
                            <Link to="/cart" style={{
                                backgroundColor: 'transparent',
                                color: '#ff5722',
                                border: '1px solid #ff5722',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                            }}>
                                Ver carrito ahora
                            </Link>
                        </div>

                        {/* Debug info */}
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: '#333',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#aaa'
                        }}>
                            <strong>Debug Info:</strong><br/>
                            localStorage: {localStorage.getItem('artesjac-cart') || 'null'}<br/>
                            cartItems.length: {cartItems.length}<br/>
                            isLoadingCart: {isLoadingCart.toString()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1 className="checkout-title">Finalizar Compra</h1>

                <div className="checkout-content">
                    {/* Formularios */}
                    <div className="checkout-forms">
                        {/* Información Personal */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <i className="fa fa-user"></i>
                                Información Personal
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={personalInfo.firstName}
                                        onChange={handlePersonalChange}
                                        className={errors.firstName ? 'error' : ''}
                                        placeholder="Tu nombre"
                                    />
                                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Apellido *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={personalInfo.lastName}
                                        onChange={handlePersonalChange}
                                        className={errors.lastName ? 'error' : ''}
                                        placeholder="Tu apellido"
                                    />
                                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={personalInfo.email}
                                        onChange={handlePersonalChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Teléfono *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={personalInfo.phone}
                                        onChange={handlePersonalChange}
                                        className={errors.phone ? 'error' : ''}
                                        placeholder="8888-8888"
                                    />
                                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Dirección de Envío */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <i className="fa fa-truck"></i>
                                Dirección de Envío
                            </h2>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Dirección *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleShippingChange}
                                        className={errors.address ? 'error' : ''}
                                        placeholder="Calle, número, detalles"
                                    />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Ciudad *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleShippingChange}
                                        className={errors.city ? 'error' : ''}
                                        placeholder="San José"
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Provincia *</label>
                                    <select
                                        name="province"
                                        value={shippingInfo.province}
                                        onChange={handleShippingChange}
                                        className={errors.province ? 'error' : ''}
                                    >
                                        <option value="">Seleccionar provincia</option>
                                        <option value="San José">San José</option>
                                        <option value="Alajuela">Alajuela</option>
                                        <option value="Cartago">Cartago</option>
                                        <option value="Heredia">Heredia</option>
                                        <option value="Guanacaste">Guanacaste</option>
                                        <option value="Puntarenas">Puntarenas</option>
                                        <option value="Limón">Limón</option>
                                    </select>
                                    {errors.province && <span className="error-message">{errors.province}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Código Postal</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={shippingInfo.postalCode}
                                        onChange={handleShippingChange}
                                        placeholder="10101"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <i className="fa fa-credit-card"></i>
                                Método de Pago
                            </h2>
                            
                            <div className="payment-methods">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentInfo.paymentMethod === 'card'}
                                        onChange={handlePaymentChange}
                                    />
                                    <span className="payment-label">
                                        <i className="fa fa-credit-card"></i>
                                        Tarjeta de Crédito/Débito
                                    </span>
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="sinpe"
                                        checked={paymentInfo.paymentMethod === 'sinpe'}
                                        onChange={handlePaymentChange}
                                    />
                                    <span className="payment-label">
                                        <i className="fa fa-mobile"></i>
                                        SINPE Móvil
                                    </span>
                                </label>
                            </div>

                            {paymentInfo.paymentMethod === 'card' && (
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Número de Tarjeta *</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={paymentInfo.cardNumber}
                                            onChange={handleCardNumberChange}
                                            className={errors.cardNumber ? 'error' : ''}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                        />
                                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha de Vencimiento *</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={paymentInfo.expiryDate}
                                            onChange={handleExpiryDateChange}
                                            className={errors.expiryDate ? 'error' : ''}
                                            placeholder="MM/AA"
                                            maxLength="5"
                                        />
                                        {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>CVV *</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={paymentInfo.cvv}
                                            onChange={handlePaymentChange}
                                            className={errors.cvv ? 'error' : ''}
                                            placeholder="123"
                                            maxLength="4"
                                        />
                                        {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Nombre en la Tarjeta *</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={paymentInfo.cardName}
                                            onChange={handlePaymentChange}
                                            className={errors.cardName ? 'error' : ''}
                                            placeholder="Nombre como aparece en la tarjeta"
                                        />
                                        {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                                    </div>
                                </div>
                            )}

                            {paymentInfo.paymentMethod === 'sinpe' && (
                                <div className="sinpe-info">
                                    <p>Realizarás el pago via SINPE Móvil al número: <strong>8888-8888</strong></p>
                                    <p>Una vez realizado el pedido, recibirás las instrucciones completas por email.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen del Pedido */}
                    <div className="order-summary">
                        <h2 className="summary-title">Resumen del Pedido</h2>
                        
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>Categoría: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
                                        <p>Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ₡{(item.numericPrice * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>₡{calculateSubtotal().toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Envío:</span>
                                <span>
                                    {shippingCost === 0 ? (
                                        <span style={{color: '#4caf50'}}>¡Gratis!</span>
                                    ) : (
                                        `₡${shippingCost.toLocaleString()}`
                                    )}
                                </span>
                            </div>
                            {calculateSubtotal() < 50000 && shippingCost > 0 && (
                                <div className="shipping-note">
                                    <small style={{color: '#aaa', fontSize: '0.8rem'}}>
                                        Envío gratis en compras mayores a ₡50.000
                                    </small>
                                </div>
                            )}
                            <div className="total-row">
                                <span>IVA (13%):</span>
                                <span>₡{Math.round(tax).toLocaleString()}</span>
                            </div>
                            <div className="total-row final-total">
                                <span>Total:</span>
                                <span>₡{Math.round(total).toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            className={`place-order-btn ${isProcessing ? 'processing' : ''}`}
                            onClick={handlePlaceOrder}
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
                                    Realizar Pedido - ₡{Math.round(total).toLocaleString()}
                                </>
                            )}
                        </button>

                        <Link to="/cart" className="back-to-cart-btn">
                            <i className="fa fa-arrow-left"></i>
                            Volver al Carrito
                        </Link>

                        {/* Información de seguridad */}
                        <div className="security-badges" style={{marginTop: '1rem', padding: '1rem 0', borderTop: '1px solid #333'}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#aaa'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <i className="fa fa-shield-alt" style={{color: '#4caf50'}}></i>
                                    <span>Pago 100% seguro</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <i className="fa fa-truck" style={{color: '#4caf50'}}></i>
                                    <span>Envío a todo Costa Rica</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <i className="fa fa-undo" style={{color: '#4caf50'}}></i>
                                    <span>30 días para devoluciones</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};