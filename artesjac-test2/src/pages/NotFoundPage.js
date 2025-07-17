import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';

export const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="glitch-text">404</h1>
        <h2 className="ups-text">¡UPS!</h2>
        <p className="fade-in">La página que buscás no existe o fue movida.</p>
        <Link to={-1} className="back-button">Volver</Link>
      </div>
    </div>
  );
};
