import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/variables.css'; 

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
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

        // Simular registro exitoso
        setTimeout(() => {
            const userData = {
                id: Date.now(),
                email: formData.email,
                name: formData.name,
                userType: userType,
                businessName: userType === 'seller' ? formData.businessName : null,
                phone: formData.phone,
                address: formData.address
            };

            // Registrar y logear automáticamente
            login(userData);

            // Redireccionar según tipo de usuario
            if (userType === 'seller') {
                navigate('/seller/dashboard');
            } else {
                navigate('/buyer/dashboard');
            }

            setLoading(false);
        }, 1500);
    };

    return (
        <div className="register-container">
            <div className="glass-card">
                <h2>Crear Cuenta</h2>
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Selector de tipo de usuario */}
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

                    {/* Información básica */}
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

                    {/* Nombre del negocio (solo para vendedores) */}
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

                    {/* Información de contacto */}
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

                    {/* Contraseñas */}
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

                    {/* Información según tipo de usuario */}
                    <div style={{ 
                        background: 'rgba(255, 87, 34, 0.1)', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        marginBottom: '1rem',
                        border: '1px solid rgba(255, 87, 34, 0.3)'
                    }}>
                        {userType === 'buyer' ? (
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff5722' }}>Como Comprador podrás:</h4>
                                <ul style={{ fontSize: '0.85rem', color: '#ccc', margin: 0, paddingLeft: '1.2rem' }}>
                                    <li>Explorar y comprar productos artesanales</li>
                                    <li>Gestionar tu carrito y pedidos</li>
                                    <li>Seguimiento de entregas</li>
                                    <li>Guardar productos favoritos</li>
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff5722' }}>Como Vendedor podrás:</h4>
                                <ul style={{ fontSize: '0.85rem', color: '#ccc', margin: 0, paddingLeft: '1.2rem' }}>
                                    <li>Crear y gestionar tu tienda</li>
                                    <li>Publicar tus productos artesanales</li>
                                    <li>Administrar inventario y pedidos</li>
                                    <li>Ver estadísticas de ventas</li>
                                </ul>
                            </div>
                        )}
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