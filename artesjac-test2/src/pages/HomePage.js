import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/variables.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getDashboardRoute } = useAuth();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir a su dashboard
    if (isAuthenticated()) {
      navigate(getDashboardRoute());
    }
  }, [isAuthenticated, getDashboardRoute, navigate]);

  // Solo mostrar el landing page si no está autenticado
  if (isAuthenticated()) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        backgroundColor: '#121212',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="home-container">
        {/* Intro principal */}
        <section className="home-hero">
          <h1>Bienvenido a ArtesJAC</h1>
          <p>Tu plataforma para descubrir y apoyar el arte local costarricense.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to="/shop" className="home-button">Explorar la Tienda</Link>
            <Link to="/register" className="home-button" style={{ backgroundColor: 'transparent', border: '2px solid #ff5722' }}>
              Únete Ahora
            </Link>
          </div>
        </section>

        {/* Tipos de usuario */}
        <section className="home-categories">
          <h2>¿Qué tipo de usuario eres?</h2>
          <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="category-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <i className="fa fa-shopping-cart" style={{ fontSize: '3rem', color: '#ff5722', marginBottom: '1rem' }}></i>
              <h3>Soy Comprador</h3>
              <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                Descubre productos artesanales únicos hechos con amor por talentosos artesanos costarricenses
              </p>
              <Link to="/register" className="home-button">Registrarme como Comprador</Link>
            </div>

            <div className="category-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <i className="fa fa-store" style={{ fontSize: '3rem', color: '#ff5722', marginBottom: '1rem' }}></i>
              <h3>Soy Vendedor/Artesano</h3>
              <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                Vende tus creaciones artesanales y conecta con clientes que valoran el trabajo hecho a mano
              </p>
              <Link to="/register" className="home-button">Registrarme como Vendedor</Link>
            </div>
          </div>
        </section>

        {/* Categorías de productos */}
        <section className="home-categories">
          <h2>Categorías destacadas</h2>
          <div className="category-grid">
            <Link to="/shop?category=textil" className="category-card">
              <i className="fa fa-cut" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              Textil
            </Link>
            <Link to="/shop?category=joyeria" className="category-card">
              <i className="fa fa-gem" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              Joyería
            </Link>
            <Link to="/shop?category=pintura" className="category-card">
              <i className="fa fa-palette" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              Pintura
            </Link>
            <Link to="/shop?category=ceramica" className="category-card">
              <i className="fa fa-shapes" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              Cerámica
            </Link>
          </div>
        </section>

        {/* Beneficios de la plataforma */}
        <section style={{
          backgroundColor: '#1f1f1f',
          padding: '3rem 2rem',
          borderRadius: '12px',
          marginTop: '3rem'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>¿Por qué elegir ArtesJAC?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fa fa-heart" style={{ fontSize: '2.5rem', color: '#ff5722', marginBottom: '1rem' }}></i>
              <h3>Hecho con Amor</h3>
              <p style={{ color: '#ccc' }}>
                Cada producto es creado cuidadosamente por artesanos locales con técnicas tradicionales
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <i className="fa fa-shipping-fast" style={{ fontSize: '2.5rem', color: '#ff5722', marginBottom: '1rem' }}></i>
              <h3>Envío a Todo Costa Rica</h3>
              <p style={{ color: '#ccc' }}>
                Llevamos las creaciones artesanales directamente a tu puerta en todo el país
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <i className="fa fa-handshake" style={{ fontSize: '2.5rem', color: '#ff5722', marginBottom: '1rem' }}></i>
              <h3>Apoyo Local</h3>
              <p style={{ color: '#ccc' }}>
                Al comprar aquí, apoyas directamente a artesanos y emprendedores costarricenses
              </p>
            </div>
          </div>
        </section>

        {/* Call to action final */}
        <section style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          backgroundColor: '#2b2b2b',
          borderRadius: '12px',
          marginTop: '3rem'
        }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>¿Listo para comenzar?</h2>
          <p style={{ color: '#ccc', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Únete a nuestra comunidad de amantes del arte artesanal costarricense
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="home-button">
              Explorar Productos
            </Link>
            <Link to="/register" className="home-button" style={{
              backgroundColor: 'transparent',
              border: '2px solid #ff5722'
            }}>
              Crear Cuenta
            </Link>
            <Link to="/login" className="home-button" style={{
              backgroundColor: '#333',
              border: '2px solid #333'
            }}>
              Iniciar Sesión
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};