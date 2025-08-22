// src/api/orders.service.js
import { api } from '../api';

export const OrdersAPI = {
    // Lista pedidos del vendedor desde ListaDePedidos
    list: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.q) queryParams.append('q', params.q);
        if (params.sort) queryParams.append('sort', params.sort);

        console.log('🔄 OrdersAPI.list llamando a:', `/seller-orders?${queryParams.toString()}`);
        const response = await api.get(`/seller-orders?${queryParams.toString()}`);
        console.log('📦 OrdersAPI.list respuesta:', response.data);
        return response.data;
    },

    // Obtener estadísticas
    getStats: async () => {
        console.log('🔄 OrdersAPI.getStats llamando a:', '/seller-orders/stats');
        const response = await api.get('/seller-orders/stats');
        console.log('📊 OrdersAPI.getStats respuesta:', response.data);
        return response.data;
    },

    // Actualizar estado de pedido
    updateStatus: async (orderId, status, trackingNumber = null) => {
        const payload = { status };
        if (trackingNumber) payload.trackingNumber = trackingNumber;

        console.log('🔄 OrdersAPI.updateStatus llamando a:', `/seller-orders/${orderId}/status`, payload);
        const response = await api.put(`/seller-orders/${orderId}/status`, payload);
        console.log('✅ OrdersAPI.updateStatus respuesta:', response.data);
        return response.data;
    },

    // Obtener detalles de un pedido específico
    getDetails: async (orderId) => {
        console.log('🔄 OrdersAPI.getDetails llamando a:', `/seller-orders/${orderId}`);
        const response = await api.get(`/seller-orders/${orderId}`);
        console.log('📋 OrdersAPI.getDetails respuesta:', response.data);
        return response.data;
    }
};