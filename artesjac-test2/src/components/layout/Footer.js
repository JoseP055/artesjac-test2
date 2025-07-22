import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">ArtesJAC</h2>

        <div className="footer-subscribe">
          <input type="email" placeholder="Your Email" />
          <button>SUBSCRIBE</button>
        </div>

        <div className="footer-links">
          <NavLink to="/shop">Featured Art</NavLink>
          <NavLink to="/shop">Craft Ideas</NavLink>
          <NavLink to="/shop">New Arrivals</NavLink>
          <NavLink to="/shop">Special Offers</NavLink>
          <NavLink to="#">Support</NavLink>
        </div>

        <p className="footer-help">Contact us: +506 8888 8888</p>
        <p className="footer-copy">© 2025 ArtesJAC. All rights reserved.</p>
      </div>
    </footer>
  );
};
