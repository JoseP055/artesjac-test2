import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/product.css';

export const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [sellerInfo, setSellerInfo] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [productReviews, setProductReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Mock data de productos actualizado con información del vendedor
    const products = [
        {
            id: 1,
            name: 'Collar artesanal de semillas',
            price: '₡12.000',
            numericPrice: 12000,
            category: 'joyeria',
            description: 'Hermoso collar hecho a mano con semillas naturales de Costa Rica. Una pieza única que refleja la tradición artesanal costarricense.',
            sellerId: 'seller_001',
            sellerName: 'Artesanías María José',
            sellerRating: 4.8,
            sellerReviews: 45
        },
        {
            id: 2,
            name: 'Bolso tejido a mano',
            price: '₡18.500',
            numericPrice: 18500,
            category: 'textil',
            description: 'Bolso artesanal tejido con técnicas tradicionales, perfecto para el uso diario y con un toque de elegancia costarricense.',
            sellerId: 'seller_002',
            sellerName: 'Tejidos Doña Carmen',
            sellerRating: 4.6,
            sellerReviews: 32
        },
        {
            id: 3,
            name: 'Cuadro colorido abstracto',
            price: '₡22.000',
            numericPrice: 22000,
            category: 'pintura',
            description: 'Obra de arte original que captura los colores vibrantes de Costa Rica en un estilo abstracto contemporáneo.',
            sellerId: 'seller_003',
            sellerName: 'Arte y Color CR',
            sellerRating: 4.9,
            sellerReviews: 67
        },
        {
            id: 4,
            name: 'Vasija de cerámica tradicional',
            price: '₡15.800',
            numericPrice: 15800,
            category: 'ceramica',
            description: 'Vasija decorativa elaborada con técnicas de cerámica tradicional, ideal para decorar cualquier espacio del hogar.',
            sellerId: 'seller_004',
            sellerName: 'Cerámica Los Abuelos',
            sellerRating: 4.7,
            sellerReviews: 28
        },
        {
            id: 5,
            name: 'Aretes de madera tallada',
            price: '₡8.500',
            numericPrice: 8500,
            category: 'joyeria',
            description: 'Elegantes aretes tallados en madera nacional, ligeros y cómodos para uso diario.',
            sellerId: 'seller_001',
            sellerName: 'Artesanías María José',
            sellerRating: 4.8,
            sellerReviews: 45
        },
        // ... resto de productos con información del vendedor
    ];

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        setProduct(foundProduct);

        if (foundProduct) {
            loadSellerInfo(foundProduct.sellerId);
            loadProductReviews(foundProduct.id);
        }
    }, [id]);

    const loadSellerInfo = (sellerId) => {
        try {
            // Intentar cargar información completa del vendedor
            const storeData = localStorage.getItem(`store_profile_${sellerId}`);
            if (storeData) {
                const parsed = JSON.parse(storeData);
                setSellerInfo({
                    id: sellerId,
                    businessName: parsed.businessName,
                    description: parsed.description,
                    contact: parsed.contact,
                    location: parsed.location,
                    category: parsed.businessInfo?.category,
                    foundedYear: parsed.businessInfo?.foundedYear
                });
            } else {
                // Información básica del mock
                const mockProduct = products.find(p => p.id === parseInt(id));
                if (mockProduct) {
                    setSellerInfo({
                        id: sellerId,
                        businessName: mockProduct.sellerName,
                        rating: mockProduct.sellerRating,
                        totalReviews: mockProduct.sellerReviews,
                        description: 'Tienda especializada en productos artesanales de alta calidad.',
                        contact: { email: 'contacto@tienda.com' },
                        location: { city: 'San José', province: 'San José' }
                    });
                }
            }
        } catch (error) {
            console.error('Error al cargar información del vendedor:', error);
        }
    };

    const loadProductReviews = (productId) => {
        try {
            const savedReviews = localStorage.getItem(`product_reviews_${productId}`);
            if (savedReviews) {
                const parsed = JSON.parse(savedReviews);
                setProductReviews(parsed);
                calculateAverageRating(parsed);
            } else {
                // Generar algunas reseñas de ejemplo
                const mockReviews = [
                    {
                        id: 1,
                        userId: 'user_001',
                        userName: 'Ana González',
                        rating: 5,
                        comment: 'Excelente calidad, muy bien hecho. Recomendado 100%',
                        date: '2024-01-10T10:00:00Z'
                    },
                    {
                        id: 2,
                        userId: 'user_002',
                        userName: 'Carlos Ruiz',
                        rating: 4,
                        comment: 'Muy bonito producto, llegó en perfecto estado.',
                        date: '2024-01-08T15:30:00Z'
                    }
                ];
                setProductReviews(mockReviews);
                calculateAverageRating(mockReviews);
            }
        } catch (error) {
            console.error('Error al cargar reseñas del producto:', error);
        }
    };

    const calculateAverageRating = (reviewsList) => {
        if (reviewsList.length === 0) {
            setAverageRating(0);
            return;
        }

        const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / reviewsList.length;
        setAverageRating(average);
    };

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

    const handleSubmitReview = () => {
        if (!user || userRating === 0) return;

        const newReview = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            rating: userRating,
            comment: reviewComment,
            date: new Date().toISOString()
        };

        try {
            const existingReviews = productReviews.filter(r => r.userId !== user.id);
            const updatedReviews = [...existingReviews, newReview];

            localStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(updatedReviews));
            setProductReviews(updatedReviews);
            calculateAverageRating(updatedReviews);

            setUserRating(0);
            setReviewComment('');
            setShowReviewForm(false);

            alert('¡Reseña del producto enviada exitosamente!');
        } catch (error) {
            console.error('Error al guardar reseña:', error);
            alert('Error al enviar la reseña');
        }
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return (
            <div className={`stars ${interactive ? 'interactive' : ''}`}>
                {[1, 2, 3, 4, 5].map(star => (
                    <i
                        key={star}
                        className={`fa fa-star ${star <= rating ? 'active' : ''}`}
                        onClick={interactive ? () => onStarClick(star) : undefined}
                    ></i>
                ))}
            </div>
        );
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

                    {/* Rating del producto */}
                    <div className="product-rating">
                        {renderStars(averageRating)}
                        <span className="rating-text">
                            {averageRating > 0 ? averageRating.toFixed(1) : 'Sin calificar'}
                            ({productReviews.length} reseñas)
                        </span>
                    </div>

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

                        {/* Botón para evaluar producto */}
                        {user && user.userType === 'buyer' && (
                            <button
                                className="btn-review-product"
                                onClick={() => setShowReviewForm(true)}
                            >
                                <i className="fa fa-star"></i> Evaluar Producto
                            </button>
                        )}
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

            {/* Información del Vendedor */}
            {sellerInfo && (
                <div className="seller-info-section">
                    <h2>🏪 Información del Vendedor</h2>
                    <div className="seller-card">
                        <div className="seller-header">
                            <div className="seller-avatar">
                                <i className="fa fa-store"></i>
                            </div>
                            <div className="seller-details">
                                <h3>{sellerInfo.businessName}</h3>
                                {sellerInfo.category && (
                                    <p className="seller-category">{sellerInfo.category}</p>
                                )}
                                {sellerInfo.rating && (
                                    <div className="seller-rating">
                                        {renderStars(sellerInfo.rating)}
                                        <span>({sellerInfo.totalReviews} reseñas)</span>
                                    </div>
                                )}
                                {sellerInfo.location && (
                                    <p className="seller-location">
                                        <i className="fa fa-map-marker-alt"></i>
                                        {sellerInfo.location.city}, {sellerInfo.location.province}
                                    </p>
                                )}
                            </div>
                        </div>

                        {sellerInfo.description && (
                            <div className="seller-description">
                                <p>{sellerInfo.description}</p>
                            </div>
                        )}

                        <div className="seller-actions">
                            <Link
                                to={`/seller-profile/${sellerInfo.id}`}
                                className="btn-view-store"
                            >
                                <i className="fa fa-eye"></i>
                                Ver Tienda Completa
                            </Link>
                            {sellerInfo.contact?.email && (
                                <a
                                    href={`mailto:${sellerInfo.contact.email}`}
                                    className="btn-contact-seller"
                                >
                                    <i className="fa fa-envelope"></i>
                                    Contactar
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reseñas del Producto */}
            <div className="product-reviews-section">
                <h2>⭐ Reseñas del Producto</h2>
                {productReviews.length > 0 ? (
                    <div className="reviews-list">
                        {productReviews.slice(0, 5).map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <i className="fa fa-user-circle"></i>
                                        <span>{review.userName}</span>
                                    </div>
                                    <div className="review-rating">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <div className="review-date">
                                    {new Date(review.date).toLocaleDateString('es-CR')}
                                </div>
                                {review.comment && (
                                    <div className="review-comment">
                                        {review.comment}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-reviews">Aún no hay reseñas para este producto. ¡Sé el primero en evaluar!</p>
                )}
            </div>

            {/* Botón de regreso */}
            <div className="navigation-actions">
                <Link to="/shop" className="btn-back">
                    <i className="fa fa-arrow-left"></i> Volver a la tienda
                </Link>
            </div>

            {/* Modal para evaluar producto */}
            {showReviewForm && (
                <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Evaluar Producto</h2>
                            <button onClick={() => setShowReviewForm(false)} className="modal-close">
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rating-section">
                                <label>Calificación del producto:</label>
                                {renderStars(userRating, true, setUserRating)}
                            </div>
                            <div className="comment-section">
                                <label>Comentario sobre el producto (opcional):</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Cuéntanos sobre tu experiencia con este producto..."
                                    rows="4"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowReviewForm(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="btn-submit"
                                disabled={userRating === 0}
                            >
                                Enviar Reseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};