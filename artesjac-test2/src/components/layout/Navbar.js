import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import mx from '../../assets/images/flag-mexico.png';
import us from '../../assets/images/flag-usa.png';
import mk from '../../assets/images/flag-cr.png';
import '../../styles/layout.css';

export const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight * 0.25;
            setIsSticky(scrollY > triggerPoint);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                    <NavLink to="/profile">Profile</NavLink>

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

                    {/* Cart */}
                    <div className="navbar-cart">
                        <NavLink to="/cart">
                            <i className="fa fa-shopping-cart"></i> <span>Cart</span>
                        </NavLink>
                    </div>

                    {/* Login/Register Auth */}
                    <div className="navbar-auth">
                        <NavLink to="/login" className="auth-link">
                            <i className="fa fa-sign-in-alt"></i> Iniciar Sesión
                        </NavLink>
                        <span className="auth-divider">|</span>
                        <NavLink to="/register" className="auth-link">
                            <i className="fa fa-user-plus"></i> Registrarse
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};