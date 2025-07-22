import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile.css';

export const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    // Mock data del usuario - en un proyecto real vendría de la autenticación
    const [userInfo, setUserInfo] = useState({
        name: 'Ana María Rojas',
        email: 'ana.rojas@email.com',
        phone: '+506 8888-9999',
        birthDate: '1985-03-15',
        joinDate: '2023-05-20',
        totalOrders: 12,
        totalSpent: 245000
    });

    const [editForm, setEditForm] = useState({ ...userInfo });

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'principal',
            name: 'Casa',
            fullAddress: 'Desamparados, San José, Costa Rica',
            details: 'Frente al parque central, casa blanca con portón verde',
            isDefault: true
        },
        {
            id: 2,
            type: 'trabajo',
            name: 'Oficina',
            fullAddress: 'San José Centro, Costa Rica',
            details: 'Edificio Torre Mercedes, piso 8',
            isDefault: false
        }
    ]);

    const [orders] = useState([
        {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'entregado',
            total: 45000,
            items: ['Collar artesanal', 'Bolso tejido']
        },
        {
            id: 'ORD-002',
            date: '2024-01-10',
            status: 'en-transito',
            total: 28000,
            items: ['Cuadro paisaje costarricense']
        },
        {
            id: 'ORD-003',
            date: '2024-01-05',
            status: 'entregado',
            total: 19500,
            items: ['Vasija de cerámica', 'Aretes de madera']
        }
    ]);

    const handleEditToggle = () => {
        if (isEditing) {
            setUserInfo({ ...editForm });
        } else {
            setEditForm({ ...userInfo });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'entregado': return '#4caf50';
            case 'en-transito': return '#ff9800';
            case 'pendiente': return '#2196f3';
            case 'cancelado': return '#f44336';
            default: return '#666';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'entregado': return 'Entregado';
            case 'en-transito': return 'En tránsito';
            case 'pendiente': return 'Pendiente';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <main className="profile-container">
            {/* Header del perfil */}
            <section className="profile-hero">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className="fa fa-user-circle"></i>
                    </div>
                    <div className="profile-intro">
                        <h1>¡Hola, {userInfo.name}!</h1>
                        <p>Miembro desde {new Date(userInfo.joinDate).toLocaleDateString('es-CR')}</p>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-number">{userInfo.totalOrders}</span>
                                <span className="stat-label">Pedidos</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">₡{userInfo.totalSpent.toLocaleString()}</span>
                                <span className="stat-label">Total gastado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navegación de tabs */}
            <nav className="profile-tabs">
                <button 
                    className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    <i className="fa fa-user"></i> Información Personal
                </button>
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <i className="fa fa-shopping-bag"></i> Mis Pedidos
                </button>
                <button 
                    className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                >
                    <i className="fa fa-map-marker"></i> Direcciones
                </button>
                <button 
                    className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    <i className="fa fa-shield"></i> Seguridad
                </button>
            </nav>

            {/* Contenido de los tabs */}
            <div className="profile-content">
                {/* Tab: Información Personal */}
                {activeTab === 'personal' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Información Personal</h2>
                            <button 
                                className={`btn-edit ${isEditing ? 'editing' : ''}`}
                                onClick={handleEditToggle}
                            >
                                {isEditing ? (
                                    <>
                                        <i className="fa fa-check"></i> Guardar
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-edit"></i> Editar
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="info-grid">
                            <div className="info-field">
                                <label>Nombre completo</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={editForm.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span>{userInfo.name}</span>
                                )}
                            </div>

                            <div className="info-field">
                                <label>Correo electrónico</label>
                                {isEditing ? (
                                    <input 
                                        type="email" 
                                        value={editForm.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span>{userInfo.email}</span>
                                )}
                            </div>

                            <div className="info-field">
                                <label>Teléfono</label>
                                {isEditing ? (
                                    <input 
                                        type="tel" 
                                        value={editForm.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span>{userInfo.phone}</span>
                                )}
                            </div>

                            <div className="info-field">
                                <label>Fecha de nacimiento</label>
                                {isEditing ? (
                                    <input 
                                        type="date" 
                                        value={editForm.birthDate}
                                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span>{new Date(userInfo.birthDate).toLocaleDateString('es-CR')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Mis Pedidos */}
                {activeTab === 'orders' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Mis Pedidos</h2>
                            <span className="orders-count">{orders.length} pedidos realizados</span>
                        </div>

                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Pedido #{order.id}</h3>
                                            <p className="order-date">{new Date(order.date).toLocaleDateString('es-CR')}</p>
                                        </div>
                                        <div className="order-status">
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(order.status) }}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-details">
                                        <div className="order-items">
                                            <strong>Productos:</strong> {order.items.join(', ')}
                                        </div>
                                        <div className="order-total">
                                            <strong>Total: ₡{order.total.toLocaleString()}</strong>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <Link to={`/orders/${order.id}`} className="btn-view-order">
                                            Ver detalles
                                        </Link>
                                        {order.status === 'entregado' && (
                                            <button className="btn-reorder">
                                                Volver a comprar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab: Direcciones */}
                {activeTab === 'addresses' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Mis Direcciones</h2>
                            <button className="btn-add-address">
                                <i className="fa fa-plus"></i> Agregar dirección
                            </button>
                        </div>

                        <div className="addresses-list">
                            {addresses.map(address => (
                                <div key={address.id} className="address-card">
                                    <div className="address-header">
                                        <h3>{address.name}</h3>
                                        {address.isDefault && (
                                            <span className="default-badge">Principal</span>
                                        )}
                                    </div>
                                    
                                    <div className="address-details">
                                        <p><strong>{address.fullAddress}</strong></p>
                                        <p className="address-note">{address.details}</p>
                                    </div>

                                    <div className="address-actions">
                                        <button className="btn-edit-address">
                                            <i className="fa fa-edit"></i> Editar
                                        </button>
                                        {!address.isDefault && (
                                            <button className="btn-delete-address">
                                                <i className="fa fa-trash"></i> Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab: Seguridad */}
                {activeTab === 'security' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Seguridad de la Cuenta</h2>
                        </div>

                        <div className="security-section">
                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Contraseña</h3>
                                    <p>Última actualización: hace 3 meses</p>
                                </div>
                                <button 
                                    className="btn-change-password"
                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                >
                                    Cambiar contraseña
                                </button>
                            </div>

                            {showPasswordForm && (
                                <div className="password-form">
                                    <div className="form-group">
                                        <label>Contraseña actual</label>
                                        <input type="password" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Nueva contraseña</label>
                                        <input type="password" className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirmar nueva contraseña</label>
                                        <input type="password" className="form-input" />
                                    </div>
                                    <div className="form-actions">
                                        <button className="btn-save-password">Guardar cambios</button>
                                        <button 
                                            className="btn-cancel"
                                            onClick={() => setShowPasswordForm(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Autenticación de dos factores</h3>
                                    <p>Agrega una capa extra de seguridad a tu cuenta</p>
                                </div>
                                <button className="btn-setup-2fa">
                                    Configurar
                                </button>
                            </div>

                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Sesiones activas</h3>
                                    <p>Gestiona los dispositivos donde has iniciado sesión</p>
                                </div>
                                <button className="btn-manage-sessions">
                                    Ver sesiones
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};