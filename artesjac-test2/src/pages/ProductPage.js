// src/pages/ProductPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import { ShopAPI } from "../api/shop.service";
import { ReviewsAPI } from "../api/reviews.service";
import { resolveImgUrl } from "../utils/resolveImgUrl";
import noImage from "../assets/images/noimage.png";
import "../styles/product.css";
import { CartAPI } from "../api/cart.service";

// Formateo de colones CR
const fmtCRC = (n) => (typeof n === "number" ? `₡${n.toLocaleString("es-CR")}` : n);

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

// Saca la primera imagen válida del arreglo (se usa para carrito)
const firstImg = (p) => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    const candidate = arr.find(Boolean);
    return candidate ? String(candidate).replace(/\\/g, "/") : null;
};

const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s || ""));

export const ProductPage = () => {
    // Soporta ruta /p/:slug o /product/:id (cualquiera de los dos)
    const params = useParams();
    const slugOrId = params.slug || params.id;

    const navigate = useNavigate();
    const routerLocation = useLocation(); // ✅ usar routerLocation, no el global "location"
    const { user, token } = useAuth() || {};
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");

    const [product, setProduct] = useState(null);
    const [sellerInfo, setSellerInfo] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // --- Reviews del PRODUCTO ---
    const [productReviews, setProductReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);

    // --- Reviews de la TIENDA ---
    const [storeReviews, setStoreReviews] = useState([]);
    const [storeAvg, setStoreAvg] = useState(0);
    const [storeUserRating, setStoreUserRating] = useState(0);
    const [storeReviewComment, setStoreReviewComment] = useState("");
    const [showStoreReviewForm, setShowStoreReviewForm] = useState(false);

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

    // Cargar detalle + reseñas desde DB
    const load = async () => {
        try {
            // Detalle por slugOrId
            const resDetail = await ShopAPI.get(slugOrId);
            const detail = resDetail?.data?.data;
            if (!detail) {
                setProduct(null);
                return;
            }
            setProduct(detail);

            // Vendedor
            if (detail.vendorId) {
                const vendorId = detail.vendorId._id || detail.vendorId.id || detail.vendorId;
                setSellerInfo({
                    id: vendorId,
                    businessName: detail.vendorId.companyName || detail.vendorId.name,
                    name: detail.vendorId.name,
                    role: detail.vendorId.role,
                    avatar: detail.vendorId.avatar,
                });
            } else {
                setSellerInfo(null);
            }

            // PRODUCT REVIEWS (DB)
            const pid = detail._id || detail.id;
            if (pid) {
                const resReviews = await ReviewsAPI.listProduct(pid, { page: 1, limit: 50 });
                const list = resReviews?.data?.data || [];
                setProductReviews(list);

                const avg = list.reduce((acc, rv) => acc + (rv.rating || 0), 0) / (list.length || 1);
                setAverageRating(list.length ? avg : 0);

                // Si el usuario ya reseñó este producto, precarga para editar
                const mine = user && list.find((r) => String(r.userId?._id || r.userId) === String(user.id));
                if (mine) {
                    setUserRating(mine.rating);
                    setReviewComment(mine.comment || "");
                }
            } else {
                setProductReviews([]);
                setAverageRating(0);
            }

            // STORE REVIEWS (DB)
            const vid =
                detail.vendorId && (detail.vendorId._id || detail.vendorId.id || detail.vendorId);
            if (vid && isObjectId(vid)) {
                const r2 = await ReviewsAPI.listStore(vid, { page: 1, limit: 50 });
                const list2 = r2?.data?.data || [];
                setStoreReviews(list2);
                const avg2 = list2.reduce((a, b) => a + (b.rating || 0), 0) / (list2.length || 1);
                setStoreAvg(list2.length ? avg2 : 0);

                const mine2 =
                    user && list2.find((r) => String(r.userId?._id || r.userId) === String(user.id));
                if (mine2) {
                    setStoreUserRating(mine2.rating);
                    setStoreReviewComment(mine2.comment || "");
                }
            } else {
                setStoreReviews([]);
                setStoreAvg(0);
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

    // ✅ URL de imagen robusta con fallbacks
    const imgSrc = React.useMemo(() => {
        if (!product) return noImage;
        const raw =
            Array.isArray(product?.images) && product.images.length
                ? product.images.find(Boolean)
                : product?.image || product?.img || product?.thumbnail || null;
        if (!raw) return noImage;
        const normalized = String(raw).replace(/\\/g, "/");
        try {
            const resolved = resolveImgUrl(normalized);
            return resolved || normalized || noImage;
        } catch {
            return normalized || noImage;
        }
    }, [product]);

    // === Agregar al carrito (server-first) ===
   const handleAddToCart = async () => {
  if (!product) return;

  const id = product._id || product.id || null;
  const ref = product.slug || product.id || id;

  try {
    await CartAPI.add({ productId: id, productRef: ref, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  } catch (e) {
    const status = e?.response?.status;
    if (status === 401 || status === 403) {
      const next = encodeURIComponent(`${routerLocation.pathname}${routerLocation.search || ""}`);
      return navigate(`/login?next=${next}`);
    }
    alert(e?.response?.data?.error || "No se pudo guardar en tu carrito");
  }
};

    // === Enviar/actualizar RESEÑA de PRODUCTO (1 por comprador) ===
    const handleSubmitReview = async () => {
        if (!user || user.userType !== "buyer" || !product || userRating === 0) return;
        try {
            const pid = product._id || product.id;
            await ReviewsAPI.upsertProduct({ productId: pid, rating: userRating, comment: reviewComment }, authToken);
            await load();
            setShowReviewForm(false);
            alert("¡Reseña del producto guardada!");
        } catch (error) {
            console.error("Error al guardar reseña:", error);
            alert(error?.response?.data?.error || "Error al enviar la reseña");
        }
    };

    // === Enviar/actualizar RESEÑA de TIENDA (1 por comprador) ===
    const handleSubmitStoreReview = async () => {
        if (!user || user.userType !== "buyer" || !sellerInfo || storeUserRating === 0) return;
        try {
            await ReviewsAPI.upsertStore(
                { vendorId: sellerInfo.id, rating: storeUserRating, comment: storeReviewComment },
                authToken
            );
            await load();
            setShowStoreReviewForm(false);
            alert("¡Reseña de la tienda guardada!");
        } catch (error) {
            console.error("Error al guardar reseña tienda:", error);
            alert(error?.response?.data?.error || "Error al enviar la reseña");
        }
    };

    // En esta versión ya NO se usa localStorage para reseñas
    const mergedReviews = productReviews;

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
                <span className="current">{product.title}</span>
            </nav>

            <div className="product-detail">
                {/* Imagen del producto */}
                <div className="product-image-section">
                    <div className="product-image-main">
                        <img
                            className="product-image-sim large"
                            src={imgSrc}
                            alt={product.title}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
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
                            {productReviews.length ? ` (${productReviews.length} reseñas)` : ""}
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
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="quantity-btn">
                                    <i className="fa fa-minus" />
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="quantity-btn">
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
                            <button className="btn-review-product" onClick={() => setShowReviewForm(true)}>
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
                                {sellerInfo.role && <p className="seller-category">{String(sellerInfo.role).toUpperCase()}</p>}
                            </div>
                        </div>

                        <div className="seller-actions">
                            {/* Mantengo tu botón original */}
                            <Link to={`/seller-profile/${sellerInfo.id || product.vendorId}`} className="btn-view-store">
                                <i className="fa fa-eye" /> Ver Tienda Completa
                            </Link>

                            {/* Botón para evaluar TIENDA */}
                            {user && user.userType === "buyer" && isObjectId(sellerInfo.id) && (
                                <button onClick={() => setShowStoreReviewForm(true)} className="btn-review-product" style={{ marginLeft: 8 }}>
                                    <i className="fa fa-star" /> Evaluar Tienda
                                </button>
                            )}
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
                                        <span>{review.userId?.name || "Usuario"}</span>
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

            {/* Reseñas de la Tienda */}
            {sellerInfo && (
                <div className="product-reviews-section">
                    <h2>🏪 Reseñas de la Tienda</h2>
                    {storeReviews.length > 0 ? (
                        <div className="reviews-list">
                            {storeReviews.slice(0, 10).map((review) => (
                                <div key={review._id} className="review-item">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            {review.userId?.avatar ? (
                                                <img src={review.userId.avatar} alt={review.userId?.name} className="review-avatar" />
                                            ) : (
                                                <i className="fa fa-user-circle" />
                                            )}
                                            <span>{review.userId?.name || "Usuario"}</span>
                                        </div>
                                        <div className="review-rating">{renderStars(review.rating || 0)}</div>
                                    </div>
                                    <div className="review-date">{new Date(review.createdAt).toLocaleDateString("es-CR")}</div>
                                    {review.comment && <div className="review-comment">{review.comment}</div>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-reviews">Aún no hay reseñas para esta tienda.</p>
                    )}
                </div>
            )}

            {/* Botón de regreso */}
            <div className="navigation-actions">
                <Link to="/shop" className="btn-back">
                    <i className="fa fa-arrow-left" /> Volver a la tienda
                </Link>
            </div>

            {/* Modal para evaluar producto */}
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

            {/* Modal para evaluar TIENDA */}
            {showStoreReviewForm && (
                <div className="modal-overlay" onClick={() => setShowStoreReviewForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Evaluar Tienda</h2>
                            <button onClick={() => setShowStoreReviewForm(false)} className="modal-close">
                                <i className="fa fa-times" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rating-section">
                                <label>Calificación de la tienda:</label>
                                {renderStars(storeUserRating, true, setStoreUserRating)}
                            </div>
                            <div className="comment-section">
                                <label>Comentario (opcional):</label>
                                <textarea
                                    value={storeReviewComment}
                                    onChange={(e) => setStoreReviewComment(e.target.value)}
                                    placeholder="¿Cómo fue tu experiencia con la tienda?"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowStoreReviewForm(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={handleSubmitStoreReview} className="btn-submit" disabled={storeUserRating === 0}>
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
