import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import '../../styles/dashboard.css';

export const SellerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        activeProducts: 0,
        pendingOrders: 0,
        totalOrders: 0,
        avgRating: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        // Cargar datos del dashboard del vendedor
        setTimeout(() => {
            setStats({
                totalSales: 45,
                totalRevenue: 485000,
                activeProducts: 12,
                pendingOrders: 3,
                totalOrders: 45,
                avgRating: 4.8
            });

            // Cargar pedidos desde la misma fuente que SellerOrders
            const savedOrders = localStorage.getItem(`orders_${user?.id}`);
            let ordersData = [];

            if (savedOrders) {
                try {
                    ordersData = JSON.parse(savedOrders);
                } catch (error) {
                    console.error('Error al cargar pedidos:', error);
                    ordersData = getDefaultOrders();
                }
            } else {
                ordersData = getDefaultOrders();
            }

            // Mostrar solo los 5 más recientes
            const recentOrders = ordersData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(order => ({
                    id: order.id,
                    date: order.date,
                    customer: order.customer.name,
                    status: order.status,
                    total: order.total,
                    items: order.items.map(item => item.name)
                }));

            setRecentOrders(recentOrders);
        }, 1000);
    };

    const getDefaultOrders = () => [
        {
            id: 'ORD-001',
            date: '2024-01-15',
            customer: {
                name: 'Ana Rojas',
                email: 'ana.rojas@email.com',
                phone: '+506 8888-1111',
                address: 'San José, Costa Rica'
            },
            status: 'pendiente',
            total: 25000,
            items: [
                { name: 'Collar artesanal', quantity: 1, price: 12000 },
                { name: 'Bolso tejido', quantity: 1, price: 13000 }
            ],
            paymentMethod: 'Transferencia',
            notes: 'Cliente solicita entrega urgente',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
        },
        {
            id: 'ORD-002',
            date: '2024-01-14',
            customer: {
                name: 'Carlos Mendez',
                email: 'carlos.mendez@email.com',
                phone: '+506 8888-2222',
                address: 'Cartago, Costa Rica'
            },
            status: 'enviado',
            total: 18500,
            items: [
                { name: 'Cuadro paisaje', quantity: 1, price: 18500 }
            ],
            paymentMethod: 'Tarjeta',
            notes: '',
            trackingNumber: 'TR-123456789',
            createdAt: '2024-01-14T14:20:00Z',
            updatedAt: '2024-01-15T09:15:00Z'
        },
        {
            id: 'ORD-003',
            date: '2024-01-13',
            customer: {
                name: 'María González',
                email: 'maria.gonzalez@email.com',
                phone: '+506 8888-3333',
                address: 'Alajuela, Costa Rica'
            },
            status: 'entregado',
            total: 32000,
            items: [
                { name: 'Vasija cerámica', quantity: 1, price: 25000 },
                { name: 'Aretes madera', quantity: 1, price: 7000 }
            ],
            paymentMethod: 'Efectivo',
            notes: 'Entregado sin problemas',
            deliveredAt: '2024-01-16T16:30:00Z',
            createdAt: '2024-01-13T11:45:00Z',
            updatedAt: '2024-01-16T16:30:00Z'
        },
        {
            id: 'ORD-004',
            date: '2024-01-12',
            customer: {
                name: 'Luis Pérez',
                email: 'luis.perez@email.com',
                phone: '+506 8888-4444',
                address: 'Heredia, Costa Rica'
            },
            status: 'en_proceso',
            total: 15000,
            items: [
                { name: 'Maceta decorativa', quantity: 1, price: 15000 }
            ],
            paymentMethod: 'Transferencia',
            notes: 'Producto en preparación',
            createdAt: '2024-01-12T09:00:00Z',
            updatedAt: '2024-01-14T10:00:00Z'
        },
        {
            id: 'ORD-005',
            date: '2024-01-11',
            customer: {
                name: 'Sandra López',
                email: 'sandra.lopez@email.com',
                phone: '+506 8888-5555',
                address: 'Puntarenas, Costa Rica'
            },
            status: 'retraso',
            total: 42000,
            items: [
                { name: 'Set de platos artesanales', quantity: 1, price: 42000 }
            ],
            paymentMethod: 'Tarjeta',
            notes: 'Retraso en producción por falta de material',
            createdAt: '2024-01-11T13:20:00Z',
            updatedAt: '2024-01-15T08:00:00Z'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'entregado': return '#4caf50';
            case 'enviado': return '#9c27b0';
            case 'en_proceso': return '#ff9800';
            case 'pendiente': return '#2196f3';
            case 'cancelado': return '#f44336';
            case 'retraso': return '#ff5722';
            default: return '#666';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'entregado': return 'Entregado';
            case 'enviado': return 'Enviado';
            case 'en_proceso': return 'En Proceso';
            case 'pendiente': return 'Pendiente';
            case 'cancelado': return 'Cancelado';
            case 'retraso': return 'Con Retraso';
            default: return status;
        }
    };

    return (
        <div className="dashboard-container seller-dashboard">
            {/* Header del Dashboard */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>¡Bienvenido, {user?.name || 'Vendedor'}! 🏪</h1>
                    <p className="business-name">{user?.businessName || user?.name || 'Mi Tienda'}</p>
                    <p>Tu centro de gestión de ventas</p>
                </div>
                <div className="user-avatar seller">
                    <i className="fa fa-store"></i>
                </div>
            </div>

            {/* Estadísticas principales */}
            <div className="stats-grid seller-stats">
                <div className="stat-card revenue">
                    <div className="stat-icon">
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                        <h3>₡{stats.totalRevenue.toLocaleString()}</h3>
                        <p>Ingresos Totales</p>
                        <span className="stat-trend positive">+12% este mes</span>
                    </div>
                </div>

                <div className="stat-card sales">
                    <div className="stat-icon">
                        <i className="fa fa-chart-bar"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalSales}</h3>
                        <p>Ventas Totales</p>
                        <span className="stat-trend positive">+8% este mes</span>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon">
                        <i className="fa fa-box"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.activeProducts}</h3>
                        <p>Productos Activos</p>
                        <span className="stat-trend neutral">Sin cambios</span>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">
                        <i className="fa fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pedidos Pendientes</p>
                        <span className="stat-trend warning">Requiere atención</span>
                    </div>
                </div>

                <div className="stat-card rating">
                    <div className="stat-icon">
                        <i className="fa fa-star"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.avgRating}</h3>
                        <p>Calificación Promedio</p>
                        <span className="stat-trend positive">Excelente</span>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">
                        <i className="fa fa-shopping-bag"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalOrders}</h3>
                        <p>Pedidos Totales</p>
                        <span className="stat-trend positive">+15% este mes</span>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="dashboard-content">
                {/* Acciones rápidas para vendedores */}
                <div className="section-card quick-actions seller-actions">
                    <h2>🚀 Gestión Rápida</h2>
                    <div className="actions-grid">
                        <Link to="/seller/inventory" className="action-card primary">
                            <i className="fa fa-boxes"></i>
                            <h3>Gestión de Inventario</h3>
                            <p>Administra todos tus productos</p>
                        </Link>

                        <Link to="/seller/orders" className="action-card">
                            <i className="fa fa-list-ul"></i>
                            <h3>Gestionar Pedidos</h3>
                            <p>Revisa y procesa los pedidos</p>
                        </Link>

                        <Link to="/seller/analytics" className="action-card">
                            <i className="fa fa-chart-line"></i>
                            <h3>Estadísticas</h3>
                            <p>Análisis de ventas detallado</p>
                        </Link>

                        <Link to="/seller/store-profile" className="action-card">
                            <i className="fa fa-store-alt"></i>
                            <h3>Mi Tienda</h3>
                            <p>Configura tu perfil y contacto</p>
                        </Link>
                    </div>
                </div>

                {/* Pedidos recientes */}
                <div className="section-card recent-orders">
                    <div className="section-header">
                        <h2>📦 Pedidos Recientes</h2>
                        <Link to="/seller/orders" className="view-all-link">Ver todos</Link>
                    </div>
                    <div className="orders-table-container">
                        <div className="orders-table">
                            <div className="table-header">
                                <div className="header-cell">Pedido</div>
                                <div className="header-cell">Cliente</div>
                                <div className="header-cell">Fecha</div>
                                <div className="header-cell">Estado</div>
                                <div className="header-cell">Total</div>
                            </div>
                            {recentOrders.slice(0, 5).map(order => (
                                <div key={order.id} className="table-row">
                                    <div className="table-cell order-id">#{order.id}</div>
                                    <div className="table-cell customer-name">{order.customer}</div>
                                    <div className="table-cell order-date">{new Date(order.date).toLocaleDateString('es-CR')}</div>
                                    <div className="table-cell">
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <div className="table-cell order-total">₡{order.total.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Consejos para vendedores */}
                <div className="section-card seller-tips">
                    <h2>💡 Consejos para Aumentar Ventas</h2>
                    <div className="tips-list">
                        <div className="tip-item">
                            <i className="fa fa-camera"></i>
                            <div>
                                <h4>Fotos de calidad</h4>
                                <p>Usa imágenes claras y bien iluminadas de tus productos para atraer más compradores.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-edit"></i>
                            <div>
                                <h4>Descripciones detalladas</h4>
                                <p>Incluye información completa sobre materiales, dimensiones y proceso de elaboración.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-shipping-fast"></i>
                            <div>
                                <h4>Envíos rápidos</h4>
                                <p>Procesa los pedidos rápidamente para mantener clientes satisfechos.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-comments"></i>
                            <div>
                                <h4>Comunicación activa</h4>
                                <p>Responde rápidamente a preguntas y mantén informados a tus clientes.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas importantes */}
                {stats.pendingOrders > 0 && (
                    <div className="section-card alerts">
                        <h2>⚠️ Alertas Importantes</h2>
                        <div className="alert-list">
                            <div className="alert-item warning">
                                <i className="fa fa-exclamation-triangle"></i>
                                <div>
                                    <h4>Pedidos pendientes</h4>
                                    <p>Tienes {stats.pendingOrders} pedidos esperando ser procesados.</p>
                                    <Link to="/seller/orders?status=pending" className="alert-action">
                                        Revisar pedidos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};