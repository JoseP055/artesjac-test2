import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/order-confirmation.css';

export const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Obtener datos del pedido - en un proyecto real vendría de la API
    useEffect(() => {
        const orderId = searchParams.get('orderId') || 'ORD-' + Date.now().toString().slice(-6);
        
        // Simular una llamada a la API
        setTimeout(() => {
            const mockOrderData = {
                orderId: orderId,
                orderDate: new Date().toISOString(),
                status: 'confirmado',
                customer: {
                    name: 'Ana María Rojas',
                    email: 'ana.rojas@email.com',
                    phone: '+506 8888-9999'
                },
                items: [
                    {
                        id: 1,
                        name: 'Collar artesanal de semillas',
                        price: 12000,
                        quantity: 1,
                        category: 'joyeria'
                    },
                    {
                        id: 2,
                        name: 'Bolso tejido a mano',
                        price: 18500,
                        quantity: 1,
                        category: 'textil'
                    }
                ],
                shipping: {
                    address: 'Desamparados, San José, Costa Rica',
                    method: 'Envío estándar',
                    estimatedDelivery: '3-5 días hábiles',
                    cost: 0 // Envío gratis
                },
                payment: {
                    method: 'Tarjeta de crédito',
                    last4: '****1234',
                    subtotal: 30500,
                    shipping: 0,
                    total: 30500
                }
            };
            
            setOrderData(mockOrderData);
            setIsLoading(false);

            // Limpiar carrito después de confirmar pedido
            localStorage.removeItem('artesjac-cart');
        }, 1500);
    }, [searchParams]);

    const handlePrintOrder = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // En un proyecto real, esto generaría un PDF
        alert('Funcionalidad de descarga PDF próximamente disponible');
    };

    const handleContinueShopping = () => {
        navigate('/shop');
    };

    const handleTrackOrder = () => {
        navigate(`/orders/${orderData.orderId}`);
    };

    if (isLoading) {
        return (
            <main className="confirmation-container">
                <div className="loading-state">
                    <div className="loading-spinner">
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                    <h2>Procesando tu pedido...</h2>
                    <p>Por favor espera mientras confirmamos tu compra</p>
                </div>
            </main>
        );
    }

    if (!orderData) {
        return (
            <main className="confirmation-container">
                <div className="error-state">
                    <i className="fa fa-exclamation-triangle"></i>
                    <h2>Error al procesar el pedido</h2>
                    <p>Ha ocurrido un problema. Por favor contacta a soporte.</p>
                    <Link to="/shop" className="btn-back-shop">
                        Volver a la tienda
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="confirmation-container">
            {/* Header de confirmación */}
            <section className="confirmation-hero">
                <div className="success-icon">
                    <i className="fa fa-check-circle"></i>
                </div>
                <h1>¡Pedido confirmado!</h1>
                <p>Gracias por tu compra en ArtesJAC</p>
                <div className="order-number">
                    <span>Número de pedido: <strong>#{orderData.orderId}</strong></span>
                </div>
            </section>

            {/* Contenido principal */}
            <div className="confirmation-content">
                {/* Información del pedido */}
                <div className="order-info-section">
                    <div className="info-card">
                        <h3>
                            <i className="fa fa-info-circle"></i>
                            ¿Qué sigue ahora?
                        </h3>
                        <div className="next-steps">
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa fa-envelope"></i>
                                </div>
                                <div className="step-content">
                                    <h4>Confirmación por email</h4>
                                    <p>Te hemos enviado los detalles del pedido a <strong>{orderData.customer.email}</strong></p>
                                </div>
                            </div>
                            
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa fa-box"></i>
                                </div>
                                <div className="step-content">
                                    <h4>Preparación del pedido</h4>
                                    <p>Nuestros artesanos prepararán cuidadosamente tus productos</p>
                                </div>
                            </div>
                            
                            <div className="step">
                                <div className="step-icon">
                                    <i className="fa fa-truck"></i>
                                </div>
                                <div className="step-content">
                                    <h4>Envío</h4>
                                    <p>Entrega estimada: {orderData.shipping.estimatedDelivery}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información de envío */}
                    <div className="info-card">
                        <h3>
                            <i className="fa fa-map-marker-alt"></i>
                            Información de envío
                        </h3>
                        <div className="shipping-details">
                            <p><strong>Dirección de entrega:</strong></p>
                            <p>{orderData.shipping.address}</p>
                            <p><strong>Método de envío:</strong> {orderData.shipping.method}</p>
                            <p><strong>Tiempo estimado:</strong> {orderData.shipping.estimatedDelivery}</p>
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="info-card">
                        <h3>
                            <i className="fa fa-user"></i>
                            Información de contacto
                        </h3>
                        <div className="contact-details">
                            <p><strong>Nombre:</strong> {orderData.customer.name}</p>
                            <p><strong>Email:</strong> {orderData.customer.email}</p>
                            <p><strong>Teléfono:</strong> {orderData.customer.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="order-summary-section">
                    <div className="summary-card">
                        <h3>
                            <i className="fa fa-shopping-bag"></i>
                            Resumen del pedido
                        </h3>
                        
                        <div className="order-items">
                            {orderData.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <div className="item-image">
                                        <div className="product-image-sim"></div>
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-category">
                                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                        </p>
                                        <p className="item-quantity">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ₡{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>₡{orderData.payment.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Envío:</span>
                                <span>{orderData.payment.shipping === 0 ? 'Gratis' : `₡${orderData.payment.shipping.toLocaleString()}`}</span>
                            </div>
                            <div className="total-row final">
                                <span>Total pagado:</span>
                                <span>₡{orderData.payment.total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="payment-info">
                            <h4>
                                <i className="fa fa-credit-card"></i>
                                Método de pago
                            </h4>
                            <p>{orderData.payment.method} terminada en {orderData.payment.last4}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Acciones principales */}
            <section className="confirmation-actions">
                <div className="action-buttons">
                    <button 
                        className="btn-primary"
                        onClick={handleTrackOrder}
                    >
                        <i className="fa fa-search"></i>
                        Rastrear pedido
                    </button>
                    
                    <button 
                        className="btn-secondary"
                        onClick={handleContinueShopping}
                    >
                        <i className="fa fa-shopping-cart"></i>
                        Continuar comprando
                    </button>
                </div>

                <div className="utility-buttons">
                    <button 
                        className="btn-utility"
                        onClick={handlePrintOrder}
                    >
                        <i className="fa fa-print"></i>
                        Imprimir
                    </button>
                    
                    <button 
                        className="btn-utility"
                        onClick={handleDownloadPDF}
                    >
                        <i className="fa fa-download"></i>
                        Descargar PDF
                    </button>
                </div>
            </section>

            {/* Soporte y ayuda */}
            <section className="support-section">
                <div className="support-card">
                    <h3>¿Necesitas ayuda?</h3>
                    <p>Nuestro equipo de soporte está aquí para ayudarte</p>
                    <div className="support-options">
                        <a href="mailto:soporte@artesjac.com" className="support-option">
                            <i className="fa fa-envelope"></i>
                            <span>soporte@artesjac.com</span>
                        </a>
                        <a href="tel:+50622345678" className="support-option">
                            <i className="fa fa-phone"></i>
                            <span>+506 2234-5678</span>
                        </a>
                        <a href="https://wa.me/50688889999" className="support-option" target="_blank" rel="noopener noreferrer">
                            <i className="fa fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Productos relacionados */}
            <section className="related-products">
                <h3>Te podría interesar</h3>
                <div className="products-grid">
                    <Link to="/product/5" className="related-product">
                        <div className="product-image-sim"></div>
                        <h4>Aretes de madera tallada</h4>
                        <p>₡8.500</p>
                    </Link>
                    <Link to="/product/9" className="related-product">
                        <div className="product-image-sim"></div>
                        <h4>Pulsera de cuentas naturales</h4>
                        <p>₡9.800</p>
                    </Link>
                    <Link to="/product/4" className="related-product">
                        <div className="product-image-sim"></div>
                        <h4>Vasija de cerámica tradicional</h4>
                        <p>₡15.800</p>
                    </Link>
                </div>
            </section>
        </main>
    );
};