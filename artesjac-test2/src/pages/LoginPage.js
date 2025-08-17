// pages/LoginPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/variables.css';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, getDashboardRoute } = useAuth();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
            setLoading(false);
            return;
        }

        const res = await login(email, password);
        setLoading(false);

        if (!res.ok) {
            setError(res.error || 'Correo o contraseña incorrectos.');
            return;
        }

        // Redirigir según tipo (usa getDashboardRoute del contexto)
        navigate(getDashboardRoute());
    };

    return (
        <div className="login-container">
            <div className="glass-card">
                <form onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>

                    {error && <p className="error">{error}</p>}

                    <div className="form-group">
                        <label>Correo electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@dominio.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-options">
                        <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Cargando...' : 'Ingresar'}
                    </button>

                    <div className="register-link">
                        <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};
