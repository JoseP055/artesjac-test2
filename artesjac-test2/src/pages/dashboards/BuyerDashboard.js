import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import '../../styles/dashboard.css';

export const BuyerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        favoriteProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Cargar datos del dashboard
        loadDashboardData();
        loadCartItems();
    }, []);

    const loadDashboardData = () => {
        // Simular datos del dashboard
        setTimeout(() => {
            setStats({
                totalOrders: 8,
                totalSpent: 125000,
                pendingOrders: 2,
                favoriteProducts: 5
            });

            setRecentOrders([
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    status: 'entregado',
                    total: 25000,
                    items: ['Collar artesanal', 'Bolso tejido']
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-10',
                    status: 'en-transito',
                    total: 18500,
                    items: ['Cuadro paisaje']
                }
            ]);

            setRecommendedProducts([
                { id: 1, name: 'Aretes de madera', price: 8500, category: 'joyeria' },
                { id: 2, name: 'Vasija decorativa', price: 15800, category: 'ceramica' },
                { id: 3, name: 'Manta tejida', price: 32000, category: 'textil' }
            ]);
        }, 1000);
    };

    const loadCartItems = () => {
        try {
            const savedCart = localStorage.getItem('artesjac-cart');
            if (savedCart && savedCart !== 'null') {
                const cart = JSON.parse(savedCart);
                setCartItems(cart);
            }
        } catch (error) {
            console.error('Error al cargar carrito:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'entregado': return '#4caf50';
            case 'en-transito': return '#ff9800';
            case 'pendiente': return '#2196f3';
            default: return '#666';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'entregado': return 'Entregado';
            case 'en-transito': return 'En tránsito';
            case 'pendiente': return 'Pendiente';
            default: return status;
        }
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="dashboard-container">
            {/* Header del Dashboard */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>¡Bienvenido, {user?.name}! 🛒</h1>
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
                        <h3>₡{stats.totalSpent.toLocaleString()}</h3>
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
                {/* Carrito actual */}
                {cartItems.length > 0 && (
                    <div className="section-card cart-section">
                        <div className="section-header">
                            <h2>🛒 Tu Carrito Actual</h2>
                            <Link to="/cart" className="view-all-link">Ver carrito completo</Link>
                        </div>
                        <div className="cart-summary">
                            <div className="cart-info">
                                <span className="cart-count">{getTotalCartItems()} productos</span>
                                <span className="cart-total">Total: ₡{calculateCartTotal().toLocaleString()}</span>
                            </div>
                            <div className="cart-actions">
                                <Link to="/cart" className="btn-view-cart">Ver Carrito</Link>
                                <Link to="/checkout" className="btn-checkout">Finalizar Compra</Link>
                            </div>
                        </div>
                    </div>
                )}

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
                        <Link to="/orders" className="view-all-link">Ver todos</Link>
                    </div>
                    <div className="orders-list">
                        {recentOrders.map(order => (
                            <div key={order.id} className="order-item">
                                <div className="order-info">
                                    <h3>Pedido #{order.id}</h3>
                                    <p className="order-date">{new Date(order.date).toLocaleDateString('es-CR')}</p>
                                    <p className="order-items">{order.items.join(', ')}</p>
                                </div>
                                <div className="order-status">
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                    <span className="order-total">₡{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Productos recomendados */}
                <div className="section-card recommendations">
                    <div className="section-header">
                        <h2>✨ Recomendado para Ti</h2>
                        <Link to="/shop" className="view-all-link">Ver más</Link>
                    </div>
                    <div className="products-grid">
                        {recommendedProducts.map(product => (
                            <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                                <div className="product-image">
                                    <div className="product-image-sim"></div>
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <p className="product-price">₡{product.price.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
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
                                <p>Encuentra exactamente lo que buscas navegando por nuestras categorías especializadas.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-heart"></i>
                            <div>
                                <h4>Guarda tus favoritos</h4>
                                <p>Marca como favoritos los productos que te gusten para encontrarlos fácilmente después.</p>
                            </div>
                        </div>
                        <div className="tip-item">
                            <i className="fa fa-truck"></i>
                            <div>
                                <h4>Envío gratis</h4>
                                <p>Compras mayores a ₡50,000 tienen envío gratuito a todo Costa Rica.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};