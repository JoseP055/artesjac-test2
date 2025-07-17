import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/checkout.css';

export const CheckoutPage = () => {
    const navigate = useNavigate();

    // Productos del carrito (en una app real vendría de un contexto global)
    const [cartItems] = useState([
        {
            id: 1,
            name: "Collar Artesanal de Semillas",
            price: 12000,
            quantity: 1,
            artist: "María González"
        },
        {
            id: 2,
            name: "Bolso Tejido a Mano",
            price: 18500,
            quantity: 2,
            artist: "Carlos Jiménez"
        },
        {
            id: 3,
            name: "Cuadro Paisaje Costarricense",
            price: 22000,
            quantity: 1,
            artist: "Ana Rojas"
        }
    ]);

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

    // Funciones para manejar cambios en los formularios
    const handlePersonalChange = (e) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleShippingChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentInfo({
            ...paymentInfo,
            [e.target.name]: e.target.value
        });
    };

    // Validación de formularios
    const validateForm = () => {
        const newErrors = {};

        // Validar información personal
        if (!personalInfo.firstName.trim()) newErrors.firstName = 'Nombre es requerido';
        if (!personalInfo.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
        if (!personalInfo.email.trim()) newErrors.email = 'Email es requerido';
        if (!personalInfo.phone.trim()) newErrors.phone = 'Teléfono es requerido';

        // Validar dirección
        if (!shippingInfo.address.trim()) newErrors.address = 'Dirección es requerida';
        if (!shippingInfo.city.trim()) newErrors.city = 'Ciudad es requerida';
        if (!shippingInfo.province.trim()) newErrors.province = 'Provincia es requerida';

        // Validar pago (solo para tarjeta)
        if (paymentInfo.paymentMethod === 'card') {
            if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta es requerido';
            if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Fecha de vencimiento es requerida';
            if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV es requerido';
            if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Nombre en la tarjeta es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Calcular totales
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const shippingCost = 2500;
    const tax = calculateSubtotal() * 0.13; // 13% IVA en Costa Rica
    const total = calculateSubtotal() + shippingCost + tax;

    // Procesar pedido
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        // Simular procesamiento del pedido
        setTimeout(() => {
            setIsProcessing(false);
            alert('¡Pedido realizado con éxito! Recibirás un email de confirmación.');
            navigate('/order-confirmation');
        }, 2000);
    };

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
                                            onChange={handlePaymentChange}
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
                                            onChange={handlePaymentChange}
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
                                        <p>Por: {item.artist}</p>
                                        <p>Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ₡{(item.price * item.quantity).toLocaleString()}
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
                                <span>₡{shippingCost.toLocaleString()}</span>
                            </div>
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
                                    Realizar Pedido
                                </>
                            )}
                        </button>

                        <Link to="/cart" className="back-to-cart-btn">
                            <i className="fa fa-arrow-left"></i>
                            Volver al Carrito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};