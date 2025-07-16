import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

export const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">Eflyer</h1>
        <nav className="navbar-links">
          <NavLink to="/best-sellers">Best Sellers</NavLink>
          <NavLink to="/gift-ideas">Gift Ideas</NavLink>
          <NavLink to="/new-releases">New Releases</NavLink>
          <NavLink to="/todays-deals">Today's Deals</NavLink>
          <NavLink to="/customer-service">Customer Service</NavLink>
        </nav>
      </div>
    </header>
  );
};
