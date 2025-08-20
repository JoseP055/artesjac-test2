import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">ArtesJAC</h2>

        <div className="footer-subscribe">
          <input type="email" placeholder="Tu correo electrónico" />
          <button>SUSCRIBIRME</button>
        </div>

        <div className="footer-links">
          <NavLink to="/shop">Arte Destacado</NavLink>

        </div>

        <p className="footer-help">Contáctanos: +506 8888 8888</p>
        <p className="footer-copy">© 2025 ArtesJAC. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
