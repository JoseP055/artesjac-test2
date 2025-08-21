// src/api/cart.service.js
import { api } from "../api";

export const CartAPI = {
    
    mine: (token) => api.get("/cart", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
    add: ({ productId, productRef, quantity }, token) =>
        api.post("/cart/items", { productId, productRef, quantity }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
    update: (payload, token) => api.put("/cart/items", payload, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
    remove: (productId, token) => api.delete(`/cart/items/${productId}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
    clear: (token) => api.delete("/cart", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
};
