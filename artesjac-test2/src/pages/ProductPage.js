import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/product.css';

export const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // Mock data de productos
    const products = [
        { id: 1, name: 'Collar artesanal de semillas', price: '₡12.000', numericPrice: 12000, category: 'joyeria', description: 'Hermoso collar hecho a mano con semillas naturales de Costa Rica. Una pieza única que refleja la tradición artesanal costarricense.' },
        { id: 2, name: 'Bolso tejido a mano', price: '₡18.500', numericPrice: 18500, category: 'textil', description: 'Bolso artesanal tejido con técnicas tradicionales, perfecto para el uso diario y con un toque de elegancia costarricense.' },
        { id: 3, name: 'Cuadro colorido abstracto', price: '₡22.000', numericPrice: 22000, category: 'pintura', description: 'Obra de arte original que captura los colores vibrantes de Costa Rica en un estilo abstracto contemporáneo.' },
        { id: 4, name: 'Vasija de cerámica tradicional', price: '₡15.800', numericPrice: 15800, category: 'ceramica', description: 'Vasija decorativa elaborada con técnicas de cerámica tradicional, ideal para decorar cualquier espacio del hogar.' },
        { id: 5, name: 'Aretes de madera tallada', price: '₡8.500', numericPrice: 8500, category: 'joyeria', description: 'Elegantes aretes tallados en madera nacional, ligeros y cómodos para uso diario.' },
        { id: 6, name: 'Tapete tejido multicolor', price: '₡25.000', numericPrice: 25000, category: 'textil', description: 'Tapete artesanal con diseños geométricos en múltiples colores, perfecto para dar vida a cualquier habitación.' },
        { id: 7, name: 'Retrato al óleo', price: '₡35.000', numericPrice: 35000, category: 'pintura', description: 'Retrato realista pintado al óleo, una obra de arte que captura la esencia y belleza del modelo.' },
        { id: 8, name: 'Juego de tazas de arcilla', price: '₡14.000', numericPrice: 14000, category: 'ceramica', description: 'Set de 4 tazas artesanales de arcilla, perfectas para disfrutar de bebidas calientes con estilo tradicional.' },
        { id: 9, name: 'Pulsera de cuentas naturales', price: '₡9.800', numericPrice: 9800, category: 'joyeria', description: 'Pulsera elegante con cuentas de materiales naturales, cómoda y versátil para cualquier ocasión.' },
        { id: 10, name: 'Manta tejida artesanal', price: '₡32.000', numericPrice: 32000, category: 'textil', description: 'Manta suave y cálida tejida a mano con lana natural, perfecta para noches frescas.' },
        { id: 11, name: 'Paisaje costarricense', price: '₡28.000', numericPrice: 28000, category: 'pintura', description: 'Hermosa pintura que retrata un paisaje típico costarricense, lleno de verdor y vida natural.' },
        { id: 12, name: 'Platos decorativos de barro', price: '₡19.500', numericPrice: 19500, category: 'ceramica', description: 'Set de platos decorativos hechos de barro natural, ideales para decoración o uso ceremonial.' }
    ];

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        setProduct(foundProduct);
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        try {
            const savedCart = localStorage.getItem('artesjac-cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];
            
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                cart = cart.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                cart.push({ ...product, quantity });
            }
            
            localStorage.setItem('artesjac-cart', JSON.stringify(cart));
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
            
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    if (!product) {
        return (
            <main className="product-container">
                <div className="product-not-found">
                    <h2>Producto no encontrado</h2>
                    <p>El producto que buscas no existe o ha sido removido.</p>
                    <Link to="/shop" className="btn-back-shop">
                        Volver a la tienda
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="product-container">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Inicio</Link>
                <span>/</span>
                <Link to="/shop">Tienda</Link>
                <span>/</span>
                <span className="current">{product.name}</span>
            </nav>

            <div className="product-detail">
                {/* Imagen del producto */}
                <div className="product-image-section">
                    <div className="product-image-main">
                        <div className="product-image-sim large"></div>
                    </div>
                </div>

                {/* Información del producto */}
                <div className="product-info-section">
                    <div className="product-category">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                    
                    <h1 className="product-title">{product.name}</h1>
                    
                    <div className="product-price-main">{product.price}</div>
                    
                    <div className="product-description">
                        <h3>Descripción</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="product-purchase">
                        <div className="quantity-section">
                            <label>Cantidad:</label>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="quantity-btn"
                                >
                                    <i className="fa fa-minus"></i>
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="quantity-btn"
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className="purchase-actions">
                            <button 
                                className={`btn-add-to-cart ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? (
                                    <>
                                        <i className="fa fa-check"></i> ¡Agregado al carrito!
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-shopping-cart"></i> Agregar al carrito
                                    </>
                                )}
                            </button>
                            
                            <button 
                                className="btn-buy-now"
                                onClick={() => {
                                    handleAddToCart();
                                    setTimeout(() => navigate('/cart'), 500);
                                }}
                            >
                                <i className="fa fa-bolt"></i> Comprar ahora
                            </button>
                        </div>
                    </div>

                    <div className="product-features">
                        <div className="feature">
                            <i className="fa fa-truck"></i>
                            <span>Envío gratis a todo Costa Rica</span>
                        </div>
                        <div className="feature">
                            <i className="fa fa-shield-alt"></i>
                            <span>Garantía de calidad artesanal</span>
                        </div>
                        <div className="feature">
                            <i className="fa fa-heart"></i>
                            <span>Hecho con amor por artesanos locales</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de regreso */}
            <div className="navigation-actions">
                <Link to="/shop" className="btn-back">
                    <i className="fa fa-arrow-left"></i> Volver a la tienda
                </Link>
            </div>
        </main>
    );
};