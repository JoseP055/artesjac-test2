import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import '../styles/profile.css';

export const ProfilePage = () => {
    const { user } = useAuth(); // Obtenemos la info del usuario autenticado
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    // Mock data del usuario - en un proyecto real vendría de la autenticación
    const [userInfo, setUserInfo] = useState({
        name: user?.name || 'Ana María Rojas',
        email: user?.email || 'ana.rojas@email.com',
        phone: '+506 8888-9999',
        birthDate: '1985-03-15',
        joinDate: '2023-05-20',
        userType: user?.userType || 'buyer',
        businessName: user?.businessName || null,
        // Stats específicos por tipo de usuario
        totalOrders: user?.userType === 'seller' ? 89 : 12,
        totalSpent: user?.userType === 'seller' ? null : 245000,
        totalEarned: user?.userType === 'seller' ? 1250000 : null,
        productsCount: user?.userType === 'seller' ? 24 : null
    });

    const [editForm, setEditForm] = useState({ ...userInfo });

    // Mock data de direcciones (solo para compradores)
    const [addresses] = useState([
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

    // Mock data de pedidos/ventas
    const [orders] = useState([
        {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'entregado',
            total: 45000,
            items: ['Collar artesanal', 'Bolso tejido'],
            buyer: userInfo.userType === 'seller' ? 'María González' : null
        },
        {
            id: 'ORD-002',
            date: '2024-01-10',
            status: 'en-transito',
            total: 28000,
            items: ['Cuadro paisaje costarricense'],
            buyer: userInfo.userType === 'seller' ? 'Carlos Ruiz' : null
        },
        {
            id: 'ORD-003',
            date: '2024-01-05',
            status: 'entregado',
            total: 19500,
            items: ['Vasija de cerámica', 'Aretes de madera'],
            buyer: userInfo.userType === 'seller' ? 'Ana López' : null
        }
    ]);

    // Función para obtener las tabs según el tipo de usuario
    const getAvailableTabs = () => {
        const baseTabs = [
            { id: 'personal', icon: 'fa-user', label: 'Información Personal' },
            { id: 'security', icon: 'fa-shield', label: 'Seguridad' }
        ];

        if (userInfo.userType === 'buyer') {
            return [
                ...baseTabs.slice(0, 1),

                { id: 'addresses', icon: 'fa-map-marker', label: 'Direcciones' },
                ...baseTabs.slice(1)
            ];
        } else if (userInfo.userType === 'seller') {
            return [
                ...baseTabs.slice(0, 1),
                { id: 'seller-actions', icon: 'fa-store', label: 'Gestión de Tienda' },
                ...baseTabs.slice(1)
            ];
        } else if (userInfo.userType === 'admin') {
            return [
                ...baseTabs.slice(0, 1),
                { id: 'admin', icon: 'fa-cogs', label: 'Administración' },
                { id: 'reports', icon: 'fa-chart-bar', label: 'Reportes' },
                ...baseTabs.slice(1)
            ];
        }

        return baseTabs;
    };

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

    const getWelcomeMessage = () => {
        switch (userInfo.userType) {
            case 'seller':
                return `¡Hola, ${userInfo.name}! - Vendedor`;
            case 'admin':
                return `¡Hola, ${userInfo.name}! - Administrador`;
            default:
                return `¡Hola, ${userInfo.name}!`;
        }
    };

    const getProfileStats = () => {
        if (userInfo.userType === 'seller') {
            return (
                <>
                    <div className="stat">
                        <span className="stat-number">{userInfo.productsCount}</span>
                        <span className="stat-label">Productos</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{userInfo.totalOrders}</span>
                        <span className="stat-label">Ventas</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">₡{userInfo.totalEarned?.toLocaleString()}</span>
                        <span className="stat-label">Ganado</span>
                    </div>
                </>
            );
        } else if (userInfo.userType === 'admin') {
            return (
                <>
                    <div className="stat">
                        <span className="stat-number">245</span>
                        <span className="stat-label">Usuarios</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">89</span>
                        <span className="stat-label">Vendedores</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">1,234</span>
                        <span className="stat-label">Productos</span>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="stat">
                        <span className="stat-number">{userInfo.totalOrders}</span>
                        <span className="stat-label">Pedidos</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">₡{userInfo.totalSpent?.toLocaleString()}</span>
                        <span className="stat-label">Total gastado</span>
                    </div>
                </>
            );
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
                        <h1>{getWelcomeMessage()}</h1>
                        <p>Miembro desde {new Date(userInfo.joinDate).toLocaleDateString('es-CR')}</p>
                        {userInfo.businessName && (
                            <p style={{ color: '#ff5722', fontWeight: 'bold' }}>
                                📍 {userInfo.businessName}
                            </p>
                        )}
                        <div className="profile-stats">
                            {getProfileStats()}
                        </div>
                        {userInfo.userType === 'buyer' && (
                            <div className="profile-dashboard-action">
                                <Link to="/buyer/dashboard" className="btn-dashboard">
                                    <i className="fa fa-tachometer-alt"></i> Ir al Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Navegación de tabs */}
            <nav className="profile-tabs">
                {getAvailableTabs().map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={`fa ${tab.icon}`}></i> {tab.label}
                    </button>
                ))}
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

                            {/* Campo específico para vendedores */}
                            {userInfo.userType === 'seller' && (
                                <div className="info-field">
                                    <label>Nombre del negocio</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.businessName || ''}
                                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                                            className="edit-input"
                                            placeholder="Nombre de tu tienda"
                                        />
                                    ) : (
                                        <span>{userInfo.businessName || 'No especificado'}</span>
                                    )}
                                </div>
                            )}

                            <div className="info-field">
                                <label>Tipo de usuario</label>
                                <span style={{
                                    color: userInfo.userType === 'seller' ? '#ff5722' :
                                        userInfo.userType === 'admin' ? '#4caf50' : '#2196f3',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize'
                                }}>
                                    {userInfo.userType === 'seller' ? 'Vendedor' :
                                        userInfo.userType === 'admin' ? 'Administrador' : 'Comprador'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Mis Pedidos (solo para compradores) */}
                {activeTab === 'orders' && userInfo.userType === 'buyer' && (
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

                {/* Tab: Gestión de Tienda (solo para vendedores) */}
                {activeTab === 'seller-actions' && userInfo.userType === 'seller' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Gestión de Tienda</h2>
                            <span style={{ color: '#ff5722', fontWeight: 'bold' }}>
                                Accede a todas las funciones de tu tienda
                            </span>
                        </div>

                        {/* Información rápida del negocio */}
                        <div className="info-grid" style={{ marginBottom: '2rem' }}>
                            <div className="info-field">
                                <label>Nombre del negocio</label>
                                <span>{userInfo.businessName || 'No especificado'}</span>
                            </div>
                            <div className="info-field">
                                <label>Productos activos</label>
                                <span>{userInfo.productsCount} productos</span>
                            </div>
                            <div className="info-field">
                                <label>Total de ventas</label>
                                <span>{userInfo.totalOrders} pedidos</span>
                            </div>
                            <div className="info-field">
                                <label>Ingresos totales</label>
                                <span>₡{userInfo.totalEarned?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Enlaces principales de gestión */}
                        <div className="seller-management-grid">
                            <Link to="/seller/store-profile" className="management-card">
                                <div className="management-icon">
                                    <i className="fa fa-store"></i>
                                </div>
                                <div className="management-content">
                                    <h3>Mi Perfil de Tienda</h3>
                                    <p>Gestiona la información de tu tienda, horarios, políticas y datos de contacto</p>
                                    <div className="management-stats">
                                        <span>Configurar tienda</span>
                                    </div>
                                </div>
                                <div className="management-arrow">
                                    <i className="fa fa-arrow-right"></i>
                                </div>
                            </Link>

                            <Link to="/seller/inventory" className="management-card">
                                <div className="management-icon">
                                    <i className="fa fa-box-open"></i>
                                </div>
                                <div className="management-content">
                                    <h3>Mis Productos</h3>
                                    <p>Administra tu inventario, agrega nuevos productos y actualiza precios</p>
                                    <div className="management-stats">
                                        <span>{userInfo.productsCount} productos activos</span>
                                    </div>
                                </div>
                                <div className="management-arrow">
                                    <i className="fa fa-arrow-right"></i>
                                </div>
                            </Link>

                            <Link to="/seller/orders" className="management-card">
                                <div className="management-icon">
                                    <i className="fa fa-shopping-cart"></i>
                                </div>
                                <div className="management-content">
                                    <h3>Mis Pedidos</h3>
                                    <p>Revisa y gestiona todos los pedidos recibidos de tus clientes</p>
                                    <div className="management-stats">
                                        <span>{userInfo.totalOrders} pedidos totales</span>
                                    </div>
                                </div>
                                <div className="management-arrow">
                                    <i className="fa fa-arrow-right"></i>
                                </div>
                            </Link>

                            <Link to="/seller/analytics" className="management-card">
                                <div className="management-icon">
                                    <i className="fa fa-chart-line"></i>
                                </div>
                                <div className="management-content">
                                    <h3>Estadísticas</h3>
                                    <p>Analiza el rendimiento de tu tienda y productos más vendidos</p>
                                    <div className="management-stats">
                                        <span>Ver análisis completo</span>
                                    </div>
                                </div>
                                <div className="management-arrow">
                                    <i className="fa fa-arrow-right"></i>
                                </div>
                            </Link>
                        </div>

                        {/* Acciones rápidas adicionales */}
                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>🚀 Acciones Rápidas</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <Link to="/seller/dashboard" className="btn-edit" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                    <i className="fa fa-dashboard"></i> Ver Dashboard
                                </Link>
                                <Link to="/seller/inventory?action=add" className="btn-edit" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                    <i className="fa fa-plus"></i> Agregar Producto
                                </Link>
                                <Link to="/seller/orders?filter=pending" className="btn-edit" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                    <i className="fa fa-clock"></i> Pedidos Pendientes
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Administración (solo para admin) */}
                {activeTab === 'admin' && userInfo.userType === 'admin' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Panel de Administración</h2>
                        </div>

                        <div className="info-grid">
                            <div className="info-field">
                                <label>Usuarios registrados</label>
                                <span>245 usuarios</span>
                            </div>
                            <div className="info-field">
                                <label>Vendedores activos</label>
                                <span>89 vendedores</span>
                            </div>
                            <div className="info-field">
                                <label>Productos en catálogo</label>
                                <span>1,234 productos</span>
                            </div>
                            <div className="info-field">
                                <label>Ventas del mes</label>
                                <span>₡4,567,890</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Gestión del Sistema</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button className="btn-edit">
                                    <i className="fa fa-users"></i> Gestionar Usuarios
                                </button>
                                <button className="btn-edit">
                                    <i className="fa fa-store"></i> Aprobar Vendedores
                                </button>
                                <button className="btn-edit">
                                    <i className="fa fa-cog"></i> Configuración
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Reportes (solo para admin) */}
                {activeTab === 'reports' && userInfo.userType === 'admin' && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Reportes del Sistema</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="address-card">
                                <h3>Ventas Mensuales</h3>
                                <p>Resumen de ventas por mes</p>
                                <button className="btn-edit">Generar Reporte</button>
                            </div>
                            <div className="address-card">
                                <h3>Usuarios Activos</h3>
                                <p>Actividad de usuarios registrados</p>
                                <button className="btn-edit">Ver Métricas</button>
                            </div>
                            <div className="address-card">
                                <h3>Productos Populares</h3>
                                <p>Top productos más vendidos</p>
                                <button className="btn-edit">Ver Ranking</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Direcciones (solo para compradores) */}
                {activeTab === 'addresses' && userInfo.userType === 'buyer' && (
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

                {/* Tab: Seguridad (para todos) */}
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