import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/cart.css';

export const CartPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        try {
            const savedCart = localStorage.getItem('artesjac-cart');
            if (savedCart && savedCart !== 'null') {
                const cart = JSON.parse(savedCart);
                setCartItems(cart);
            }
        } catch (error) {
            console.error('Error al cargar carrito:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(productId);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);
        localStorage.setItem('artesjac-cart', JSON.stringify(updatedCart));
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('artesjac-cart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            setCartItems([]);
            localStorage.setItem('artesjac-cart', JSON.stringify([]));
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal >= 50000 ? 0 : 3500; // Envío gratis para compras mayores a ₡50,000
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        navigate('/checkout');
    };

    if (isLoading) {
        return (
            <div className="cart-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando carrito...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>🛒 Mi Carrito de Compras</h1>
                <p>{cartItems.length} productos en tu carrito</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <i className="fa fa-shopping-cart"></i>
                    <h2>Tu carrito está vacío</h2>
                    <p>¡Descubre productos únicos y artesanales!</p>
                    <Link to="/shop" className="btn-continue-shopping">
                        <i className="fa fa-arrow-left"></i>
                        Continuar comprando
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        <div className="cart-items-header">
                            <h2>Productos en tu carrito</h2>
                            <button onClick={clearCart} className="btn-clear-cart">
                                <i className="fa fa-trash"></i>
                                Vaciar carrito
                            </button>
                        </div>

                        <div className="items-list">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <div className="product-image-sim"></div>
                                    </div>

                                    <div className="item-details">
                                        <Link to={`/product/${item.id}`} className="item-name">
                                            {item.name}
                                        </Link>
                                        <p className="item-category">{item.category}</p>
                                        <p className="item-price">₡{item.numericPrice.toLocaleString()}</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="quantity-btn"
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="quantity-btn"
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ₡{(item.numericPrice * item.quantity).toLocaleString()}
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="btn-remove-item"
                                        title="Eliminar producto"
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cart-summary">
                        <div className="summary-card">
                            <h3>Resumen del Pedido</h3>

                            <div className="summary-line">
                                <span>Subtotal ({cartItems.length} productos):</span>
                                <span>₡{calculateSubtotal().toLocaleString()}</span>
                            </div>

                            <div className="summary-line">
                                <span>Envío:</span>
                                <span>
                                    {calculateShipping() === 0 ? 'Gratis' : `₡${calculateShipping().toLocaleString()}`}
                                </span>
                            </div>

                            {calculateShipping() === 0 && (
                                <div className="free-shipping-notice">
                                    <i className="fa fa-check-circle"></i>
                                    ¡Felicidades! Tu pedido tiene envío gratis
                                </div>
                            )}

                            {calculateShipping() > 0 && (
                                <div className="shipping-notice">
                                    <i className="fa fa-info-circle"></i>
                                    Agrega ₡{(50000 - calculateSubtotal()).toLocaleString()} más para envío gratis
                                </div>
                            )}

                            <div className="summary-line total">
                                <span>Total:</span>
                                <span>₡{calculateTotal().toLocaleString()}</span>
                            </div>

                            <button onClick={handleCheckout} className="btn-checkout">
                                <i className="fa fa-credit-card"></i>
                                Proceder al Pago
                            </button>

                            <div className="security-badges">
                                <div className="security-item">
                                    <i className="fa fa-shield-alt"></i>
                                    <span>Compra Segura</span>
                                </div>
                                <div className="security-item">
                                    <i className="fa fa-truck"></i>
                                    <span>Envío a Todo CR</span>
                                </div>
                                <div className="security-item">
                                    <i className="fa fa-undo"></i>
                                    <span>Garantía de Calidad</span>
                                </div>
                            </div>
                        </div>

                        <div className="continue-shopping">
                            <Link to="/shop" className="btn-continue-shopping">
                                <i className="fa fa-arrow-left"></i>
                                Continuar comprando
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};