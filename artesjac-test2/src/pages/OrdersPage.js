import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/orders.css';

export const OrdersPage = () => {
    const { id } = useParams();
    
    // Mock data de pedidos
    const orders = [
        {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'entregado',
            total: 45000,
            items: [
                { name: 'Collar artesanal de semillas', quantity: 1, price: 12000 },
                { name: 'Bolso tejido a mano', quantity: 1, price: 18500 },
                { name: 'Aretes de madera tallada', quantity: 2, price: 8500 }
            ],
            shipping: {
                address: 'Desamparados, San José, Costa Rica',
                method: 'Envío estándar',
                tracking: 'CR123456789'
            }
        },
        {
            id: 'ORD-002',
            date: '2024-01-10',
            status: 'en-transito',
            total: 28000,
            items: [
                { name: 'Cuadro colorido abstracto', quantity: 1, price: 22000 },
                { name: 'Pulsera de cuentas naturales', quantity: 1, price: 9800 }
            ],
            shipping: {
                address: 'Desamparados, San José, Costa Rica',
                method: 'Envío express',
                tracking: 'CR123456790'
            }
        },
        {
            id: 'ORD-003',
            date: '2024-01-05',
            status: 'entregado',
            total: 19500,
            items: [
                { name: 'Vasija de cerámica tradicional', quantity: 1, price: 15800 },
                { name: 'Platos decorativos de barro', quantity: 1, price: 19500 }
            ],
            shipping: {
                address: 'Desamparados, San José, Costa Rica',
                method: 'Envío estándar',
                tracking: 'CR123456791'
            }
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'entregado': return '#4caf50';
            case 'en-transito': return '#ff9800';
            case 'pendiente': return '#2196f3';
            case 'cancelado': return '#f44336';
            default: return '#666';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'entregado': return 'Entregado';
            case 'en-transito': return 'En tránsito';
            case 'pendiente': return 'Pendiente';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };

    // Si hay un ID específico, mostrar detalle del pedido
    if (id) {
        const order = orders.find(o => o.id === id);
        
        if (!order) {
            return (
                <main className="orders-container">
                    <div className="order-not-found">
                        <h2>Pedido no encontrado</h2>
                        <p>El pedido que buscas no existe o no tienes permisos para verlo.</p>
                        <Link to="/orders" className="btn-back">
                            Ver todos mis pedidos
                        </Link>
                    </div>
                </main>
            );
        }

        return (
            <main className="orders-container">
                <div className="order-detail-header">
                    <Link to="/orders" className="btn-back">
                        <i className="fa fa-arrow-left"></i> Volver a mis pedidos
                    </Link>
                    <h1>Detalle del Pedido #{order.id}</h1>
                </div>

                <div className="order-detail-content">
                    <div className="order-summary-card">
                        <div className="order-status-section">
                            <h3>Estado del pedido</h3>
                            <span 
                                className="status-badge large"
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {getStatusText(order.status)}
                            </span>
                            <p className="order-date">Realizado el {new Date(order.date).toLocaleDateString('es-CR')}</p>
                        </div>

                        <div className="shipping-info">
                            <h3>Información de envío</h3>
                            <p><strong>Dirección:</strong> {order.shipping.address}</p>
                            <p><strong>Método:</strong> {order.shipping.method}</p>
                            <p><strong>Tracking:</strong> {order.shipping.tracking}</p>
                        </div>
                    </div>

                    <div className="order-items-card">
                        <h3>Productos del pedido</h3>
                        <div className="order-items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item-detail">
                                    <div className="item-image">
                                        <div className="product-image-sim"></div>
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>Cantidad: {item.quantity}</p>
                                        <p className="item-price">₡{item.price.toLocaleString()} c/u</p>
                                    </div>
                                    <div className="item-total">
                                        ₡{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="order-total-section">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>₡{order.total.toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="total-row final">
                                <span>Total:</span>
                                <span>₡{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Vista de lista de todos los pedidos
    return (
        <main className="orders-container">
            <div className="orders-header">
                <h1>Mis Pedidos</h1>
                <p>{orders.length} pedidos realizados</p>
            </div>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <div className="order-info">
                                <h3>Pedido #{order.id}</h3>
                                <p className="order-date">{new Date(order.date).toLocaleDateString('es-CR')}</p>
                            </div>
                            <div className="order-status">
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="order-card-content">
                            <div className="order-items-preview">
                                <strong>Productos:</strong> {order.items.map(item => item.name).join(', ')}
                            </div>
                            <div className="order-total-preview">
                                <strong>Total: ₡{order.total.toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="order-card-actions">
                            <Link to={`/orders/${order.id}`} className="btn-view-detail">
                                Ver detalles
                            </Link>
                            {order.status === 'entregado' && (
                                <button className="btn-reorder">
                                    Volver a comprar
                                </button>
                            )}
                            {order.status === 'en-transito' && (
                                <button className="btn-track">
                                    Rastrear pedido
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="orders-actions">
                <Link to="/shop" className="btn-continue-shopping">
                    <i className="fa fa-arrow-left"></i> Continuar comprando
                </Link>
            </div>
        </main>
    );
};