// src/pages/CartPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import { CartAPI } from "../api/cart.service";
import "../styles/cart.css";

const mapApiItems = (apiItems = []) =>
    apiItems.map((it) => {
        const prod = it && typeof it.productId === "object" ? it.productId : null;

        // id correcto para tus Links/handlers
        const id = prod?._id || String(it.productId || "");

        // nombre para tu UI
        const title = prod?.title || it.productName || "Producto";

        // precio numérico (prioridad: snapshot -> precio del producto -> lo que venga)
        const numericPrice = Number(
            it.priceAtAdd ?? prod?.price ?? it.numericPrice ?? 0
        );

        // categoría / slug (si existen)
        const category = prod?.category || it.category || "";
        const slug = prod?.slug;

        // imagen (si existiera en el product)
        const image =
            Array.isArray(prod?.images) && prod.images.length
                ? String(prod.images.find(Boolean)).replace(/\\/g, "/")
                : it.image || null;

        return {
            id,                 // <- lo usa tu UI
            productId: id,      // compatibilidad
            slug,
            name: title,        // tu UI muestra "name"
            title,
            numericPrice,
            price: numericPrice,
            quantity: Number(it.quantity || 1),
            category,
            image,
        };
    });

export const CartPage = () => {
    const { token } = useAuth() || {};
    const authToken =
        token || localStorage.getItem("token") || localStorage.getItem("authToken");

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCartItems = async () => {
        try {
            if (authToken) {
                const r = await CartAPI.mine(authToken);
                const apiItems = r?.data?.data?.items || [];
                setCartItems(mapApiItems(apiItems));
            } else {
                // Invitado: localStorage (misma UI)
                const saved = localStorage.getItem("artesjac-cart");
                const items = saved && saved !== "null" ? JSON.parse(saved) : [];
                setCartItems(items);
            }
        } catch (e) {
            console.error("Error al cargar carrito:", e?.response?.data || e.message);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCartItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return removeItem(productId);

        try {
            if (authToken) {
                await CartAPI.update({ productId, quantity: newQuantity }, authToken);
                await loadCartItems();
            } else {
                const updated = cartItems.map((it) =>
                    it.id === productId ? { ...it, quantity: newQuantity } : it
                );
                setCartItems(updated);
                localStorage.setItem("artesjac-cart", JSON.stringify(updated));
            }
        } catch (e) {
            alert("No se pudo actualizar la cantidad");
        }
    };

    const removeItem = async (productId) => {
        try {
            if (authToken) {
                await CartAPI.remove(productId, authToken);
                await loadCartItems();
            } else {
                const updated = cartItems.filter((it) => it.id !== productId);
                setCartItems(updated);
                localStorage.setItem("artesjac-cart", JSON.stringify(updated));
            }
        } catch (e) {
            alert("No se pudo eliminar el producto");
        }
    };

    const clearCart = async () => {
        if (!window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) return;
        try {
            if (authToken) {
                await CartAPI.clear(authToken);
                await loadCartItems();
            } else {
                setCartItems([]);
                localStorage.setItem("artesjac-cart", JSON.stringify([]));
            }
        } catch (e) {
            alert("No se pudo vaciar el carrito");
        }
    };

    const calculateSubtotal = () =>
        cartItems.reduce(
            (acc, it) =>
                acc + Number(it.numericPrice || 0) * Number(it.quantity || 0),
            0
        );

    const calculateShipping = () => (calculateSubtotal() >= 50000 ? 0 : 3500);
    const calculateTotal = () => calculateSubtotal() + calculateShipping();

    const handleCheckout = () => {
        if (cartItems.length === 0) return alert("Tu carrito está vacío");
        navigate("/checkout");
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
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <div className="product-image-sim"></div>
                                    </div>

                                    <div className="item-details">
                                        <Link to={`/product/${item.id}`} className="item-name">
                                            {item.name || item.title}
                                        </Link>
                                        <p className="item-category">{item.category}</p>
                                        <p className="item-price">
                                            ₡{Number(item.numericPrice || 0).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, (item.quantity || 1) - 1)
                                            }
                                            className="quantity-btn"
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, (item.quantity || 1) + 1)
                                            }
                                            className="quantity-btn"
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ₡
                                        {(
                                            Number(item.numericPrice || 0) *
                                            Number(item.quantity || 0)
                                        ).toLocaleString()}
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
                                    {calculateShipping() === 0
                                        ? "Gratis"
                                        : `₡${calculateShipping().toLocaleString()}`}
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
                                    Agrega ₡
                                    {(50000 - calculateSubtotal()).toLocaleString()} más para
                                    envío gratis
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
