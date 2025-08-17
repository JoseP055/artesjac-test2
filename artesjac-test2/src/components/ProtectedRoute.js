import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

export const ProtectedRoute = ({ children, userType, redirectTo = '/login' }) => {
    const { isLoading, isAuthenticated, isBuyer, isSeller } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                backgroundColor: '#121212',
                color: '#fff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                    <p>Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }

    // Si se especifica un tipo de usuario, verificar permisos
    if (userType) {
        const hasPermission = 
            (userType === 'buyer' && isBuyer()) ||
            (userType === 'seller' && isSeller()) ||
            (userType === 'any'); // Para rutas que acepta cualquier usuario autenticado

        if (!hasPermission) {
            // Redirigir al dashboard apropiado según su tipo de usuario
            const appropriateDashboard = isBuyer() ? '/buyer/dashboard' : '/seller/dashboard';
            return <Navigate to={appropriateDashboard} replace />;
        }
    }

    // Si todo está bien, mostrar el componente
    return children;
};

// Componente específico para rutas de compradores
export const BuyerRoute = ({ children }) => {
    return (
        <ProtectedRoute userType="buyer">
            {children}
        </ProtectedRoute>
    );
};

// Componente específico para rutas de vendedores
export const SellerRoute = ({ children }) => {
    return (
        <ProtectedRoute userType="seller">
            {children}
        </ProtectedRoute>
    );
};

// Componente para rutas que acepta cualquier usuario autenticado
export const AuthenticatedRoute = ({ children }) => {
    return (
        <ProtectedRoute userType="any">
            {children}
        </ProtectedRoute>
    );
};