// src/api/profile.service.js
import { api } from "../api";

export const ProfileAPI = {
    getMe: () => api.get("/profile/me").then((r) => r.data),
    updateMe: (payload) => api.put("/profile/me", payload).then((r) => r.data),
    changePassword: (payload) => api.post("/profile/change-password", payload).then((r) => r.data),

    listOrders: (limit = 10) => api.get(`/profile/orders?limit=${limit}`).then((r) => r.data),

    listAddresses: () => api.get("/profile/addresses").then((r) => r.data),
    createAddress: (payload) => api.post("/profile/addresses", payload).then((r) => r.data),
    updateAddress: (id, payload) => api.put(`/profile/addresses/${id}`, payload).then((r) => r.data),
    deleteAddress: (id) => api.delete(`/profile/addresses/${id}`).then((r) => r.data),
};
