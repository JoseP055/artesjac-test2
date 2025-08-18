import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/seller-profile.css';

export const SellerProfile = () => {
    const { sellerId } = useParams();
    const { user } = useAuth();
    const [sellerData, setSellerData] = useState(null);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    const reportReasons = [
        'Contenido inapropiado',
        'Productos falsificados',
        'Precios fraudulentos',
        'Información falsa',
        'Spam o publicidad no deseada',
        'Violación de términos de servicio',
        'Otro'
    ];

    useEffect(() => {
        loadSellerData();
        loadSellerProducts();
        loadReviews();
        checkIfDisabled();
    }, [sellerId]);

    const loadSellerData = () => {
        try {
            // Cargar datos públicos del vendedor
            const storeData = localStorage.getItem(`store_profile_${sellerId}`);
            if (storeData) {
                const parsed = JSON.parse(storeData);
                setSellerData(parsed);
            } else {
                // Datos de ejemplo si no existe
                setSellerData({
                    businessName: 'Artesanías Ejemplo',
                    description: 'Tienda de artesanías tradicionales costarricenses',
                    businessInfo: {
                        category: 'Artesanías Tradicionales',
                        foundedYear: '2020',
                        specialties: ['Joyería', 'Textiles']
                    },
                    contact: {
                        email: 'ejemplo@email.com',
                        phone: '+506 8888-8888'
                    },
                    location: {
                        address: 'San José, Costa Rica',
                        city: 'San José',
                        province: 'San José'
                    },
                    socialMedia: {
                        facebook: '',
                        instagram: ''
                    }
                });
            }
        } catch (error) {
            console.error('Error al cargar datos del vendedor:', error);
        }
        setIsLoading(false);
    };

    const loadSellerProducts = () => {
        try {
            const products = localStorage.getItem(`products_${sellerId}`);
            if (products) {
                const parsed = JSON.parse(products);
                setSellerProducts(parsed.filter(p => p.status === 'active').slice(0, 6));
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const loadReviews = () => {
        try {
            const savedReviews = localStorage.getItem(`seller_reviews_${sellerId}`);
            if (savedReviews) {
                const parsed = JSON.parse(savedReviews);
                setReviews(parsed);
                calculateAverageRating(parsed);
            }
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
        }
    };

    const calculateAverageRating = (reviewsList) => {
        if (reviewsList.length === 0) {
            setAverageRating(0);
            setTotalReviews(0);
            return;
        }

        const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / reviewsList.length;
        setAverageRating(average);
        setTotalReviews(reviewsList.length);
    };

    const checkIfDisabled = () => {
        try {
            const reports = localStorage.getItem(`seller_reports_${sellerId}`);
            if (reports) {
                const parsed = JSON.parse(reports);
                setIsDisabled(parsed.length >= 10);
            }
        } catch (error) {
            console.error('Error al verificar reportes:', error);
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
            const existingReviews = reviews.filter(r => r.userId !== user.id);
            const updatedReviews = [...existingReviews, newReview];

            localStorage.setItem(`seller_reviews_${sellerId}`, JSON.stringify(updatedReviews));
            setReviews(updatedReviews);
            calculateAverageRating(updatedReviews);

            setUserRating(0);
            setReviewComment('');
            setShowReviewForm(false);

            alert('¡Reseña enviada exitosamente!');
        } catch (error) {
            console.error('Error al guardar reseña:', error);
            alert('Error al enviar la reseña');
        }
    };

    const handleSubmitReport = () => {
        if (!user || !reportReason) return;

        const newReport = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            reason: reportReason,
            details: reportDetails,
            date: new Date().toISOString()
        };

        try {
            const existingReports = JSON.parse(localStorage.getItem(`seller_reports_${sellerId}`) || '[]');
            const updatedReports = [...existingReports, newReport];

            localStorage.setItem(`seller_reports_${sellerId}`, JSON.stringify(updatedReports));

            if (updatedReports.length >= 10) {
                setIsDisabled(true);
                alert('Esta tienda ha sido deshabilitada por múltiples reportes y está siendo revisada.');
            } else {
                alert('Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.');
            }

            setReportReason('');
            setReportDetails('');
            setShowReportForm(false);
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            alert('Error al enviar el reporte');
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

    if (isLoading) {
        return (
            <div className="seller-profile-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando perfil de la tienda...</p>
                </div>
            </div>
        );
    }

    if (isDisabled) {
        return (
            <div className="seller-profile-container">
                <div className="disabled-store">
                    <i className="fa fa-exclamation-triangle"></i>
                    <h2>Tienda Temporalmente Deshabilitada</h2>
                    <p>Esta tienda está siendo revisada por nuestro equipo de moderación.</p>
                    <Link to="/shop" className="btn-back-shop">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    if (!sellerData) {
        return (
            <div className="seller-profile-container">
                <div className="store-not-found">
                    <h2>Tienda no encontrada</h2>
                    <p>No se pudo encontrar la información de esta tienda.</p>
                    <Link to="/shop" className="btn-back-shop">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="seller-profile-container">
            {/* Header de la tienda */}
            <div className="store-header">
                <div className="store-banner">
                    <div className="store-logo">
                        <i className="fa fa-store"></i>
                    </div>
                    <div className="store-main-info">
                        <h1>{sellerData.businessName}</h1>
                        <p className="store-category">{sellerData.businessInfo?.category}</p>
                        <div className="store-rating">
                            {renderStars(averageRating)}
                            <span className="rating-text">
                                {averageRating.toFixed(1)} ({totalReviews} reseñas)
                            </span>
                        </div>
                    </div>
                    <div className="store-actions">
                        {user && user.userType === 'buyer' && (
                            <>
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="btn-review"
                                >
                                    <i className="fa fa-star"></i>
                                    Evaluar Tienda
                                </button>
                                <button
                                    onClick={() => setShowReportForm(true)}
                                    className="btn-report"
                                >
                                    <i className="fa fa-flag"></i>
                                    Reportar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Información de la tienda */}
            <div className="store-content">
                <div className="store-info-section">
                    <div className="store-description">
                        <h2>📖 Acerca de Nosotros</h2>
                        <p>{sellerData.description || 'No hay descripción disponible.'}</p>

                        {sellerData.businessInfo?.specialties?.length > 0 && (
                            <div className="specialties">
                                <h3>Especialidades:</h3>
                                <div className="specialty-tags">
                                    {sellerData.businessInfo.specialties.map(specialty => (
                                        <span key={specialty} className="specialty-tag">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="store-details">
                        <h2>📞 Información de Contacto</h2>
                        <div className="contact-info">
                            {sellerData.contact?.email && (
                                <div className="contact-item">
                                    <i className="fa fa-envelope"></i>
                                    <span>{sellerData.contact.email}</span>
                                </div>
                            )}
                            {sellerData.contact?.phone && (
                                <div className="contact-item">
                                    <i className="fa fa-phone"></i>
                                    <span>{sellerData.contact.phone}</span>
                                </div>
                            )}
                            {sellerData.location?.address && (
                                <div className="contact-item">
                                    <i className="fa fa-map-marker-alt"></i>
                                    <span>{sellerData.location.address}</span>
                                </div>
                            )}
                            {sellerData.businessInfo?.foundedYear && (
                                <div className="contact-item">
                                    <i className="fa fa-calendar"></i>
                                    <span>Desde {sellerData.businessInfo.foundedYear}</span>
                                </div>
                            )}
                        </div>

                        {/* Redes sociales */}
                        <div className="social-media">
                            {sellerData.socialMedia?.facebook && (
                                <a href={sellerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook"></i>
                                </a>
                            )}
                            {sellerData.socialMedia?.instagram && (
                                <a href={sellerData.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            )}
                            {sellerData.socialMedia?.twitter && (
                                <a href={sellerData.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Productos de la tienda */}
                {sellerProducts.length > 0 && (
                    <div className="store-products-section">
                        <h2>🛍️ Productos de esta Tienda</h2>
                        <div className="products-grid">
                            {sellerProducts.map(product => (
                                <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                                    <div className="product-image">
                                        <div className="product-image-sim"></div>
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="product-price">₡{product.price?.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reseñas */}
                <div className="store-reviews-section">
                    <h2>⭐ Reseñas de Clientes</h2>
                    {reviews.length > 0 ? (
                        <div className="reviews-list">
                            {reviews.slice(0, 5).map(review => (
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
                        <p className="no-reviews">Aún no hay reseñas para esta tienda.</p>
                    )}
                </div>
            </div>

            {/* Modal para evaluar tienda */}
            {showReviewForm && (
                <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Evaluar Tienda</h2>
                            <button onClick={() => setShowReviewForm(false)} className="modal-close">
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="rating-section">
                                <label>Calificación:</label>
                                {renderStars(userRating, true, setUserRating)}
                            </div>
                            <div className="comment-section">
                                <label>Comentario (opcional):</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Comparte tu experiencia con esta tienda..."
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

            {/* Modal para reportar tienda */}
            {showReportForm && (
                <div className="modal-overlay" onClick={() => setShowReportForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Reportar Tienda</h2>
                            <button onClick={() => setShowReportForm(false)} className="modal-close">
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Motivo del reporte:</label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                >
                                    <option value="">Selecciona un motivo</option>
                                    {reportReasons.map(reason => (
                                        <option key={reason} value={reason}>{reason}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Detalles adicionales:</label>
                                <textarea
                                    value={reportDetails}
                                    onChange={(e) => setReportDetails(e.target.value)}
                                    placeholder="Proporciona más detalles sobre el problema..."
                                    rows="4"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowReportForm(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                className="btn-submit"
                                disabled={!reportReason}
                            >
                                Enviar Reporte
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};