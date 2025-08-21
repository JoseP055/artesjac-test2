// src/api/buyer.service.js
import { api } from "../api";

export const BuyerAPI = {
    getDashboard: async () => {
        const res = await api.get("/buyer/dashboard");
        return res.data; // { ok, data: { stats, recentOrders, recommendedProducts } }
    },
};
