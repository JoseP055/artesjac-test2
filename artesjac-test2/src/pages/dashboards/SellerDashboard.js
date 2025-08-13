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
    const [topProducts, setTopProducts] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        // Simular datos del dashboard del vendedor
        setTimeout(() => {
            setStats({
                totalSales: 45,
                totalRevenue: 485000,
                activeProducts: 12,
                pendingOrders: 3,
                totalOrders: 45,
                avgRating: 4.8
            });

            setRecentOrders([
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    customer: 'Ana Rojas',
                    status: 'pendiente',
                    total: 25000,
                    items: ['Collar artesanal', 'Bolso tejido']
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-14',
                    customer: 'Carlos Mendez',
                    status: 'enviado',
                    total: 18500,
                    items: ['Cuadro paisaje']
                },
                {
                    id: 'ORD-003',
                    date: '2024-01-13',
                    customer: 'María González',
                    status: 'entregado',
                    total: 32000,
                    items: ['Vasija cerámica', 'Aretes madera']
                }
            ]);

            setTopProducts([
                { id: 1, name: 'Collar artesanal de semillas', sales: 15, revenue: 180000 },
                { id: 2, name: 'Bolso tejido a mano', sales: 8, revenue: 148000 },
                { id: 3, name: 'Aretes de madera tallada', sales: 12, revenue: 102000 }
            ]);

            setMonthlyData([
                { month: 'Ene', sales: 8, revenue: 95000 },
                { month: 'Feb', sales: 12, revenue: 140000 },
                { month: 'Mar', sales: 15, revenue: 180000 },
                { month: 'Abr', sales: 10, revenue: 125000 }
            ]);
        }, 1000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'entregado': return '#4caf50';
            case 'enviado': return '#ff9800';
            case 'pendiente': return '#2196f3';
            case 'cancelado': return '#f44336';
            default: return '#666';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'entregado': return 'Entregado';
            case 'enviado': return 'Enviado';
            case 'pendiente': return 'Pendiente';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="dashboard-container seller-dashboard">
            {/* Header del Dashboard */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>¡Bienvenido, {user?.name}! 🏪</h1>
                    <p className="business-name">{user?.businessName}</p>
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
                        <Link to="/seller/products/new" className="action-card primary">
                            <i className="fa fa-plus-circle"></i>
                            <h3>Agregar Producto</h3>
                            <p>Sube un nuevo producto a tu tienda</p>
                        </Link>

                        <Link to="/seller/orders" className="action-card">
                            <i className="fa fa-list-ul"></i>
                            <h3>Gestionar Pedidos</h3>
                            <p>Revisa y procesa los pedidos</p>
                        </Link>

                        <Link to="/seller/products" className="action-card">
                            <i className="fa fa-boxes"></i>
                            <h3>Mi Inventario</h3>
                            <p>Administra tus productos</p>
                        </Link>

                        <Link to="/seller/analytics" className="action-card">
                            <i className="fa fa-chart-line"></i>
                            <h3>Estadísticas</h3>
                            <p>Análisis de ventas detallado</p>
                        </Link>

                        <Link to="/seller/profile" className="action-card">
                            <i className="fa fa-store-alt"></i>
                            <h3>Mi Tienda</h3>
                            <p>Configura tu perfil de vendedor</p>
                        </Link>

                        <Link to="/seller/messages" className="action-card">
                            <i className="fa fa-comments"></i>
                            <h3>Mensajes</h3>
                            <p>Comunícate con los clientes</p>
                        </Link>
                    </div>
                </div>

                {/* Pedidos recientes */}
                <div className="section-card recent-orders">
                    <div className="section-header">
                        <h2>📦 Pedidos Recientes</h2>
                        <Link to="/seller/orders" className="view-all-link">Ver todos</Link>
                    </div>
                    <div className="orders-table">
                        <div className="table-header">
                            <span>Pedido</span>
                            <span>Cliente</span>
                            <span>Fecha</span>
                            <span>Estado</span>
                            <span>Total</span>
                        </div>
                        {recentOrders.map(order => (
                            <div key={order.id} className="table-row">
                                <span className="order-id">#{order.id}</span>
                                <span className="customer-name">{order.customer}</span>
                                <span className="order-date">{new Date(order.date).toLocaleDateString('es-CR')}</span>
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                                <span className="order-total">₡{order.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Productos más vendidos */}
                    <div className="section-card top-products">
                        <div className="section-header">
                            <h2>🏆 Productos Más Vendidos</h2>
                            <Link to="/seller/products" className="view-all-link">Ver todos</Link>
                        </div>
                        <div className="products-ranking">
                            {topProducts.map((product, index) => (
                                <div key={product.id} className="ranking-item">
                                    <div className="rank-number">#{index + 1}</div>
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <p>{product.sales} ventas • ₡{product.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gráfico de ventas mensual */}
                    <div className="section-card monthly-chart">
                        <h2>📈 Ventas por Mes</h2>
                        <div className="chart-container">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="chart-bar">
                                    <div 
                                        className="bar" 
                                        style={{ 
                                            height: `${(data.sales / 20) * 100}%`,
                                            backgroundColor: '#ff5722'
                                        }}
                                    ></div>
                                    <span className="bar-label">{data.month}</span>
                                    <span className="bar-value">{data.sales}</span>
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