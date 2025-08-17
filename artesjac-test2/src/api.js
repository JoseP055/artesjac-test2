// src/api.js
import axios from "axios";

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
});

// Adjuntar token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("artesjac-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
