import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import '../../styles/dashboard.css';
import '../../styles/ordersGestion.css';

export const SellerOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const orderStatuses = [
        { value: 'all', label: 'Todos los estados', color: '#666' },
        { value: 'pendiente', label: 'Pendiente', color: '#2196f3' },
        { value: 'en_proceso', label: 'En Proceso', color: '#ff9800' },
        { value: 'enviado', label: 'Enviado', color: '#9c27b0' },
        { value: 'entregado', label: 'Entregado', color: '#4caf50' },
        { value: 'cancelado', label: 'Cancelado', color: '#f44336' },
        { value: 'retraso', label: 'Con Retraso', color: '#ff5722' }
    ];

    const loadOrders = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            // Simular carga de pedidos desde localStorage o API
            const savedOrders = localStorage.getItem(`orders_${user?.id}`);
            if (savedOrders) {
                try {
                    const parsedOrders = JSON.parse(savedOrders);
                    setOrders(parsedOrders);
                } catch (error) {
                    console.error('Error al cargar pedidos:', error);
                    setOrders(getDefaultOrders());
                }
            } else {
                setOrders(getDefaultOrders());
            }
            setIsLoading(false);
        }, 500);
    }, [user?.id]);

    const getDefaultOrders = () => [
        {
            id: 'ORD-001',
            date: '2024-01-15',
            customer: {
                name: 'Ana Rojas',
                email: 'ana.rojas@email.com',
                phone: '+506 8888-1111',
                address: 'San José, Costa Rica'
            },
            status: 'pendiente',
            total: 25000,
            items: [
                { name: 'Collar artesanal', quantity: 1, price: 12000 },
                { name: 'Bolso tejido', quantity: 1, price: 13000 }
            ],
            paymentMethod: 'Transferencia',
            notes: 'Cliente solicita entrega urgente',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
        },
        {
            id: 'ORD-002',
            date: '2024-01-14',
            customer: {
                name: 'Carlos Mendez',
                email: 'carlos.mendez@email.com',
                phone: '+506 8888-2222',
                address: 'Cartago, Costa Rica'
            },
            status: 'enviado',
            total: 18500,
            items: [
                { name: 'Cuadro paisaje', quantity: 1, price: 18500 }
            ],
            paymentMethod: 'Tarjeta',
            notes: '',
            trackingNumber: 'TR-123456789',
            createdAt: '2024-01-14T14:20:00Z',
            updatedAt: '2024-01-15T09:15:00Z'
        },
        {
            id: 'ORD-003',
            date: '2024-01-13',
            customer: {
                name: 'María González',
                email: 'maria.gonzalez@email.com',
                phone: '+506 8888-3333',
                address: 'Alajuela, Costa Rica'
            },
            status: 'entregado',
            total: 32000,
            items: [
                { name: 'Vasija cerámica', quantity: 1, price: 25000 },
                { name: 'Aretes madera', quantity: 1, price: 7000 }
            ],
            paymentMethod: 'Efectivo',
            notes: 'Entregado sin problemas',
            deliveredAt: '2024-01-16T16:30:00Z',
            createdAt: '2024-01-13T11:45:00Z',
            updatedAt: '2024-01-16T16:30:00Z'
        },
        {
            id: 'ORD-004',
            date: '2024-01-12',
            customer: {
                name: 'Luis Pérez',
                email: 'luis.perez@email.com',
                phone: '+506 8888-4444',
                address: 'Heredia, Costa Rica'
            },
            status: 'en_proceso',
            total: 15000,
            items: [
                { name: 'Maceta decorativa', quantity: 1, price: 15000 }
            ],
            paymentMethod: 'Transferencia',
            notes: 'Producto en preparación',
            createdAt: '2024-01-12T09:00:00Z',
            updatedAt: '2024-01-14T10:00:00Z'
        },
        {
            id: 'ORD-005',
            date: '2024-01-11',
            customer: {
                name: 'Sandra López',
                email: 'sandra.lopez@email.com',
                phone: '+506 8888-5555',
                address: 'Puntarenas, Costa Rica'
            },
            status: 'retraso',
            total: 42000,
            items: [
                { name: 'Set de platos artesanales', quantity: 1, price: 42000 }
            ],
            paymentMethod: 'Tarjeta',
            notes: 'Retraso en producción por falta de material',
            createdAt: '2024-01-11T13:20:00Z',
            updatedAt: '2024-01-15T08:00:00Z'
        },
        {
            id: 'ORD-006',
            date: '2024-01-10',
            customer: {
                name: 'Roberto Silva',
                email: 'roberto.silva@email.com',
                phone: '+506 8888-6666',
                address: 'Guanacaste, Costa Rica'
            },
            status: 'cancelado',
            total: 28000,
            items: [
                { name: 'Escultura de madera', quantity: 1, price: 28000 }
            ],
            paymentMethod: 'Transferencia',
            notes: 'Cliente canceló por cambio de planes',
            cancelledAt: '2024-01-12T15:00:00Z',
            createdAt: '2024-01-10T16:45:00Z',
            updatedAt: '2024-01-12T15:00:00Z'
        }
    ];

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    useEffect(() => {
        let filtered = [...orders];

        // Filtrar por estado
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenar
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'total':
                    return b.total - a.total;
                case 'customer':
                    return a.customer.name.localeCompare(b.customer.name);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        setFilteredOrders(filtered);
    }, [orders, selectedStatus, searchTerm, sortBy]);

    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                const updatedOrder = {
                    ...order,
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                };

                // Agregar campos específicos según el estado
                if (newStatus === 'enviado' && !order.trackingNumber) {
                    updatedOrder.trackingNumber = `TR-${Date.now()}`;
                } else if (newStatus === 'entregado') {
                    updatedOrder.deliveredAt = new Date().toISOString();
                } else if (newStatus === 'cancelado') {
                    updatedOrder.cancelledAt = new Date().toISOString();
                }

                return updatedOrder;
            }
            return order;
        });

        setOrders(updatedOrders);
        localStorage.setItem(`orders_${user?.id}`, JSON.stringify(updatedOrders));
    };

    const getStatusInfo = (status) => {
        return orderStatuses.find(s => s.value === status) || orderStatuses[0];
    };

    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pendiente: orders.filter(o => o.status === 'pendiente').length,
            en_proceso: orders.filter(o => o.status === 'en_proceso').length,
            enviado: orders.filter(o => o.status === 'enviado').length,
            entregado: orders.filter(o => o.status === 'entregado').length,
            cancelado: orders.filter(o => o.status === 'cancelado').length,
            retraso: orders.filter(o => o.status === 'retraso').length,
            totalRevenue: orders.filter(o => o.status === 'entregado').reduce((sum, o) => sum + o.total, 0)
        };
        return stats;
    };

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    const stats = getOrderStats();

    return (
        <div className="dashboard-container orders-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <Link to="/seller/dashboard" className="back-button">
                        <i className="fa fa-arrow-left"></i>
                        Regresar al Dashboard
                    </Link>
                    <h1>📋 Gestión de Pedidos</h1>
                    <p>Administra todos los pedidos de tu tienda</p>
                </div>
            </div>

            {/* Estadísticas de Pedidos */}
            <div className="orders-stats">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <i className="fa fa-shopping-bag"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.total}</h3>
                        <p>Total Pedidos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending">
                        <i className="fa fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.pendiente}</h3>
                        <p>Pendientes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon processing">
                        <i className="fa fa-cog"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.en_proceso}</h3>
                        <p>En Proceso</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon shipped">
                        <i className="fa fa-truck"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.enviado}</h3>
                        <p>Enviados</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon delivered">
                        <i className="fa fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.entregado}</h3>
                        <p>Entregados</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                        <h3>₡{stats.totalRevenue.toLocaleString()}</h3>
                        <p>Ingresos</p>
                    </div>
                </div>
            </div>

            {/* Controles y Filtros */}
            <div className="orders-controls">
                <div className="search-section">
                    <div className="search-box">
                        <i className="fa fa-search"></i>
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-section">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="filter-select"
                    >
                        {orderStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date">Ordenar por Fecha</option>
                        <option value="total">Ordenar por Total</option>
                        <option value="customer">Ordenar por Cliente</option>
                        <option value="status">Ordenar por Estado</option>
                    </select>
                </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="section-card orders-table-card">
                <div className="section-header">
                    <h2>📦 Lista de Pedidos</h2>
                    <span className="orders-count">{filteredOrders.length} pedidos</span>
                </div>

                <div className="orders-table-container">
                    <div className="orders-table">
                        <div className="table-header">
                            <div className="header-cell">ID Pedido</div>
                            <div className="header-cell">Cliente</div>
                            <div className="header-cell">Fecha</div>
                            <div className="header-cell">Estado</div>
                            <div className="header-cell">Total</div>
                            <div className="header-cell">Acciones</div>
                        </div>

                        {filteredOrders.map(order => (
                            <div key={order.id} className="table-row order-row">
                                <div className="table-cell order-id">
                                    <strong>#{order.id}</strong>
                                </div>

                                <div className="table-cell customer-info">
                                    <div>
                                        <h4>{order.customer.name}</h4>
                                        <p>{order.customer.email}</p>
                                    </div>
                                </div>

                                <div className="table-cell order-date">
                                    {new Date(order.createdAt).toLocaleDateString('es-CR')}
                                    <br />
                                    <small>{new Date(order.createdAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>

                                <div className="table-cell status">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                        style={{ borderColor: getStatusInfo(order.status).color }}
                                    >
                                        {orderStatuses.slice(1).map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="table-cell order-total">
                                    <strong>₡{order.total.toLocaleString()}</strong>
                                </div>

                                <div className="table-cell actions">
                                    <button
                                        onClick={() => openOrderModal(order)}
                                        className="btn-action view"
                                        title="Ver Detalles"
                                    >
                                        <i className="fa fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredOrders.length === 0 && (
                            <div className="empty-state">
                                <i className="fa fa-inbox"></i>
                                <h3>No hay pedidos</h3>
                                <p>No se encontraron pedidos con los filtros aplicados</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Detalles del Pedido */}
            {showOrderModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
                    <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Detalles del Pedido #{selectedOrder.id}</h2>
                            <button onClick={() => setShowOrderModal(false)} className="modal-close">
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="order-details-grid">
                                {/* Información del Cliente */}
                                <div className="detail-section">
                                    <h3>👤 Información del Cliente</h3>
                                    <div className="detail-item">
                                        <strong>Nombre:</strong> {selectedOrder.customer.name}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Email:</strong> {selectedOrder.customer.email}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Teléfono:</strong> {selectedOrder.customer.phone}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Dirección:</strong> {selectedOrder.customer.address}
                                    </div>
                                </div>

                                {/* Información del Pedido */}
                                <div className="detail-section">
                                    <h3>📋 Información del Pedido</h3>
                                    <div className="detail-item">
                                        <strong>Estado:</strong>
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusInfo(selectedOrder.status).color }}
                                        >
                                            {getStatusInfo(selectedOrder.status).label}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <strong>Fecha de Pedido:</strong> {new Date(selectedOrder.createdAt).toLocaleString('es-CR')}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Método de Pago:</strong> {selectedOrder.paymentMethod}
                                    </div>
                                    {selectedOrder.trackingNumber && (
                                        <div className="detail-item">
                                            <strong>Número de Seguimiento:</strong> {selectedOrder.trackingNumber}
                                        </div>
                                    )}
                                    {selectedOrder.notes && (
                                        <div className="detail-item">
                                            <strong>Notas:</strong> {selectedOrder.notes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Productos del Pedido */}
                            <div className="detail-section full-width">
                                <h3>🛍️ Productos del Pedido</h3>
                                <div className="items-table">
                                    <div className="items-header">
                                        <span>Producto</span>
                                        <span>Cantidad</span>
                                        <span>Precio Unitario</span>
                                        <span>Subtotal</span>
                                    </div>
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="items-row">
                                            <span>{item.name}</span>
                                            <span>{item.quantity}</span>
                                            <span>₡{item.price.toLocaleString()}</span>
                                            <span>₡{(item.quantity * item.price).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="items-total">
                                        <strong>Total: ₡{selectedOrder.total.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};