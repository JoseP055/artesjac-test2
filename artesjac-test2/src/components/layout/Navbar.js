import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../../styles/layout.css';

export const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight * 0.25;
            setIsSticky(scrollY > triggerPoint);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Función para actualizar el contador del carrito
    useEffect(() => {
        const updateCartCount = () => {
            try {
                const savedCart = localStorage.getItem('artesjac-cart');
                if (savedCart && savedCart !== 'null' && savedCart !== '[]') {
                    const cart = JSON.parse(savedCart);
                    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                    setCartCount(totalItems);
                } else {
                    setCartCount(0);
                }
            } catch (error) {
                console.error('Error al leer carrito:', error);
                setCartCount(0);
            }
        };

        // Actualizar al cargar la página
        updateCartCount();

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            updateCartCount();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // También verificar cada 1 segundo por si acaso
        const interval = setInterval(updateCartCount, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    return (
        <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
            {/* Top Links */}
            <div className="navbar-top">
                <div className="navbar-top-links">
                    <NavLink to="/shop">Best Sellers</NavLink>
                    <NavLink to="/shop">Gift Ideas</NavLink>
                    <NavLink to="/shop">New Releases</NavLink>
                    <NavLink to="/shop">Today's Deals</NavLink>
                    <NavLink to="#customer-service">Customer Service</NavLink>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="navbar-main">
                {/* Navigation Links */}
                <nav className="navbar-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/shop">Tienda</NavLink>
                    <NavLink to="/shop">Fashion</NavLink>
                    <NavLink to="/shop">Electronic</NavLink>
                    <NavLink to="/shop">Jewellery</NavLink>
                </nav>

                {/* Dropdown categories */}
                <div className="navbar-dropdown">
                    <button className="dropdown-button">All Categories</button>
                    <div className="dropdown-menu">
                        <Link to="/shop">Textil</Link>
                        <Link to="/shop">Joyería</Link>
                        <Link to="/shop">Pintura</Link>
                        <Link to="/shop">Cerámica</Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="navbar-search">
                    <input type="text" placeholder="Search..." />
                    <button>
                        <i className="fa fa-search"></i>
                    </button>
                </div>

                {/* Language and Cart */}
                <div className="navbar-actions">
                    <div className="language-selector">
                        <button className="language-button">
                            <img src="/images/flag-uk.png" className="language-flag" alt="EN" /> English <i className="fa fa-angle-down"></i>
                        </button>
                        <div className="language-menu">
                            <NavLink to="#">
                                <img src="/images/flag-france.png" className="language-flag" alt="FR" /> French
                            </NavLink>
                        </div>
                    </div>

                    <div className="navbar-user">
                        <Link to="/cart" style={{position: 'relative'}}>
                            <i className="fa fa-shopping-cart"></i> 
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: '#ff5722',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '0.7rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <NavLink to="#account">
                            <i className="fa fa-user"></i> <span>Account</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};