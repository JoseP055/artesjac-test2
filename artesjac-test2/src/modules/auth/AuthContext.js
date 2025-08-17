// modules/auth/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mapea role del backend -> userType del front
    const mapRoleToUserType = (role) => {
        if (!role) return null;
        const r = String(role).toUpperCase();
        if (r === "SELLER" || r === "ADMIN") return "seller";
        return "buyer";
    };

    // Al iniciar, si hay token, pedir /auth/me
    useEffect(() => {
        const token = localStorage.getItem('artesjac-token');
        const savedUser = localStorage.getItem('artesjac-user');

        if (!token) {
            // Caso legado: si había usuario "simulado" lo limpiamos para evitar choques
            if (savedUser) localStorage.removeItem('artesjac-user');
            setIsLoading(false);
            return;
        }

        // Autologin con token
        api.get('/auth/me')
            .then(({ data }) => {
                if (data?.ok && data?.user) {
                    const normalized = {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        role: data.user.role,                 // p.ej. "USER" | "SELLER" | "ADMIN"
                        userType: mapRoleToUserType(data.user.role), // "buyer" | "seller"
                        businessName: data.user.businessName || null
                    };
                    localStorage.setItem('artesjac-user', JSON.stringify(normalized));
                    setUser(normalized);
                } else {
                    logout();
                }
            })
            .catch(() => logout())
            .finally(() => setIsLoading(false));
    }, []);

    // --- API: LOGIN ---
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (!data?.ok) return { ok: false, error: data?.error || 'Error en login' };

            // Guardar token y usuario
            localStorage.setItem('artesjac-token', data.token);
            const normalized = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                userType: mapRoleToUserType(data.user.role),
                businessName: data.user.businessName || null
            };
            localStorage.setItem('artesjac-user', JSON.stringify(normalized));
            setUser(normalized);
            return { ok: true, user: normalized };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || 'Error en login' };
        }
    };

    // --- API: REGISTER ---
    const register = async ({ name, email, password, userType, businessName, phone, address }) => {
        try {
            // Si tu backend espera "role": usamos el userType elegido
            const role = userType === 'seller' ? 'SELLER' : 'USER';
            const payload = { name, email, password, role, businessName, phone, address };
            const { data } = await api.post('/auth/register', payload);
            if (!data?.ok) return { ok: false, error: data?.error || 'Registro inválido' };

            // Opcional: login automático
            return await login(email, password);
        } catch (err) {
            return { ok: false, error: err?.response?.data?.error || 'Registro inválido' };
        }
    };

    // --- LOGOUT ---
    const logout = () => {
        localStorage.removeItem('artesjac-user');
        localStorage.removeItem('artesjac-cart');
        localStorage.removeItem('artesjac-token');
        setUser(null);
    };

    // --- UPDATE USER (local) ---
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        localStorage.setItem('artesjac-user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    // Helpers para tus rutas protegidas
    const isAuthenticated = () => user !== null;
    const isBuyer = () => user?.userType === 'buyer';
    const isSeller = () => user?.userType === 'seller';

    // Ruta según tipo
    const getDashboardRoute = () => {
        if (!user) return '/';
        return isSeller() ? '/seller/dashboard' : '/buyer/dashboard';
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        register,
        updateUser,
        isAuthenticated,
        isBuyer,
        isSeller,
        getDashboardRoute
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe ser usado dentro de AuthProvider');
    return context;
};
