import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../modules/auth/AuthContext";
import "../../styles/dashboard.css";
import "../../styles/ordersGestion.css";
import { OrdersAPI } from "../../api/orders.service";

export const SellerOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const orderStatuses = [
        { value: "all", label: "Todos los estados", color: "#666" },
        { value: "pendiente", label: "Pendiente", color: "#2196f3" },
        { value: "en_proceso", label: "En Proceso", color: "#ff9800" },
        { value: "enviado", label: "Enviado", color: "#9c27b0" },
        { value: "entregado", label: "Entregado", color: "#4caf50" },
        { value: "cancelado", label: "Cancelado", color: "#f44336" },
        { value: "retraso", label: "Con Retraso", color: "#ff5722" },
    ];

    const getStatusInfo = (status) =>
        orderStatuses.find((s) => s.value === status) || orderStatuses[0];

    const mapOrder = (o) => ({
        id: o.id || o._id, // backend envía id en toJSON
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        status: o.status,
        total: Number(o.total) || 0,
        paymentMethod: o.paymentMethod || "",
        notes: o.notes || "",
        trackingNumber: o.trackingNumber || "",
        deliveredAt: o.deliveredAt,
        cancelledAt: o.cancelledAt,
        customer: {
            name: o.customer?.name || "",
            email: o.customer?.email || "",
            phone: o.customer?.phone || "",
            address: o.customer?.address || "",
        },
        items: Array.isArray(o.items) ? o.items.map((it) => ({
            name: it.name,
            price: Number(it.price) || 0,
            quantity: Number(it.quantity) || 0,
        })) : [],
    });

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await OrdersAPI.list({ page: 1, limit: 100, status: selectedStatus, q: searchTerm, sort: sortBy });
            const mapped = (res?.data || []).map(mapOrder);
            setOrders(mapped);
        } catch (e) {
            console.error("Error cargando pedidos:", e);
            alert(e?.response?.data?.error || "No se pudieron cargar los pedidos.");
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedStatus, searchTerm, sortBy]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Filtro/orden local adicional (opcional, por si el backend no lo hace todo)
    useEffect(() => {
        let list = [...orders];

        if (selectedStatus !== "all") {
            list = list.filter((o) => o.status === selectedStatus);
        }

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (o) =>
                    String(o.id).toLowerCase().includes(q) ||
                    o.customer.name.toLowerCase().includes(q) ||
                    o.customer.email.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "total":
                    return b.total - a.total;
                case "customer":
                    return a.customer.name.localeCompare(b.customer.name);
                case "status":
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        setFilteredOrders(list);
    }, [orders, selectedStatus, searchTerm, sortBy]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const current = orders.find((o) => o.id === orderId);
            const needsTracking = newStatus === "enviado" && !current?.trackingNumber;
            const trackingNumber = needsTracking ? `TR-${Date.now()}` : undefined;

            await OrdersAPI.updateStatus(orderId, newStatus, trackingNumber);
            await loadOrders();
        } catch (e) {
            console.error("Error actualizando estado:", e);
            alert(e?.response?.data?.error || "No se pudo actualizar el estado.");
        }
    };

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const stats = {
        total: orders.length,
        pendiente: orders.filter((o) => o.status === "pendiente").length,
        en_proceso: orders.filter((o) => o.status === "en_proceso").length,
        enviado: orders.filter((o) => o.status === "enviado").length,
        entregado: orders.filter((o) => o.status === "entregado").length,
        cancelado: orders.filter((o) => o.status === "cancelado").length,
        retraso: orders.filter((o) => o.status === "retraso").length,
        totalRevenue: orders
            .filter((o) => o.status === "entregado")
            .reduce((sum, o) => sum + o.total, 0),
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

            {/* Estadísticas */}
            <div className="orders-stats">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <i className="fa fa-shopping-bag"></i>
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

            {/* Controles */}
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
                        {orderStatuses.map((status) => (
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

            {/* Tabla */}
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

                        {filteredOrders.map((order) => (
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
                                    {new Date(order.createdAt).toLocaleDateString("es-CR")}
                                    <br />
                                    <small>
                                        {new Date(order.createdAt).toLocaleTimeString("es-CR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </small>
                                </div>

                                <div className="table-cell status">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                        style={{ borderColor: getStatusInfo(order.status).color }}
                                    >
                                        {orderStatuses.slice(1).map((status) => (
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

            {/* Modal */}
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
                                        <strong>Fecha de Pedido:</strong>{" "}
                                        {new Date(selectedOrder.createdAt).toLocaleString("es-CR")}
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
