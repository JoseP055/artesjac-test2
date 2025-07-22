import React from 'react';
import { Link } from 'react-router-dom';
import cuadroImg from '../assets/images/cuadro.jpg';
import bolsoImg from '../assets/images/bolso.png';
import collarImg from '../assets/images/collar.jpg';
import '../styles/variables.css';

export const HomePage = () => {
  return (
    <>
      <main className="home-container">
        {/* Intro principal */}
        <section className="home-hero">
          <h1>Bienvenido a ArtesJAC</h1>
          <p>Tu plataforma para descubrir y apoyar el arte local costarricense.</p>
          <Link to="/shop" >
            <button className="home-button">Explorar la Tienda</button>
          </Link>
        </section>

        {/* Categorías */}
        <section className="home-categories">
          <h2>Categorías destacadas</h2>
          <div className="category-grid">
            <div className="category-card">Textil</div>
            <div className="category-card">Joyería</div>
            <div className="category-card">Pintura</div>
            <div className="category-card">Cerámica</div>
          </div>
        </section>

        {/* Productos destacados - AGREGAMOS EL ID AQUÍ */}
        <section id="productos-destacados" className="home-featured">
          <h2>Productos Destacados</h2>
          <div className="product-grid">
            <div className="product-card">
              <img src={collarImg} alt="Collar artesanal" className="product-image" />
              <h3>Collar artesanal</h3>
              <p>₡12.000</p>
            </div>
            <div className="product-card">
              <img src={bolsoImg} alt="Bolso tejido" className="product-image" />
              <h3>Bolso tejido</h3>
              <p>₡18.500</p>
            </div>
            <div className="product-card">
              <img src={cuadroImg} alt="Cuadro colorido" className="product-image" />
              <h3>Cuadro colorido</h3>
              <p>₡22.000</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};