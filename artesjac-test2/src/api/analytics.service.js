// src/api/analytics.service.js
import { api } from "../api";

export const AnalyticsAPI = {
    getSeller: async (period = "6months") => {
        const res = await api.get("/analytics/seller", { params: { period } });
        return res.data; // { ok, data, period, range }
    },
};
