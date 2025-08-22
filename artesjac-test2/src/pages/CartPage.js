import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { api } from '../api';
import '../styles/cart.css';

// ✅ API corregida para coincidir con tu backend
const CartAPI = {
    get: async () => {
        const res = await api.get("/cart");
        return res.data;
    },
    add: async (productId, quantity = 1) => {
        const res = await api.post("/cart/items", { productId, quantity });
        return res.data;
    },
    updateQuantity: async (productId, quantity) => {
        const res = await api.put("/cart/items", { productId, quantity });
        return res.data;
    },
    remove: async (productId) => {
        const res = await api.delete(`/cart/items/${productId}`);
        return res.data;
    },
    clear: async () => {
        const res = await api.delete("/cart");
        return res.data;
    }
};

// ✅ Función global para agregar al carrito desde cualquier lugar
window.addToCart = async (productId, quantity = 1) => {
    try {
        const response = await CartAPI.add(productId, quantity);
        if (response.ok) {
            alert('Producto agregado al carrito exitosamente');
            return response.data;
        } else {
            throw new Error(response.error || 'Error agregando producto');
        }
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Error agregando al carrito';
        alert(errorMessage);
        return null;
    }
};

export const CartPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartData, setCartData] = useState({ items: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            loadCartItems();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const loadCartItems = async () => {
        try {
            setIsLoading(true);
            const response = await CartAPI.get();
            if (response.ok) {
                setCartData(response.data);
            }
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('Error al cargar el carrito. Por favor recarga la página.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(productId);
            return;
        }

        try {
            setIsUpdating(true);
            const response = await CartAPI.updateQuantity(productId, newQuantity);
            if (response.ok) {
                setCartData(response.data);
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            alert(error.response?.data?.error || 'Error al actualizar el producto');
        } finally {
            setIsUpdating(false);
        }
    };

    const removeItem = async (productId) => {
        try {
            setIsUpdating(true);
            const response = await CartAPI.remove(productId);
            if (response.ok) {
                setCartData(response.data);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert(error.response?.data?.error || 'Error al eliminar el producto');
        } finally {
            setIsUpdating(false);
        }
    };

    const clearCart = async () => {
        if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            try {
                setIsUpdating(true);
                const response = await CartAPI.clear();
                if (response.ok) {
                    setCartData(response.data);
                }
            } catch (error) {
                console.error('Error al limpiar carrito:', error);
                alert(error.response?.data?.error || 'Error al limpiar el carrito');
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleCheckout = () => {
        if (cartData.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        navigate('/checkout');
    };

    // ✅ Ahora tomamos la imagen desde productId.images
    const getProductImageUrl = (item) => {
        if (!item.productId?.images?.length) return null;
        return item.productId.images[0];
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
                <p>{cartData.items.length} productos en tu carrito</p>
            </div>

            {cartData.items.length === 0 ? (
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
                            <button
                                onClick={clearCart}
                                className="btn-clear-cart"
                                disabled={isUpdating}
                            >
                                <i className="fa fa-trash"></i>
                                Vaciar carrito
                            </button>
                        </div>

                        <div className="items-list">
                            {cartData.items.map(item => (
                                <div key={item.productId._id} className="cart-item">
                                    <div className="item-image">
                                        {getProductImageUrl(item) ? (
                                            <img
                                                src={getProductImageUrl(item)}
                                                alt={item.productId.title}
                                            />
                                        ) : (
                                            <div className="product-image-sim">Sin imagen</div>
                                        )}
                                    </div>

                                    <div className="item-details">
                                        <Link to={`/product/${item.productId._id}`} className="item-name">
                                            {item.productId.title}
                                        </Link>
                                        <p className="item-category">{item.productId.category || 'Sin categoría'}</p>
                                        <p className="item-price">₡{item.productId.price.toLocaleString()}</p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                            className="quantity-btn"
                                            disabled={isUpdating}
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                            className="quantity-btn"
                                            disabled={isUpdating}
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ₡{(item.productId.price * item.quantity).toLocaleString()}
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.productId._id)}
                                        className="btn-remove-item"
                                        title="Eliminar producto"
                                        disabled={isUpdating}
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

                            <div className="summary-line total">
                                <span>Total:</span>
                                <span>
                                    ₡{cartData.items.reduce((sum, it) => sum + it.productId.price * it.quantity, 0).toLocaleString()}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn-checkout"
                                disabled={isUpdating || cartData.items.length === 0}
                            >
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

            {isUpdating && (
                <div className="updating-overlay">
                    <div className="updating-spinner">
                        <div className="loading-spinner"></div>
                        <p>Actualizando carrito...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
