import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { api } from '../api';
import '../styles/order-confirmation.css';

export const OrderConfirmation = () => {
    const { id: orderCode } = useParams(); // código del pedido desde la URL
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (orderCode) {
            loadOrderData(orderCode);
        } else {
            setError('Código de pedido no proporcionado');
            setIsLoading(false);
        }
    }, [orderCode, user, navigate]);

    const loadOrderData = async (code) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('🔍 Cargando pedido:', code);

            const { data } = await api.get(`/buyer-orders/${code}`);

            if (data?.ok && data?.data) {
                console.log('✅ Pedido cargado:', data.data);
                setOrderData(data.data);
            } else {
                setError('Pedido no encontrado');
            }
        } catch (error) {
            console.error('💥 Error al cargar pedido:', error);
            if (error.response?.status === 404) {
                setError('Pedido no encontrado');
            } else if (error.response?.status === 401) {
                navigate('/login');
                return;
            } else {
                setError('Error al cargar el pedido');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'card': return 'Tarjeta de crédito';
            case 'bank_transfer': return 'Transferencia bancaria';
            case 'cash': return 'Efectivo contra entrega';
            default: return method;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePrintOrder = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        alert('Funcionalidad de descarga PDF próximamente disponible');
    };

    const handleContinueShopping = () => {
        navigate('/shop');
    };

    const handleTrackOrder = () => {
        navigate(`/orders/${orderData.code}`);
    };

    if (isLoading) {
        return (
            <main className="confirmation-container">
                <div className="loading-state">
                    <div className="loading-spinner">
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                    <h2>Cargando información del pedido...</h2>
                    <p>Por favor espera mientras obtenemos los detalles</p>
                </div>
            </main>
        );
    }

    if (error || !orderData) {
        return (
            <main className="confirmation-container">
                <div className="error-state">
                    <i className="fa fa-exclamation-triangle"></i>
                    <h2>Error al cargar el pedido</h2>
                    <p>{error || 'No se pudo encontrar el pedido solicitado'}</p>
                    <div className="error-actions">
                        <Link to="/orders" className="btn-back-shop">
                            <i className="fa fa-list"></i>
                            Ver mis pedidos
                        </Link>
                        <Link to="/shop" className="btn-back-shop">
                            <i className="fa fa-shopping-bag"></i>
                            Volver a la tienda
                        </Link>
                    </div>
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
                    <span>Número de pedido: <strong>#{orderData.code}</strong></span>
                </div>
                <div className="order-date">
                    <span>Fecha: {formatDate(orderData.date)}</span>
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
                            {orderData.shipping.tracking && (
                                <p><strong>Código de seguimiento:</strong> {orderData.shipping.tracking}</p>
                            )}
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="info-card">
                        <h3>
                            <i className="fa fa-user"></i>
                            Información de contacto
                        </h3>
                        <div className="contact-details">
                            <p><strong>Nombre:</strong> {orderData.customer.fullName}</p>
                            <p><strong>Email:</strong> {orderData.customer.email}</p>
                            <p><strong>Teléfono:</strong> {orderData.customer.phone}</p>
                            {orderData.customer.specialInstructions && (
                                <p><strong>Instrucciones especiales:</strong> {orderData.customer.specialInstructions}</p>
                            )}
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
                            {orderData.items.map((item, index) => (
                                <div key={item.productId || index} className="order-item">
                                    <div className="item-image">
                                        {item.productDetails?.images?.length > 0 ? (
                                            <img
                                                src={item.productDetails.images[0]}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="product-image-sim" style={{ display: item.productDetails?.images?.length > 0 ? 'none' : 'flex' }}>
                                            <i className="fa fa-image"></i>
                                        </div>
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-category">
                                            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Producto'}
                                        </p>
                                        <p className="item-quantity">Cantidad: {item.quantity}</p>
                                        {item.sellerDetails && (
                                            <p className="item-seller">Vendedor: {item.sellerDetails.name}</p>
                                        )}
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
                                <span>
                                    {orderData.payment.shipping === 0 ? 'Gratis' : `₡${orderData.payment.shipping.toLocaleString()}`}
                                </span>
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
                            <p>
                                {getPaymentMethodLabel(orderData.payment.method)}
                                {orderData.payment.cardLast4 && ` terminada en ****${orderData.payment.cardLast4}`}
                                {orderData.payment.bankName && ` - ${orderData.payment.bankName}`}
                            </p>
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

            {/* Información de estado del pedido */}
            <section className="order-status-section">
                <div className="status-card">
                    <h3>Estado del pedido</h3>
                    <div className={`status-badge status-${orderData.status}`}>
                        <i className="fa fa-check-circle"></i>
                        <span>{orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}</span>
                    </div>
                    <div className="status-timeline">
                        <div className={`timeline-step ${['confirmado', 'en_proceso', 'enviado', 'entregado'].includes(orderData.status) ? 'completed' : ''}`}>
                            <i className="fa fa-check"></i>
                            <span>Confirmado</span>
                        </div>
                        <div className={`timeline-step ${['en_proceso', 'enviado', 'entregado'].includes(orderData.status) ? 'completed' : ''}`}>
                            <i className="fa fa-cog"></i>
                            <span>En proceso</span>
                        </div>
                        <div className={`timeline-step ${['enviado', 'entregado'].includes(orderData.status) ? 'completed' : ''}`}>
                            <i className="fa fa-truck"></i>
                            <span>Enviado</span>
                        </div>
                        <div className={`timeline-step ${orderData.status === 'entregado' ? 'completed' : ''}`}>
                            <i className="fa fa-home"></i>
                            <span>Entregado</span>
                        </div>
                    </div>
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


        </main>
    );
};