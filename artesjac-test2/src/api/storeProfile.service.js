// src/api/storeProfile.service.js
import { api } from "../api";

export const StoreProfileAPI = {
    getMe: async () => {
        const res = await api.get("/store-profile/me");
        return res.data; // { ok, data }
    },
    updateMe: async (payload) => {
        const res = await api.put("/store-profile/me", payload);
        return res.data; // { ok, data }
    },
    // Público (para SellerProfile público):
    getPublic: async (sellerId) => {
        const res = await api.get(`/store-profile/public/${sellerId}`);
        return res.data; // { ok, data }
    },
};
