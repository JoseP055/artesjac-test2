import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/cart.css';

export const CartPage = () => {
    // Estado para manejar los productos del carrito
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Collar Artesanal de Semillas",
            price: 12000,
            quantity: 1,
            image: "/images/collar-placeholder.jpg",
            artist: "María González"
        },
        {
            id: 2,
            name: "Bolso Tejido a Mano",
            price: 18500,
            quantity: 2,
            image: "/images/bolso-placeholder.jpg",
            artist: "Carlos Jiménez"
        },
        {
            id: 3,
            name: "Cuadro Paisaje Costarricense",
            price: 22000,
            quantity: 1,
            image: "/images/cuadro-placeholder.jpg",
            artist: "Ana Rojas"
        }
    ]);

    // Función para actualizar la cantidad de un producto
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Función para eliminar un producto del carrito
    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Función para limpiar todo el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    // Calcular el total del carrito
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Calcular cantidad total de items
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">Mi Carrito de Compras</h1>

                {cartItems.length === 0 ? (
                    // Carrito vacío
                    <div className="empty-cart">
                        <i className="fa fa-shopping-cart empty-cart-icon"></i>
                        <h2>Tu carrito está vacío</h2>
                        <p>¡Descubre nuestras hermosas artesanías costarricenses!</p>
                        <Link to="/#productos-destacados" className="continue-shopping-btn">
                            Continuar Comprando
                        </Link>
                    </div>
                ) : (
                    // Carrito con productos
                    <>
                        <div className="cart-header">
                            <span className="items-count">
                                {getTotalItems()} {getTotalItems() === 1 ? 'artículo' : 'artículos'} en tu carrito
                            </span>
                            <button className="clear-cart-btn" onClick={clearCart}>
                                <i className="fa fa-trash"></i> Limpiar Carrito
                            </button>
                        </div>

                        <div className="cart-content">
                            {/* Lista de productos */}
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-image">
                                            <div className="image-placeholder">
                                                <i className="fa fa-image"></i>
                                            </div>
                                        </div>

                                        <div className="item-details">
                                            <h3 className="item-name">{item.name}</h3>
                                            <p className="item-artist">Por: {item.artist}</p>
                                            <p className="item-price">₡{item.price.toLocaleString()}</p>
                                        </div>

                                        <div className="item-controls">
                                            <div className="quantity-controls">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <i className="fa fa-minus"></i>
                                                </button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>

                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(item.id)}
                                                title="Eliminar producto"
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>

                                        <div className="item-total">
                                            ₡{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Resumen del pedido */}
                            <div className="cart-summary">
                                <h3>Resumen del Pedido</h3>
                                
                                <div className="summary-row">
                                    <span>Subtotal ({getTotalItems()} artículos):</span>
                                    <span>₡{calculateTotal().toLocaleString()}</span>
                                </div>
                                
                                <div className="summary-row">
                                    <span>Envío:</span>
                                    <span>₡2,500</span>
                                </div>
                                
                                <div className="summary-row total-row">
                                    <span>Total:</span>
                                    <span>₡{(calculateTotal() + 2500).toLocaleString()}</span>
                                </div>

                                <Link to="/checkout" className="checkout-btn">
                                    <i className="fa fa-credit-card"></i>
                                    Proceder al Checkout
                                </Link>

                                <Link to="/#productos-destacados" className="continue-shopping-btn-summary">
                                    <i className="fa fa-arrow-left"></i>
                                    Regresar
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};