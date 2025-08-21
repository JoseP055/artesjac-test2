import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/orders.css';
import { BuyerOrdersAPI } from '../api/buyerOrders.service';

const normalizeStatusForUI = (status) => {
    // Backend usa "enviado"; la UI muestra "en-transito"
    if (status === 'enviado') return 'en-transito';
    return status;
};

const getStatusColor = (status) => {
    switch (status) {
        case 'entregado': return '#4caf50';
        case 'en-transito': return '#ff9800';
        case 'pendiente': return '#2196f3';
        case 'cancelado': return '#f44336';
        case 'retraso': return '#ff5722';
        default: return '#666';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'entregado': return 'Entregado';
        case 'en-transito': return 'En tránsito';
        case 'pendiente': return 'Pendiente';
        case 'cancelado': return 'Cancelado';
        case 'retraso': return 'Con Retraso';
        default: return status;
    }
};

// Fallback local si la API falla
const mockOrders = [
    {
        _id: 'mock-ORD-001',
        code: 'ORD-001',
        date: '2024-01-15',
        status: 'entregado',
        total: 45000,
        items: [
            { name: 'Collar artesanal de semillas', quantity: 1, price: 12000 },
            { name: 'Bolso tejido a mano', quantity: 1, price: 18500 },
            { name: 'Aretes de madera tallada', quantity: 2, price: 8500 }
        ],
        shipping: { address: 'Desamparados, San José, Costa Rica', method: 'Envío estándar', tracking: 'CR123456789' }
    },
    {
        _id: 'mock-ORD-002',
        code: 'ORD-002',
        date: '2024-01-10',
        status: 'enviado',
        total: 28000,
        items: [
            { name: 'Cuadro colorido abstracto', quantity: 1, price: 22000 },
            { name: 'Pulsera de cuentas naturales', quantity: 1, price: 9800 }
        ],
        shipping: { address: 'Desamparados, San José, Costa Rica', method: 'Envío express', tracking: 'CR123456790' }
    }
];

export const OrdersPage = () => {
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState('');

    const loadOrders = useCallback(async () => {
        setLoadingList(true);
        setError('');
        try {
            const res = await BuyerOrdersAPI.list();
            const data = res.data?.data || [];
            const mapped = data.map(o => ({
                id: o._id,
                code: o.code,
                date: o.date,
                status: normalizeStatusForUI(o.status),
                total: o.total,
                items: o.items || [],
                shipping: o.shipping || {},
            }));
            setOrders(mapped);
        } catch (e) {
            console.error(e);
            setOrders(mockOrders.map(o => ({
                id: o._id,
                code: o.code,
                date: o.date,
                status: normalizeStatusForUI(o.status),
                total: o.total,
                items: o.items,
                shipping: o.shipping
            })));
            setError(e?.response?.data?.error || 'No se pudieron cargar tus pedidos. Mostrando datos de ejemplo.');
        } finally {
            setLoadingList(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const selectedOrder = useMemo(() => {
        if (!id) return null;
        return orders.find(o => o.id === id) || null;
    }, [id, orders]);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            if (selectedOrder) return;
            setLoadingDetail(true);
            try {
                const res = await BuyerOrdersAPI.getById(id);
                const o = res.data?.data;
                if (!o) return;
                const mapped = {
                    id: o._id,
                    code: o.code,
                    date: o.date,
                    status: normalizeStatusForUI(o.status),
                    total: o.total,
                    items: o.items || [],
                    shipping: o.shipping || {}
                };
                setOrders(prev => {
                    const exists = prev.some(p => p.id === mapped.id);
                    return exists ? prev.map(p => (p.id === mapped.id ? mapped : p)) : [mapped, ...prev];
                });
            } catch (e) {
                console.error(e);
                setError(e?.response?.data?.error || 'No se pudo cargar el detalle del pedido.');
            } finally {
                setLoadingDetail(false);
            }
        };
        fetchDetail();
    }, [id, selectedOrder]);

    // ======= DETALLE =======
    if (id) {
        if (loadingDetail && !selectedOrder) {
            return (
                <main className="orders-container">
                    <div className="order-loading">
                        <div className="loading-spinner" />
                        <p>Cargando pedido...</p>
                    </div>
                </main>
            );
        }

        if (!selectedOrder) {
            return (
                <main className="orders-container">
                    <div className="order-not-found">
                        <h2>Pedido no encontrado</h2>
                        <p>El pedido que buscás no existe o no tenés permisos para verlo.</p>
                        <Link to="/orders" className="btn-back">Ver todos mis pedidos</Link>
                    </div>
                </main>
            );
        }

        const order = selectedOrder;
        return (
            <main className="orders-container">
                <div className="order-detail-header">
                    <Link to="/orders" className="btn-back">
                        <i className="fa fa-arrow-left"></i> Volver a mis pedidos
                    </Link>
                    <h1>Detalle del Pedido #{order.code || order.id.slice(-6)}</h1>
                </div>

                <div className="order-detail-content">
                    {error && (
                        <div className="error-message" style={{ marginBottom: 16 }}>
                            <i className="fa fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="order-summary-card">
                        <div className="order-status-section">
                            <h3>Estado del pedido</h3>
                            <span
                                className="status-badge large"
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {getStatusText(order.status)}
                            </span>
                            <p className="order-date">
                                Realizado el {new Date(order.date).toLocaleDateString('es-CR')}
                            </p>
                        </div>

                        <div className="shipping-info">
                            <h3>Información de envío</h3>
                            <p><strong>Dirección:</strong> {order.shipping?.address || '—'}</p>
                            <p><strong>Método:</strong> {order.shipping?.method || '—'}</p>
                            <p><strong>Tracking:</strong> {order.shipping?.tracking || '—'}</p>
                        </div>
                    </div>

                    <div className="order-items-card">
                        <h3>Productos del pedido</h3>
                        <div className="order-items-list">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item-detail">
                                    <div className="item-image"><div className="product-image-sim" /></div>
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>Cantidad: {item.quantity}</p>
                                        <p className="item-price">₡{Number(item.price).toLocaleString()} c/u</p>
                                    </div>
                                    <div className="item-total">
                                        ₡{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-total-section">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>₡{Number(order.total).toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="total-row final">
                                <span>Total:</span>
                                <span>₡{Number(order.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // ======= LISTA =======
    if (loadingList) {
        return (
            <main className="orders-container">
                <div className="order-loading">
                    <div className="loading-spinner" />
                    <p>Cargando tus pedidos...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="orders-container">
            <div className="orders-header">
                <h1>Mis Pedidos</h1>
                <p>{orders.length} pedidos realizados</p>
                <div className="orders-dashboard-action">
                    <Link to="/buyer/dashboard" className="btn-dashboard">
                        <i className="fa fa-tachometer-alt"></i> Ir al Dashboard
                    </Link>
                </div>
            </div>

            {error && (
                <div className="error-message" style={{ marginBottom: 16 }}>
                    <i className="fa fa-exclamation-triangle"></i>
                    <span>{error}</span>
                </div>
            )}

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <div className="order-info">
                                <h3>Pedido #{order.code || order.id.slice(-6)}</h3>
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
                                <strong>Productos:</strong> {order.items.map(i => i.name).join(', ')}
                            </div>
                            <div className="order-total-preview">
                                <strong>Total: ₡{Number(order.total).toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="order-card-actions">
                            <Link to={`/orders/${order.id}`} className="btn-view-detail">
                                Ver detalles
                            </Link>
                            {order.status === 'entregado' && (
                                <button className="btn-reorder" onClick={() => alert('Próximamente: volver a comprar 🙂')}>
                                    Volver a comprar
                                </button>
                            )}
                            {order.status === 'en-transito' && (
                                <button className="btn-track" onClick={() => alert(order.shipping?.tracking || 'Sin tracking')}>
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
