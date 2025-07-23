import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';

export const HomePage = () => {
  return (
    <>
      <main className="home-container">
        {/* Intro principal */}
        <section className="home-hero">
          <h1>Bienvenido a ArtesJAC</h1>
          <p>Tu plataforma para descubrir y apoyar el arte local costarricense.</p>
          <Link to="/shop" className="home-button">Explorar la Tienda</Link>
        </section>

        {/* Categorías */}
        <section className="home-categories">
          <h2>Categorías destacadas</h2>
          <div className="category-grid">
            <Link to="/shop" className="category-card">Textil</Link>
            <Link to="/shop" className="category-card">Joyería</Link>
            <Link to="/shop" className="category-card">Pintura</Link>
            <Link to="/shop" className="category-card">Cerámica</Link>
          </div>
        </section>

        {/* Productos destacados */}
        <section className="home-featured">
          <h2>Productos Destacados</h2>
          <div className="product-grid">
            <Link to="/shop" className="product-card">
              <div className="product-image-sim"></div>
              <h3>Collar artesanal</h3>
              <p>₡12.000</p>
            </Link>
            <Link to="/shop" className="product-card">
              <div className="product-image-sim"></div>
              <h3>Bolso tejido</h3>
              <p>₡18.500</p>
            </Link>
            <Link to="/shop" className="product-card">
              <div className="product-image-sim"></div>
              <h3>Cuadro colorido</h3>
              <p>₡22.000</p>
            </Link>
          </div>
        </section>

        {/* Call to action */}
        <section style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
          marginTop: '3rem'
        }}>
          <h2 style={{color: '#fff', marginBottom: '1rem'}}>¿Listo para comenzar?</h2>
          <p style={{color: '#ccc', marginBottom: '2rem'}}>
            Explora nuestra colección completa de productos artesanales hechos con amor
          </p>
          <Link to="/shop" className="home-button" style={{
            display: 'inline-block',
            marginRight: '1rem'
          }}>
            Ver todos los productos
          </Link>
          <Link to="/cart" className="home-button" style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            border: '2px solid #ff5722'
          }}>
            Ver carrito
          </Link>
        </section>
      </main>
    </>
  );
};