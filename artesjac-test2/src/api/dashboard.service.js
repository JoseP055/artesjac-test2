// src/api/dashboard.service.js
import { api } from "../api";

export const DashboardAPI = {
    getSeller: async () => {
        const res = await api.get("/dashboard/seller");
        return res.data; // { ok, data }
    },
};
