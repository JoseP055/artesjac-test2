import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import mx from '../../assets/images/flag-mexico.png';
import us from '../../assets/images/flag-usa.png';
import mk from '../../assets/images/flag-cr.png';
import '../../styles/layout.css';

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, getDashboardRoute, isBuyer, isSeller } = useAuth();
    const [isSticky, setIsSticky] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight * 0.25;
            setIsSticky(scrollY > triggerPoint);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    const handleDashboardClick = () => {
        navigate(getDashboardRoute());
        setShowUserMenu(false);
    };

    return (
        <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
            {/* Top Links */}
            <div className="navbar-top">
                <div className="navbar-top-links">
                    <NavLink to="/shop">Featured Art</NavLink>
                    <NavLink to="/shop">Craft Ideas</NavLink>
                    <NavLink to="/shop">New Arrivals</NavLink>
                    <NavLink to="/shop">Special Offers</NavLink>
                    <NavLink to="/shop">Help Center</NavLink>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="navbar-main">
                {/* Navigation Links */}
                <nav className="navbar-links">
                    <NavLink to="/"><span className='logo-text'>ArtesJAC</span></NavLink>
                    <NavLink to="/">Home</NavLink>
                    
                    {/* Enlaces específicos según tipo de usuario */}
                    {isAuthenticated() ? (
                        <>
                            {isBuyer() && (
                                <>
                                    <NavLink to="/shop">Tienda</NavLink>
                                    <NavLink to="/buyer/dashboard">Mi Dashboard</NavLink>
                                </>
                            )}
                            {isSeller() && (
                                <>
                                    <NavLink to="/seller/dashboard">Mi Dashboard</NavLink>
                                    <NavLink to="/seller/products">Mis Productos</NavLink>
                                    <NavLink to="/seller/orders">Pedidos</NavLink>
                                </>
                            )}
                        </>
                    ) : (
                        <NavLink to="/shop">Tienda</NavLink>
                    )}
                </nav>

                {/* Language, Cart & Auth */}
                <div className="navbar-actions">
                    {/* Language */}
                    <div className="language-selector">
                        <button className="language-button">
                            <img src={us} className="language-flag" alt="EN" /> English <i className="fa fa-angle-down"></i>
                        </button>
                        <div className="language-menu">
                            <NavLink to="#">
                                <img src={mx} className="language-flag" alt="ESP" /> Español
                            </NavLink>
                            <NavLink to="#">
                                <img src={mk} className="language-flag" alt="MLK" /> Maleku
                            </NavLink>
                        </div>
                    </div>

                    {/* Cart - Solo para compradores */}
                    {(isBuyer() || !isAuthenticated()) && (
                        <div className="navbar-cart">
                            <NavLink to="/cart">
                                <i className="fa fa-shopping-cart"></i> <span>Cart</span>
                            </NavLink>
                        </div>
                    )}

                    {/* Usuario autenticado */}
                    {isAuthenticated() ? (
                        <div className="navbar-user-menu">
                            <button 
                                className="user-menu-button"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="user-avatar-small">
                                    {isSeller() ? (
                                        <i className="fa fa-store"></i>
                                    ) : (
                                        <i className="fa fa-user"></i>
                                    )}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{user?.name}</span>
                                    <span className="user-type">
                                        {isSeller() ? 'Vendedor' : 'Comprador'}
                                    </span>
                                </div>
                                <i className={`fa fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                            </button>

                            {showUserMenu && (
                                <div className="user-dropdown-menu">
                                    <div className="user-dropdown-header">
                                        <strong>{user?.name}</strong>
                                        <span className="user-email">{user?.email}</span>
                                        {isSeller() && user?.businessName && (
                                            <span className="business-name">{user?.businessName}</span>
                                        )}
                                    </div>
                                    
                                    <div className="user-dropdown-links">
                                        <button onClick={handleDashboardClick} className="dropdown-link">
                                            <i className="fa fa-tachometer-alt"></i>
                                            Dashboard
                                        </button>
                                        
                                        <NavLink to="/profile" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                                            <i className="fa fa-user-cog"></i>
                                            Mi Perfil
                                        </NavLink>

                                        {isBuyer() && (
                                            <NavLink to="/orders" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                                                <i className="fa fa-shopping-bag"></i>
                                                Mis Pedidos
                                            </NavLink>
                                        )}

                                        {isSeller() && (
                                            <>
                                                <NavLink to="/seller/products" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                                                    <i className="fa fa-boxes"></i>
                                                    Mis Productos
                                                </NavLink>
                                                <NavLink to="/seller/orders" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
                                                    <i className="fa fa-list-alt"></i>
                                                    Pedidos
                                                </NavLink>
                                            </>
                                        )}

                                        <div className="dropdown-divider"></div>
                                        
                                        <button onClick={handleLogout} className="dropdown-link logout">
                                            <i className="fa fa-sign-out-alt"></i>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Login/Register Auth - Solo si no está autenticado */
                        <div className="navbar-auth">
                            <NavLink to="/login" className="auth-link">
                                <i className="fa fa-sign-in-alt"></i> Iniciar Sesión
                            </NavLink>
                            <span className="auth-divider">|</span>
                            <NavLink to="/register" className="auth-link">
                                <i className="fa fa-user-plus"></i> Registrarse
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};