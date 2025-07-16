import React from 'react';
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
          <a href="#">Best Sellers</a>
          <a href="#">Gift Ideas</a>
          <a href="#">New Releases</a>
          <a href="#">Today's Deals</a>
          <a href="#">Customer Service</a>
        </div>

        <p className="footer-help">Help Line Number: +1 1800 1200 1200</p>
        <p className="footer-copy">© 2020 All Rights Reserved. Design by Free html Templates</p>
      </div>
    </footer>
  );
};
