import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">Eflyer</h2>

        <div className="footer-subscribe">
          <input type="email" placeholder="Your Email" />
          <button>SUBSCRIBE</button>
        </div>

        <div className="footer-links">
          <NavLink to="#">Best Sellers</NavLink>
          <NavLink to="#">Gift Ideas</NavLink>
          <NavLink to="#">New Releases</NavLink>
          <NavLink to="#">Today's Deals</NavLink>
          <NavLink to="#">Customer Service</NavLink>
        </div>

        <p className="footer-help">Help Line Number: +1 1800 1200 1200</p>
        <p className="footer-copy">© 2020 All Rights Reserved. Design by Free html Templates</p>
      </div>
    </footer>
  );
};
