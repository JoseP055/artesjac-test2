import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/cart.css';

export const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem('artesjac-cart');
                if (savedCart && savedCart !== 'null' && savedCart !== '[]') {
                    const cart = JSON.parse(savedCart);
                    setCartItems(cart);
                } else {
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Error al cargar carrito:', error);
                setCartItems([]);
            }
            setIsLoading(false);
        };

        loadCart();
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('artesjac-cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoading]);

    // 🔄 Función para sincronizar estado y localStorage
    const syncCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('artesjac-cart', JSON.stringify(newCart));
    };

    // Actualizar cantidad
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(productId);
            return;
        }

        const updated = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        syncCart(updated);
    };

    // Eliminar un producto
    const removeItem = (productId) => {
        const newCart = cartItems.filter(item => item.id !== productId);
        syncCart(newCart);
    };

    // Vaciar todo el carrito
    const clearCart = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            syncCart([]);
        }
    };

    // Calcular totales
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/checkout');
        }
    };

    // Cargando...
    if (isLoading) {
        return (
            <main className="cart-container">
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    backgroundColor: '#1f1f1f',
                    borderRadius: '12px',
                    marginTop: '2rem'
                }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#ff5722', marginBottom: '1rem' }}></i>
                    <h2>Cargando carrito...</h2>
                </div>
            </main>
        );
    }

    // Carrito vacío
    if (cartItems.length === 0) {
        return (
            <main className="cart-container">
                <div className="cart-empty">
                    <i className="fa fa-shopping-cart" style={{ fontSize: '4rem', color: '#666', marginBottom: '1rem' }}></i>
                    <h2>Tu carrito está vacío</h2>
                    <p>¡Descubre nuestros productos artesanales y agrega algunos al carrito!</p>
                    <Link to="/shop" className="btn-continue-shopping">
                        <i className="fa fa-arrow-left"></i> Continuar comprando
                    </Link>
                </div>
            </main>
        );
    }

    // Carrito con productos
    return (
        <main className="cart-container">
            <div className="cart-header">
                <h1>Tu Carrito</h1>
                <p>{getTotalItems()} producto{getTotalItems() !== 1 ? 's' : ''} en tu carrito</p>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-image">
                                <div className="product-image-sim"></div>
                            </div>

                            <div className="item-info">
                                <Link to={`/product/${item.id}`} className="item-name">
                                    {item.name}
                                </Link>
                                <p className="item-category">
                                    Categoría: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                </p>
                                <p className="item-price">{item.price}</p>
                            </div>

                            <div className="item-controls">
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <i className="fa fa-minus"></i>
                                    </button>
                                    <span className="quantity-display">{item.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>

                                <p className="item-subtotal">
                                    Subtotal: ₡{(item.numericPrice * item.quantity).toLocaleString()}
                                </p>

                                <button
                                    className="btn-remove"
                                    onClick={() => removeItem(item.id)}
                                >
                                    <i className="fa fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h3>Resumen del pedido</h3>

                        <div className="summary-row">
                            <span>Productos ({getTotalItems()})</span>
                            <span>₡{calculateTotal().toLocaleString()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Envío</span>
                            <span>Gratis</span>
                        </div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₡{calculateTotal().toLocaleString()}</span>
                        </div>

                        <div className="cart-actions">
                            <button
                                className="btn-checkout"
                                onClick={handleCheckout}
                            >
                                <i className="fa fa-credit-card"></i> Proceder al pago
                            </button>

                            <Link to="/shop" className="btn-continue-shopping">
                                <i className="fa fa-arrow-left"></i> Continuar comprando
                            </Link>

                            <button
                                className="btn-clear-cart"
                                onClick={clearCart}
                            >
                                <i className="fa fa-trash"></i> Vaciar carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
