import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem('artesjac-user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                localStorage.removeItem('artesjac-user');
            }
        }
        setIsLoading(false);
    }, []);

    // Función de login
    const login = (userData) => {
        const userWithTimestamp = {
            ...userData,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('artesjac-user', JSON.stringify(userWithTimestamp));
        setUser(userWithTimestamp);
        return userWithTimestamp;
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('artesjac-user');
        localStorage.removeItem('artesjac-cart'); // Limpiar carrito al logout
        setUser(null);
    };

    // Función para actualizar datos del usuario
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        localStorage.setItem('artesjac-user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    // Verificar si el usuario está autenticado
    const isAuthenticated = () => {
        return user !== null;
    };

    // Verificar si es comprador
    const isBuyer = () => {
        return user?.userType === 'buyer';
    };

    // Verificar si es vendedor
    const isSeller = () => {
        return user?.userType === 'seller';
    };

    // Obtener ruta de dashboard según tipo de usuario
    const getDashboardRoute = () => {
        if (!user) return '/';
        return user.userType === 'seller' ? '/seller/dashboard' : '/buyer/dashboard';
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isBuyer,
        isSeller,
        getDashboardRoute
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};