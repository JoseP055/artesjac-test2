import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../modules/auth/AuthContext";
import "../../styles/dashboard.css";
import { DashboardAPI } from "../../api/dashboard.service";

export const SellerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        activeProducts: 0,
        pendingOrders: 0,
        totalOrders: 0,
        avgRating: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const res = await DashboardAPI.getSeller();
                const d = res?.data || {};
                setStats({
                    totalSales: d.totalSales || 0,
                    totalRevenue: d.totalRevenue || 0,
                    activeProducts: d.activeProducts || 0,
                    pendingOrders: d.pendingOrders || 0,
                    totalOrders: d.totalOrders || 0,
                    avgRating: d.avgRating || 0,
                });
                setRecentOrders(Array.isArray(d.recentOrders) ? d.recentOrders : []);
            } catch (e) {
                console.error("Error cargando dashboard:", e);
                alert(e?.response?.data?.error || "No se pudo cargar el dashboard.");
                setStats({
                    totalSales: 0,
                    totalRevenue: 0,
                    activeProducts: 0,
                    pendingOrders: 0,
                    totalOrders: 0,
                    avgRating: 0,
                });
                setRecentOrders([]);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "entregado":
                return "#4caf50";
            case "enviado":
                return "#9c27b0";
            case "en_proceso":
                return "#ff9800";
            case "pendiente":
                return "#2196f3";
            case "cancelado":
                return "#f44336";
            case "retraso":
                return "#ff5722";
            default:
                return "#666";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "entregado":
                return "Entregado";
            case "enviado":
                return "Enviado";
            case "en_proceso":
                return "En Proceso";
            case "pendiente":
                return "Pendiente";
            case "cancelado":
                return "Cancelado";
            case "retraso":
                return "Con Retraso";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container seller-dashboard">
            {/* Header del Dashboard */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>¡Bienvenido, {user?.name || "Vendedor"}! 🏪</h1>
                    <p className="business-name">
                        {user?.businessName || user?.name || "Mi Tienda"}
                    </p>
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
                        <h3>₡{Number(stats.totalRevenue).toLocaleString()}</h3>
                        <p>Ingresos Totales (entregado)</p>
                        <span className="stat-trend positive">Referencia</span>
                    </div>
                </div>

                <div className="stat-card sales">
                    <div className="stat-icon">
                        <i className="fa fa-chart-bar"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalSales}</h3>
                        <p>Unidades Vendidas</p>
                        <span className="stat-trend positive">Referencia</span>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon">
                        <i className="fa fa-box"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.activeProducts}</h3>
                        <p>Productos Activos</p>
                        <span className="stat-trend neutral">—</span>
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
                        <span className="stat-trend positive">—</span>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">
                        <i className="fa fa-shopping-bag"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalOrders}</h3>
                        <p>Pedidos Totales</p>
                        <span className="stat-trend positive">—</span>
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
                        <Link to="/seller/orders" className="view-all-link">
                            Ver todos
                        </Link>
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
                            {recentOrders.slice(0, 5).map((order) => (
                                <div key={order.id} className="table-row">
                                    <div className="table-cell order-id">#{order.id}</div>
                                    <div className="table-cell customer-name">{order.customer}</div>
                                    <div className="table-cell order-date">
                                        {new Date(order.date).toLocaleDateString("es-CR")}
                                    </div>
                                    <div className="table-cell">
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <div className="table-cell order-total">
                                        ₡{Number(order.total).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {recentOrders.length === 0 && (
                                <div className="empty-state">
                                    <i className="fa fa-inbox"></i>
                                    <h3>No hay pedidos recientes</h3>
                                </div>
                            )}
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
                                <p>
                                    Usá imágenes claras y bien iluminadas de tus productos para
                                    atraer más compradores.
                                </p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-edit"></i>
                            <div>
                                <h4>Descripciones detalladas</h4>
                                <p>
                                    Incluí información de materiales, dimensiones y proceso de
                                    elaboración.
                                </p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-shipping-fast"></i>
                            <div>
                                <h4>Envíos rápidos</h4>
                                <p>Procesá los pedidos rápido para mantener clientes felices.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-comments"></i>
                            <div>
                                <h4>Comunicación activa</h4>
                                <p>Respondé preguntas y mantené informados a tus clientes.</p>
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
                                    <p>
                                        Tenés {stats.pendingOrders} pedidos esperando ser
                                        procesados.
                                    </p>
                                    <Link
                                        to="/seller/orders?status=pendiente"
                                        className="alert-action"
                                    >
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
