import React from 'react';
import '../styles/variables.css'; // Estilos personalizados (ver más abajo)

export const RegisterPage = () => {
    const [userType, setUserType] = React.useState('buyer'); // 'buyer' o 'seller'
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '', // solo para vendedores
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

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Por favor, completa todos los campos.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (userType === 'seller' && !formData.businessName.trim()) {
            setError('Por favor, ingresa el nombre del negocio.');
            setLoading(false);
            return;
        }

        // Simulamos una llamada a la API
        setTimeout(() => {
            alert(`Registro exitoso como ${userType === 'buyer' ? 'comprador' : 'vendedor'}`);
            console.log('Datos registrados:', { ...formData, userType });
            setLoading(false);
        }, 1000);
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
                            Soy Comprador
                        </button>
                        <button
                            type="button"
                            className={`type-button ${userType === 'seller' ? 'active' : ''}`}
                            onClick={() => setUserType('seller')}
                        >
                            Soy Vendedor
                        </button>
                    </div>

                    {/* Nombre */}
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Correo electrónico:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@dominio.com"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="form-group">
                        <label>Confirmar contraseña:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Nombre del negocio (solo para vendedores) */}
                    {userType === 'seller' && (
                        <div className="form-group">
                            <label>Nombre del negocio:</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Nombre de tu tienda o empresa"
                            />
                        </div>
                    )}

                    {/* Botón centrado */}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Cargando...' : 'Registrarse'}
                    </button>

                    {/* Enlace a login */}
                    <div className="register-link">
                        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};
