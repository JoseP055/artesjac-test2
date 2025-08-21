// src/api/reviews.service.js
import { api } from "../api";

export const ReviewsAPI = {
    // Product reviews
    listProduct: (productId, params = {}) => api.get("/reviews/products", { params: { product: productId, ...params } }),
    upsertProduct: ({ productId, rating, comment }, token) =>
        api.post("/reviews/products", { productId, rating, comment }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),

    // Store reviews
    listStore: (vendorId, params = {}) => api.get("/reviews/stores", { params: { vendor: vendorId, ...params } }),
    upsertStore: ({ vendorId, rating, comment }, token) =>
        api.post("/reviews/stores", { vendorId, rating, comment }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};
