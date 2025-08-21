// src/pages/ShopPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/shop.css';
import { ShopAPI } from '../api/shop.service';
import { resolveImgUrl } from "../utils/resolveImgUrl";
import noImage from "../assets/images/noimage.png"; // ⬅️ Fallback local

// Devuelve la primera imagen válida o null
const firstImg = (p) => {
    const candidate = Array.isArray(p?.images) && p.images.length
        ? p.images.find(Boolean)
        : p?.image || p?.img || p?.thumbnail || null;
    return candidate ? String(candidate).replace(/\\/g, "/") : null;
};


// Mock de respaldo si la API falla (conserva TUS textos y formato)
const mockProducts = [
    { id: 1, name: "Collar artesanal de semillas", price: "₡12.000", numericPrice: 12000, category: "joyeria", description: "Hermoso collar hecho con semillas naturales costarricenses" },
    { id: 2, name: "Bolso tejido a mano", price: "₡18.500", numericPrice: 18500, category: "textil", description: "Bolso tradicional tejido por artesanas locales" },
    { id: 3, name: "Cuadro colorido abstracto", price: "₡22.000", numericPrice: 22000, category: "pintura", description: "Pintura original inspirada en la naturaleza de Costa Rica" },
    { id: 4, name: "Vasija de cerámica tradicional", price: "₡15.800", numericPrice: 15800, category: "ceramica", description: "Vasija elaborada con técnicas ancestrales de alfarería" },
    { id: 5, name: "Aretes de madera tallada", price: "₡8.500", numericPrice: 8500, category: "joyeria", description: "Aretes únicos tallados en madera de guanacaste" },
    { id: 6, name: "Manteles bordados", price: "₡25.000", numericPrice: 25000, category: "textil", description: "Manteles con bordados tradicionales hechos a mano" },
    { id: 7, name: "Escultura de madera", price: "₡35.000", numericPrice: 35000, category: "escultura", description: "Escultura artística tallada en madera preciosa" },
    { id: 8, name: "Pulsera de semillas naturales", price: "₡6.500", numericPrice: 6500, category: "joyeria", description: "Pulsera delicada hecha con semillas del bosque tropical" },
    { id: 9, name: "Cojines decorativos", price: "₡14.000", numericPrice: 14000, category: "textil", description: "Cojines con diseños típicos costarricenses" },
    { id: 10, name: "Tazas de cerámica artesanal", price: "₡9.800", numericPrice: 9800, category: "ceramica", description: "Set de tazas únicas hechas en torno de alfarero" },
    { id: 11, name: "Cuadro paisaje costarricense", price: "₡28.000", numericPrice: 28000, category: "pintura", description: "Paisaje inspirado en los volcanes de Costa Rica" },
    { id: 12, name: "Canasta tejida tradicional", price: "₡16.500", numericPrice: 16500, category: "textil", description: "Canasta funcional tejida con fibras naturales" },
];

export const ShopPage = () => {
    // ⬇️ ahora vienen de la API
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [addingToCart, setAddingToCart] = useState(null);
    const [error, setError] = useState('');

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('artesjac-cart');
            if (savedCart && savedCart !== 'null' && savedCart !== '[]') {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (e) {
            console.error('Error al cargar carrito:', e);
        }
    }, []);

    // Cargar productos desde backend (con fallback a mock si falla)
    useEffect(() => {
        (async () => {
            setError('');
            try {
                const res = await ShopAPI.list({ limit: 200 });
                const list = res?.data?.data || [];
                setProducts(list);
            } catch (e) {
                console.error(e);
                setError('No se pudieron cargar los productos. Mostrando datos de ejemplo.');
                setProducts(mockProducts);
            }
        })();
    }, []);

    // Filtrar productos por categoría y búsqueda (MISMA LÓGICA/ESTRUCTURA)
    useEffect(() => {
        let filtered = products;

        if (selectedCategory !== 'todos') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, searchTerm, products]);

    // Función para agregar al carrito con animación (idéntica)
    const addToCart = async (product) => {
        setAddingToCart(product.id);

        try {
            const savedCart = localStorage.getItem('artesjac-cart');
            let currentCart = [];
            if (savedCart && savedCart !== 'null') currentCart = JSON.parse(savedCart);

            const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
            if (existingItemIndex > -1) currentCart[existingItemIndex].quantity += 1;
            else currentCart.push({ ...product, quantity: 1 });

            localStorage.setItem('artesjac-cart', JSON.stringify(currentCart));
            setCartItems(currentCart);

            await new Promise(resolve => setTimeout(resolve, 500));

            const notification = document.createElement('div');
            notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white; padding: 1rem 1.5rem; border-radius: 8px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 1000; font-weight: bold; animation: slideIn 0.3s ease;
      `;
            notification.innerHTML = `✅ ${product.name} agregado al carrito!`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito');
        } finally {
            setAddingToCart(null);
        }
    };

    // Totales de carrito (idéntico)
    const calculateCartTotal = () =>
        cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);

    const getTotalCartItems = () =>
        cartItems.reduce((total, item) => total + item.quantity, 0);

    // Categorías con conteos desde lo que trae la API
    const categories = useMemo(() => {
        const counts = { textil: 0, joyeria: 0, pintura: 0, ceramica: 0, escultura: 0 };
        products.forEach(p => {
            if (counts.hasOwnProperty(p.category)) counts[p.category] += 1;
        });
        return [
            { id: 'todos', name: 'Todos los productos', count: products.length, icon: '🎨' },
            { id: 'textil', name: 'Textil', count: counts.textil, icon: '🧵' },
            { id: 'joyeria', name: 'Joyería', count: counts.joyeria, icon: '💎' },
            { id: 'pintura', name: 'Pintura', count: counts.pintura, icon: '🎨' },
            { id: 'ceramica', name: 'Cerámica', count: counts.ceramica, icon: '🏺' },
            { id: 'escultura', name: 'Escultura', count: counts.escultura, icon: '🗿' },
        ];
    }, [products]);

    // Helper: resuelve URL final o usa noImage
    const getImgSrc = (product) => {
        const candidate = firstImg(product);
        if (!candidate) return noImage;
        try {
            const url = resolveImgUrl(candidate);
            return url || noImage;
        } catch {
            return noImage;
        }
    };

    return (
        <main className="shop-container">
            {/* Header de la tienda */}
            <div className="shop-header">
                <h1>Tienda ArtesJAC</h1>
                <p>Descubre arte auténtico costarricense hecho a mano por talentosos artesanos locales</p>
            </div>

            {/* Indicador del carrito */}
            <div className="cart-indicator">
                <div className="cart-indicator-info">
                    <i className="fa fa-shopping-cart"></i>
                    <span>
                        {getTotalCartItems()} producto{getTotalCartItems() !== 1 ? 's' : ''} en el carrito -
                        Total: ₡{calculateCartTotal().toLocaleString()}
                    </span>
                </div>
                <Link to="/cart" className="view-cart-btn">
                    <i className="fa fa-arrow-right"></i> Ver Carrito
                </Link>
            </div>

            {/* Buscador */}
            <div className="shop-search">
                <input
                    type="text"
                    placeholder="🔍 Buscar productos, categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="shop-content">
                {/* Sidebar de categorías */}
                <aside className="shop-sidebar">
                    <h3>📂 Categorías</h3>
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Grid de productos */}
                <section className="products-section">
                    <div className="products-header">
                        <h2>
                            {selectedCategory === 'todos'
                                ? '🎨 Todos los productos'
                                : `${categories.find(c => c.id === selectedCategory)?.icon || '🎨'} ${categories.find(c => c.id === selectedCategory)?.name || ''}`}
                        </h2>
                        <span className="products-count">{filteredProducts.length} productos</span>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: 16 }}>
                            <i className="fa fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-media">
                                    <img
                                        src={getImgSrc(product)}                 // ⬅️ usa backend o fallback local
                                        alt={`Imagen de ${product.name}`}
                                        className="product-thumb"
                                        loading="lazy"
                                        decoding="async"
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
                                        onError={(e) => {
                                            if (e.currentTarget.dataset.fallback === "1") return;
                                            e.currentTarget.dataset.fallback = "1"; // evita loop
                                            e.currentTarget.src = noImage;          // ⬅️ fallback definitivo
                                        }}
                                    />
                                </div>

                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{product.price}</p>
                                    <p className="product-category">
                                        {(categories.find(c => c.id === product.category)?.icon || '🎨')}{' '}
                                        {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ''}
                                    </p>
                                </div>

                                <div className="product-actions">
                                    <button
                                        className="btn-add-to-cart"
                                        onClick={() => addToCart(product)}
                                        disabled={addingToCart === product.id}
                                    >
                                        {addingToCart === product.id ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin"></i>
                                                Agregando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-shopping-cart"></i>
                                                Agregar al carrito
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to={`/product/${product.id}`}
                                        className="btn-view-details"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <i className="fa fa-eye"></i>
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <i className="fa fa-search" style={{ fontSize: '3rem', color: '#666', marginBottom: '1rem' }}></i>
                            <h3>No se encontraron productos</h3>
                            <p>
                                {searchTerm ?
                                    `No hay productos que coincidan con "${searchTerm}"` :
                                    'No hay productos en esta categoría'
                                }
                            </p>
                            <p>Intenta cambiar los filtros o el término de búsqueda</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Animación de notificación */}
            <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
        </main>
    );
};
