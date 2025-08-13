import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

export const AutoRedirect = ({ children }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated, getDashboardRoute } = useAuth();

    useEffect(() => {
        // Si el usuario está autenticado y está en la página de inicio
        // redirigir automáticamente a su dashboard
        if (isAuthenticated() && window.location.pathname === '/') {
            const dashboardRoute = getDashboardRoute();
            navigate(dashboardRoute);
        }
    }, [user, isAuthenticated, getDashboardRoute, navigate]);

    return children;
};