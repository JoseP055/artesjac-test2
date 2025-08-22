import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

export const ProtectedRoute = ({ children, userType, redirectTo = '/login' }) => {
    const { isLoading, isAuthenticated, isBuyer, isSeller } = useAuth();
    const location = useLocation();

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

    // Si no está autenticado, redirigir al login (guardando desde dónde venía)
    if (!isAuthenticated()) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    // Si se especifica un tipo de usuario, verificar permisos
    if (userType) {
        const hasPermission =
            // ✅ buyer: permitir cualquier usuario autenticado (no restringe por rol)
            (userType === 'buyer') ||
            // seller: sí exige ser vendedor/admin según tus helpers actuales
            (userType === 'seller' && isSeller && isSeller()) ||
            // any: cualquier autenticado
            (userType === 'any');

        if (!hasPermission) {
            // Redirigir al dashboard apropiado según su tipo de usuario
            const appropriateDashboard = (isSeller && isSeller()) ? '/seller/dashboard' : '/buyer/dashboard';
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
