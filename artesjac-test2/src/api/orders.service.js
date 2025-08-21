// src/api/orders.service.js
import { api } from "../api";

export const OrdersAPI = {
    list: async (params = {}) => {
        const res = await api.get("/orders", { params });
        return res.data; // { ok, data, total, page, limit }
    },
    get: async (id) => {
        const res = await api.get(`/orders/${id}`);
        return res.data; // { ok, data }
    },
    updateStatus: async (id, status, trackingNumber) => {
        const res = await api.patch(`/orders/${id}/status`, { status, trackingNumber });
        return res.data; // { ok, data }
    },
    // Opcional: seed para pruebas
    seedDev: async () => {
        const res = await api.post("/orders/dev/seed");
        return res.data;
    },
};
