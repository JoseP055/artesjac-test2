// src/api/products.service.js
import { api } from "../api";

export const ProductsAPI = {
  mine: (params = {}) => api.get("/products/me", { params }),
  get: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
  listByVendor: (vendorId, params = {}) => api.get(`/products/by-vendor/${vendorId}`, { params }),
};
