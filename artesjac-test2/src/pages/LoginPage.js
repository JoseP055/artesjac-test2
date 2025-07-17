import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/variables.css';


export const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validación por campo vacío
        if (!email && !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
        } else if (!email) {
            setError('Por favor, ingresa tu correo electrónico.');
        } else if (!password) {
            setError('Por favor, ingresa tu contraseña.');
        } else {
            // Simulamos una llamada a una API
            setTimeout(() => {
                if (email === 'test@example.com' && password === '123456') {
                    alert('Inicio de sesión exitoso');
                } else {
                    setError('Correo o contraseña incorrectos.');
                }
                setLoading(false);
            }, 1000);
        }
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
                        <a href="/recuperar">¿Olvidaste tu contraseña?</a>
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