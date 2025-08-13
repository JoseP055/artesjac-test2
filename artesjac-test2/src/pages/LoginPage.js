import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/variables.css';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Usuarios de prueba para demo
    const testUsers = {
        'comprador@test.com': {
            email: 'comprador@test.com',
            password: '123456',
            userType: 'buyer',
            name: 'Ana Comprador',
            businessName: null
        },
        'vendedor@test.com': {
            email: 'vendedor@test.com',
            password: '123456',
            userType: 'seller',
            name: 'Carlos Vendedor',
            businessName: 'Artesanías Carlos'
        },
        'admin@artesjac.com': {
            email: 'admin@artesjac.com',
            password: 'admin123',
            userType: 'seller',
            name: 'Administrador',
            businessName: 'ArtesJAC Admin'
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validación básica
        if (!email && !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
            setLoading(false);
            return;
        } else if (!email) {
            setError('Por favor, ingresa tu correo electrónico.');
            setLoading(false);
            return;
        } else if (!password) {
            setError('Por favor, ingresa tu contraseña.');
            setLoading(false);
            return;
        }

        // Simular llamada a API
        setTimeout(() => {
            const user = testUsers[email];
            
            if (user && user.password === password) {
                // Login exitoso
                const userData = {
                    id: Date.now(),
                    email: user.email,
                    name: user.name,
                    userType: user.userType,
                    businessName: user.businessName
                };
                
                login(userData);
                
                // Redireccionar según tipo de usuario
                if (user.userType === 'seller') {
                    navigate('/seller/dashboard');
                } else {
                    navigate('/buyer/dashboard');
                }
            } else {
                setError('Correo o contraseña incorrectos.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="login-container">
            <div className="glass-card">
                <form onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>
                    
                    {/* Usuarios de prueba */}
                    <div style={{ 
                        background: 'rgba(255, 87, 34, 0.1)', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(255, 87, 34, 0.3)'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff5722' }}>Usuarios de Prueba:</h4>
                        <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                            <p style={{ margin: '0.2rem 0' }}><strong>Comprador:</strong> comprador@test.com / 123456</p>
                            <p style={{ margin: '0.2rem 0' }}><strong>Vendedor:</strong> vendedor@test.com / 123456</p>
                            <p style={{ margin: '0.2rem 0' }}><strong>Admin:</strong> admin@artesjac.com / admin123</p>
                        </div>
                    </div>

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