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
            {/* Enlaces superiores */}
            <div className="navbar-top">
                <div className="navbar-top-links">
                    <NavLink to="/shop">Arte Destacado</NavLink>
                    <NavLink to="/shop">Ideas de Artesanía</NavLink>
                    <NavLink to="/shop">Novedades</NavLink>
                    <NavLink to="/shop">Ofertas Especiales</NavLink>
                </div>
            </div>

            {/* Barra principal */}
            <div className="navbar-main">
                {/* Enlaces de navegación */}
                <nav className="navbar-links">
                    <NavLink to="/"><span className='logo-text'>ArtesJAC</span></NavLink>
                    <NavLink to="/">Inicio</NavLink>

                    {/* Enlaces específicos según tipo de usuario */}
                    {isAuthenticated() ? (
                        <>
                            {isBuyer() && (
                                <>
                                    <NavLink to="/shop">Tienda</NavLink>
                                    <NavLink to="/buyer/dashboard">Mi Panel</NavLink>
                                </>
                            )}
                            {isSeller() && (
                                <>

                                    <NavLink to="/seller/dashboard">Mi Panel</NavLink>
                                    <NavLink to="/seller/inventory">Mis Productos</NavLink>
                                    <NavLink to="/seller/orders">Pedidos</NavLink>
                                </>
                            )}
                        </>
                    ) : (
                        <NavLink to="/shop">Tienda</NavLink>
                    )}
                </nav>

                {/* Acciones: Carrito y Autenticación */}
                <div className="navbar-actions">
                    {/* Carrito - Solo para compradores o usuarios no autenticados */}
                    {(isBuyer() || !isAuthenticated()) && (
                        <div className="navbar-cart">
                            <NavLink to="/cart" aria-label="Ir al carrito">
                                <i className="fa fa-shopping-cart"></i> <span>Carrito</span>
                            </NavLink>
                        </div>
                    )}

                    {/* Usuario autenticado */}
                    {isAuthenticated() ? (
                        <div className="navbar-user-menu">
                            <button
                                className="user-menu-button"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                aria-expanded={showUserMenu}
                                aria-haspopup="menu"
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
                                <div className="user-dropdown-menu" role="menu">
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
                                            Panel
                                        </button>

                                        <NavLink to="/seller/store-profile" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
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
                                                <NavLink to="/seller/inventory" className="dropdown-link" onClick={() => setShowUserMenu(false)}>
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
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Enlaces de Login/Registro - Solo si no está autenticado */
                        <div className="navbar-auth">
                            <NavLink to="/login" className="auth-link">
                                <i className="fa fa-sign-in-alt"></i> Iniciar sesión
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
