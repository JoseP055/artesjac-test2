// pages/RegisterPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/variables.css';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, getDashboardRoute } = useAuth();

    const [userType, setUserType] = React.useState('buyer');
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        phone: '',
        address: ''
    });
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones frontend
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Por favor, completa todos los campos obligatorios.');
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setLoading(false);
            return;
        }
        if (userType === 'seller' && !formData.businessName.trim()) {
            setError('Por favor, ingresa el nombre del negocio.');
            setLoading(false);
            return;
        }

        // Llamar a backend
        const res = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            userType,
            businessName: userType === 'seller' ? formData.businessName : null,
            phone: formData.phone || null,
            address: formData.address || null
        });

        setLoading(false);

        if (!res.ok) {
            setError(res.error || 'No se pudo registrar.');
            return;
        }

        // Redirigir según tipo
        navigate(getDashboardRoute());
    };

    return (
        <div className="register-container">
            <div className="glass-card">
                <h2>Crear Cuenta</h2>
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Selector tipo de usuario */}
                    <div className="user-type-selector">
                        <button
                            type="button"
                            className={`type-button ${userType === 'buyer' ? 'active' : ''}`}
                            onClick={() => setUserType('buyer')}
                        >
                            🛒 Soy Comprador
                        </button>
                        <button
                            type="button"
                            className={`type-button ${userType === 'seller' ? 'active' : ''}`}
                            onClick={() => setUserType('seller')}
                        >
                            🏪 Soy Vendedor/Artesano
                        </button>
                    </div>

                    {/* Básico */}
                    <div className="form-group">
                        <label>Nombre completo: *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                        />
                    </div>

                    <div className="form-group">
                        <label>Correo electrónico: *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@dominio.com"
                        />
                    </div>

                    {/* Solo vendedores */}
                    {userType === 'seller' && (
                        <div className="form-group">
                            <label>Nombre del negocio/marca: *</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Nombre de tu tienda o marca artesanal"
                            />
                        </div>
                    )}

                    {/* Contacto */}
                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+506 8888-8888"
                        />
                    </div>

                    <div className="form-group">
                        <label>Dirección:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Tu dirección"
                        />
                    </div>

                    {/* Passwords */}
                    <div className="form-group">
                        <label>Contraseña: *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar contraseña: *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>

                    <div className="register-link">
                        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};
