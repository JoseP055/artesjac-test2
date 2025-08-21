// src/api/shop.service.js
import { api } from "../api";

export const ShopAPI = {
    list: (params = {}) => api.get("/shop/products", { params }),        // GET /api/shop/products
    get: (slugOrId) => api.get(`/shop/products/${slugOrId}`),            // GET /api/shop/products/:slugOrId
};