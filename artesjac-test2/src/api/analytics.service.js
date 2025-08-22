// src/api/analytics.service.js
import { api } from '../api';

export const AnalyticsAPI = {
    // Obtener analytics del vendedor
    getSeller: async (period = '6months') => {
        const response = await api.get(`/seller-analytics?period=${period}`);
        return response.data;
    }
};