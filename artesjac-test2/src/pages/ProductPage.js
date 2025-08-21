// src/pages/ProductPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import { ShopAPI } from "../api/shop.service";
import { resolveImgUrl } from "../utils/resolveImgUrl";
import noImage from "../assets/images/noimage.png";
import "../styles/product.css";

// Formateo de colones CR
const fmtCRC = (n) =>
    typeof n === "number" ? `₡${n.toLocaleString("es-CR")}` : n;

// Traducción simple de categorías (si en DB están en inglés)
const catLabel = (c) => {
    const map = {
        jewelery: "Joyería",
        art: "Pintura",
        ceramics: "Cerámica",
        textiles: "Textil",
        decoration: "Decoración",
        bags: "Bolsos",
        wood: "Madera",
    };
    return map[c] || (c ? c[0].toUpperCase() + c.slice(1) : "General");
};

// Saca la primera imagen válida del arreglo
const firstImg = (p) => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    const candidate = arr.find(Boolean);
    return candidate ? String(candidate).replace(/\\/g, "/") : null;
};

export const ProductPage = () => {
    // Soporta ruta /p/:slug o /product/:id (cualquiera de los dos)
    const params = useParams();
    const slugOrId = params.slug || params.id;

    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [sellerInfo, setSellerInfo] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const [productReviews, setProductReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    const [userRating, setUserRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Cargar detalle + reseñas reales (públicas)
    const load = async () => {
        try {
            // Detalle por slugOrId (axios-like: res.data => { ok, data })
            const resDetail = await ShopAPI.get(slugOrId);
            const detail = resDetail?.data?.data;
            if (!detail) {
                setProduct(null);
                return;
            }
            setProduct(detail);

            // Vendedor público embebido
            if (detail.vendorId) {
                setSellerInfo({
                    id: detail.vendorId._id || detail.vendorId.id,
                    businessName: detail.vendorId.companyName || detail.vendorId.name,
                    name: detail.vendorId.name,
                    role: detail.vendorId.role,
                    avatar: detail.vendorId.avatar,
                });
            } else {
                setSellerInfo(null);
            }

            // Rating agregado desde el mismo detalle (si backend lo manda)
            if (typeof detail.averageRating === "number") {
                setAverageRating(detail.averageRating);
            } else {
                setAverageRating(0);
            }

            // Reseñas aprobadas públicas
            const pid = detail._id || detail.id;
            if (pid) {
                const resReviews = await ShopAPI.reviews(pid, { page: 1, limit: 10 });
                const list = resReviews?.data?.data || [];
                setProductReviews(list);

                // Si el detalle no trae average, calcularlo localmente
                if (typeof detail.averageRating !== "number") {
                    const sum = list.reduce((acc, rv) => acc + (rv.rating || 0), 0);
                    setAverageRating(list.length ? sum / list.length : 0);
                }
            } else {
                setProductReviews([]);
            }
        } catch (err) {
            console.error("Product detail error:", err?.response?.data || err.message);
            setProduct(null);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slugOrId]);

    // Agregar al carrito (compatibilidad: guarda id, name, etc.)
    const handleAddToCart = () => {
        if (!product) return;

        try {
            const savedCart = localStorage.getItem("artesjac-cart");
            let cart = savedCart ? JSON.parse(savedCart) : [];

            const cartId = product._id || product.id;
            const existing = cart.find((it) => it.id === cartId);

            const img = firstImg(product);

            if (existing) {
                cart = cart.map((it) =>
                    it.id === cartId ? { ...it, quantity: (it.quantity || 1) + quantity } : it
                );
            } else {
                cart.push({
                    id: cartId, // compatibilidad con lógicas previas
                    productId: cartId,
                    slug: product.slug,
                    name: product.title, // compatibilidad con UIs que esperan "name"
                    title: product.title,
                    price: product.price,
                    quantity,
                    image: img,
                    category: product.category,
                    stock: product.stock,
                });
            }

            localStorage.setItem("artesjac-cart", JSON.stringify(cart));
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2500);
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    };

    // En esta versión seguimos usando localStorage para enviar reseñas (no hay POST público aún)
    const handleSubmitReview = () => {
        if (!user || userRating === 0 || !product) return;

        const newReview = {
            _id: `local_${Date.now()}`,
            userId: { name: user.name || "Usuario" }, // para calzar con el shape público
            rating: userRating,
            comment: reviewComment,
            createdAt: new Date().toISOString(),
            _local: true, // flag local
        };

        try {
            const pid = product._id || product.id || product.slug;
            const key = `product_reviews_${pid}`;
            const existingLocal = localStorage.getItem(key);
            const localArr = existingLocal ? JSON.parse(existingLocal) : [];

            const updated = [newReview, ...productReviews, ...localArr];
            localStorage.setItem(key, JSON.stringify(updated));
            setProductReviews(updated);

            // Recalcular promedio (local)
            const sum = updated.reduce((acc, rv) => acc + (rv.rating || 0), 0);
            setAverageRating(updated.length ? sum / updated.length : 0);

            setUserRating(0);
            setReviewComment("");
            setShowReviewForm(false);
            alert("¡Reseña enviada! (local)");
        } catch (error) {
            console.error("Error al guardar reseña:", error);
            alert("Error al enviar la reseña");
        }
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => (
        <div className={`stars ${interactive ? "interactive" : ""}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`fa fa-star ${star <= Math.round(rating) ? "active" : ""}`}
                    onClick={interactive ? () => onStarClick(star) : undefined}
                />
            ))}
        </div>
    );

    // Fusión reseñas de API + locales (si las hay)
    const mergedReviews = (() => {
        if (!product) return [];
        const pid = product._id || product.id || product.slug;
        const key = `product_reviews_${pid}`;
        let locals = [];
        try {
            const saved = localStorage.getItem(key);
            locals = saved ? JSON.parse(saved) : [];
        } catch { }
        // Las del backend vienen con shape { userId: { name, avatar }, rating, comment, createdAt }
        return [...locals, ...productReviews];
    })();

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

    const img = firstImg(product);

    return (
        <main className="product-container">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Inicio</Link>
                <span>/</span>
                <Link to="/shop">Tienda</Link>
                <span>/</span>
                <span className="current">{product.title}</span>
            </nav>

            <div className="product-detail">
                {/* Imagen del producto */}
                <div className="product-image-section">
                    <div className="product-image-main">
                        <img
                            className="product-image-sim large"
                            src={img ? resolveImgUrl(img) : noImage}
                            alt={product.title}
                            onError={(e) => {
                                e.currentTarget.src = noImage;
                            }}
                        />
                    </div>
                </div>

                {/* Información del producto */}
                <div className="product-info-section">
                    <div className="product-category">{catLabel(product.category)}</div>

                    <h1 className="product-title">{product.title}</h1>

                    {/* Rating del producto */}
                    <div className="product-rating">
                        {renderStars(averageRating)}
                        <span className="rating-text">
                            {averageRating > 0 ? averageRating.toFixed(1) : "Sin calificar"}
                            {product.reviewsCount ? ` (${product.reviewsCount} reseñas)` : ""}
                        </span>
                    </div>

                    <div className="product-price-main">{fmtCRC(product.price)}</div>

                    <div className="product-description">
                        <h3>Descripción</h3>
                        <p>{product.description || "Sin descripción"}</p>
                    </div>

                    <div className="product-purchase">
                        <div className="quantity-section">
                            <label>Cantidad:</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="quantity-btn"
                                >
                                    <i className="fa fa-minus" />
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="quantity-btn"
                                >
                                    <i className="fa fa-plus" />
                                </button>
                            </div>
                        </div>

                        <div className="purchase-actions">
                            <button
                                className={`btn-add-to-cart ${addedToCart ? "added" : ""}`}
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                {addedToCart ? (
                                    <>
                                        <i className="fa fa-check" /> ¡Agregado!
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-shopping-cart" /> Agregar al carrito
                                    </>
                                )}
                            </button>

                            <button
                                className="btn-buy-now"
                                disabled={product.stock <= 0}
                                onClick={() => {
                                    handleAddToCart();
                                    setTimeout(() => navigate("/cart"), 400);
                                }}
                            >
                                <i className="fa fa-bolt" /> Comprar ahora
                            </button>
                        </div>

                        {/* Botón para evaluar producto */}
                        {user && user.userType === "buyer" && (
                            <button
                                className="btn-review-product"
                                onClick={() => setShowReviewForm(true)}
                            >
                                <i className="fa fa-star" /> Evaluar Producto
                            </button>
                        )}
                    </div>

                    <div className="product-features">
                        <div className="feature">
                            <i className="fa fa-truck" />
                            <span>Envío a todo Costa Rica</span>
                        </div>
                        <div className="feature">
                            <i className="fa fa-shield-alt" />
                            <span>Garantía de calidad artesanal</span>
                        </div>
                        <div className="feature">
                            <i className="fa fa-heart" />
                            <span>Hecho con amor por artesanos locales</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del Vendedor */}
            {sellerInfo && (
                <div className="seller-info-section">
                    <h2>🏪 Información del Vendedor</h2>
                    <div className="seller-card">
                        <div className="seller-header">
                            <div className="seller-avatar">
                                {sellerInfo.avatar ? (
                                    <img src={sellerInfo.avatar} alt={sellerInfo.businessName || sellerInfo.name} />
                                ) : (
                                    <i className="fa fa-store" />
                                )}
                            </div>
                            <div className="seller-details">
                                <h3>{sellerInfo.businessName || sellerInfo.name}</h3>
                                {sellerInfo.role && (
                                    <p className="seller-category">{String(sellerInfo.role).toUpperCase()}</p>
                                )}
                            </div>
                        </div>

                        <div className="seller-actions">
                            {/* Ajustá esta ruta si tenés perfil público del vendedor */}
                            <Link to={`/seller-profile/${sellerInfo.id || product.vendorId}`} className="btn-view-store">
                                <i className="fa fa-eye" /> Ver Tienda Completa
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Reseñas del Producto */}
            <div className="product-reviews-section">
                <h2>⭐ Reseñas del Producto</h2>
                {mergedReviews.length > 0 ? (
                    <div className="reviews-list">
                        {mergedReviews.slice(0, 10).map((review) => (
                            <div key={review._id || review.id} className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        {review.userId?.avatar ? (
                                            <img src={review.userId.avatar} alt={review.userId?.name} className="review-avatar" />
                                        ) : (
                                            <i className="fa fa-user-circle" />
                                        )}
                                        <span>{review.userId?.name || review.userName || "Usuario"}</span>
                                    </div>
                                    <div className="review-rating">{renderStars(review.rating || 0)}</div>
                                </div>
                                <div className="review-date">
                                    {new Date(review.createdAt || review.date).toLocaleDateString("es-CR")}
                                </div>
                                {review.comment && <div className="review-comment">{review.comment}</div>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-reviews">Aún no hay reseñas para este producto.</p>
                )}
            </div>

            {/* Botón de regreso */}
            <div className="navigation-actions">
                <Link to="/shop" className="btn-back">
                    <i className="fa fa-arrow-left" /> Volver a la tienda
                </Link>
            </div>

            {/* Modal para evaluar producto (local, sin POST aún) */}
            {showReviewForm && (
                <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Evaluar Producto</h2>
                            <button onClick={() => setShowReviewForm(false)} className="modal-close">
                                <i className="fa fa-times" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rating-section">
                                <label>Calificación del producto:</label>
                                {renderStars(userRating, true, setUserRating)}
                            </div>
                            <div className="comment-section">
                                <label>Comentario (opcional):</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Contanos tu experiencia…"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowReviewForm(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={handleSubmitReview} className="btn-submit" disabled={userRating === 0}>
                                Enviar Reseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductPage;
