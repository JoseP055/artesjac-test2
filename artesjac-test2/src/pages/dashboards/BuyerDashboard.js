import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../modules/auth/AuthContext";
import "../../styles/dashboard.css";
import { BuyerAPI } from "../../api/buyer.service";

export const BuyerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        favoriteProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
        loadCartItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const res = await BuyerAPI.getDashboard();
            const d = res?.data || {};
            setStats(d.stats || { totalOrders: 0, totalSpent: 0, pendingOrders: 0, favoriteProducts: 0 });
            setRecentOrders(Array.isArray(d.recentOrders) ? d.recentOrders : []);
            setRecommendedProducts(Array.isArray(d.recommendedProducts) ? d.recommendedProducts : []);
        } catch (e) {
            console.error("Error cargando buyer dashboard:", e);
            alert(e?.response?.data?.error || "No se pudo cargar tu dashboard.");
            setStats({ totalOrders: 0, totalSpent: 0, pendingOrders: 0, favoriteProducts: 0 });
            setRecentOrders([]);
            setRecommendedProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCartItems = () => {
        try {
            const savedCart = localStorage.getItem("artesjac-cart");
            if (savedCart && savedCart !== "null") {
                const cart = JSON.parse(savedCart);
                setCartItems(Array.isArray(cart) ? cart : []);
            }
        } catch (error) {
            console.error("Error al cargar carrito:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "entregado":
                return "#4caf50";
            case "en-transito": // mapeo para la UI
            case "enviado":     // por si llega así del backend
                return "#ff9800";
            case "pendiente":
            case "en_proceso":
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
            case "en-transito":
            case "enviado":
                return "En tránsito";
            case "pendiente":
                return "Pendiente";
            case "en_proceso":
                return "En proceso";
            case "cancelado":
                return "Cancelado";
            case "retraso":
                return "Con retraso";
            default:
                return status;
        }
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + (Number(item.numericPrice) * Number(item.quantity || 0)), 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando tu información...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header del Dashboard */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>¡Bienvenido, {user?.name || "Cliente"}! 🛒</h1>
                    <p>Tu centro de compras artesanales</p>
                </div>
                <div className="user-avatar">
                    <i className="fa fa-user-circle"></i>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="stats-grid">
                <div className="stat-card orders">
                    <div className="stat-icon">
                        <i className="fa fa-shopping-bag"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalOrders}</h3>
                        <p>Pedidos Totales</p>
                    </div>
                </div>

                <div className="stat-card spent">
                    <div className="stat-icon">
                        <i className="fa fa-chart-line"></i>
                    </div>
                    <div className="stat-content">
                        <h3>₡{Number(stats.totalSpent).toLocaleString()}</h3>
                        <p>Total Gastado</p>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">
                        <i className="fa fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pedidos Pendientes</p>
                    </div>
                </div>

                <div className="stat-card favorites">
                    <div className="stat-icon">
                        <i className="fa fa-heart"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.favoriteProducts}</h3>
                        <p>Favoritos</p>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="dashboard-content">
                

                {/* Acciones rápidas */}
                <div className="section-card quick-actions">
                    <h2>🚀 Acciones Rápidas</h2>
                    <div className="actions-grid">
                        <Link to="/shop" className="action-card">
                            <i className="fa fa-store"></i>
                            <h3>Explorar Tienda</h3>
                            <p>Descubre productos artesanales únicos</p>
                        </Link>

                        <Link to="/orders" className="action-card">
                            <i className="fa fa-list-alt"></i>
                            <h3>Mis Pedidos</h3>
                            <p>Revisa el estado de tus compras</p>
                        </Link>

                        <Link to="/profile" className="action-card">
                            <i className="fa fa-user-cog"></i>
                            <h3>Mi Perfil</h3>
                            <p>Actualiza tu información personal</p>
                        </Link>

                        <Link to="/shop?category=ofertas" className="action-card">
                            <i className="fa fa-percentage"></i>
                            <h3>Ofertas Especiales</h3>
                            <p>No te pierdas las mejores ofertas</p>
                        </Link>
                    </div>
                </div>

                {/* Pedidos recientes */}
                <div className="section-card recent-orders">
                    <div className="section-header">
                        <h2>📦 Pedidos Recientes</h2>
                        <Link to="/orders" className="view-all-link">
                            Ver todos
                        </Link>
                    </div>
                    <div className="orders-list">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="order-item">
                                <div className="order-info">
                                    <h3>Pedido #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.date).toLocaleDateString("es-CR")}
                                    </p>
                                    <p className="order-items">{(order.items || []).join(", ")}</p>
                                </div>
                                <div className="order-status">
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                    <span className="order-total">₡{Number(order.total).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <div className="empty-state">
                                <i className="fa fa-inbox"></i>
                                <h3>No tenés pedidos recientes</h3>
                            </div>
                        )}
                    </div>
                </div>

    
                {/* Tips para compradores */}
                <div className="section-card tips">
                    <h2>💡 Consejos para Compradores</h2>
                    <div className="tips-list">
                        <div className="tip-item">
                            <i className="fa fa-lightbulb"></i>
                            <div>
                                <h4>Explora por categorías</h4>
                                <p>
                                    Encontrá exactamente lo que buscás navegando por categorías
                                    especializadas.
                                </p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-heart"></i>
                            <div>
                                <h4>Guardá tus favoritos</h4>
                                <p>Marcá productos para verlos luego en tu perfil.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-truck"></i>
                            <div>
                                <h4>Envío gratis</h4>
                                <p>Compras mayores a ₡50,000 tienen envío gratuito en CR.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
