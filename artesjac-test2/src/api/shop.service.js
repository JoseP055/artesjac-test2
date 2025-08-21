// src/api/shop.service.js
import { api } from "../api";

/** Endpoints públicos de TIENDA (formato axios-like) */
export const ShopAPI = {
    list: (params = {}) => api.get("/shop/products", { params }),
    get: (slugOrId) => api.get(`/shop/products/${slugOrId}`),
    detail: (slug) => api.get(`/shop/products/${slug}`),

    reviews: (productId, params = {}) =>
        api.get(`/shop/reviews`, { params: { product: productId, ...params } }),

    // 🔒 Crear/actualizar reseña (1 por comprador)
    // Pasá el token si tu axios no lo inyecta automáticamente
    createReview: ({ productId, rating, comment }, token) =>
        api.post(
            `/shop/reviews`,
            { productId, rating, comment },
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        ),
};
