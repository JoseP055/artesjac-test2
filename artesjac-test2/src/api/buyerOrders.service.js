// src/api/buyerOrders.service.js
import { api } from "../api";

export const BuyerOrdersAPI = {
    list: () => api.get("/buyer-orders"),
    getById: (id) => api.get(`/buyer-orders/${id}`),
    devSeed: () => api.post("/buyer-orders/dev-seed"),
};
