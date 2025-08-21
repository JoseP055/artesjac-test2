import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import "../styles/profile.css";
import { ProfileAPI } from "../api/profile.service";

export const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        joinDate: "",
        userType: "buyer",
        businessName: "",
        totalOrders: 0,
        totalSpent: 0,
    });

    const [editForm, setEditForm] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);

    // Address modal simple
    const [addressModal, setAddressModal] = useState({ open: false, mode: "add", form: { name: "", fullAddress: "", type: "principal", details: "", isDefault: false }, id: null });

    const getAvailableTabs = () => [
        { id: "personal", icon: "fa-user", label: "Información Personal" },
        { id: "addresses", icon: "fa-map-marker", label: "Direcciones" },
        { id: "orders", icon: "fa-list", label: "Mis Pedidos" },
        { id: "security", icon: "fa-shield", label: "Seguridad" },
    ];

    const loadAll = async () => {
        setLoading(true);
        try {
            const res = await ProfileAPI.getMe();
            const d = res?.data;

            const u = d?.user || {};
            const p = d?.profile || {};
            const stats = d?.stats || {};

            setUserInfo({
                id: u.id || "",
                name: u.name || "",
                email: u.email || "",
                phone: p.phone || "",
                birthDate: p.birthDate ? new Date(p.birthDate).toISOString().slice(0, 10) : "",
                joinDate: u.joinDate || new Date().toISOString(),
                userType: u.userType || "buyer",
                businessName: p.businessName || "",
                totalOrders: stats.totalOrders || 0,
                totalSpent: stats.totalSpent || 0,
            });

            setEditForm({
                name: u.name || "",
                email: u.email || "",
                phone: p.phone || "",
                birthDate: p.birthDate ? new Date(p.birthDate).toISOString().slice(0, 10) : "",
            });

            setAddresses(d?.addresses || []);
            setOrders(d?.recentOrders || []);
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.error || "No se pudo cargar tu perfil.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleEditToggle = async () => {
        if (isEditing) {
            // Guardar
            try {
                await ProfileAPI.updateMe({
                    name: editForm.name,
                    phone: editForm.phone,
                    birthDate: editForm.birthDate || null,
                });
                await loadAll();
            } catch (e) {
                console.error(e);
                alert(e?.response?.data?.error || "No se pudo actualizar el perfil.");
                return; // no cambiamos a modo lectura si falló
            }
        } else {
            // Entrar a edición: precargar
            setEditForm({
                name: userInfo.name,
                email: userInfo.email, // solo lectura
                phone: userInfo.phone,
                birthDate: userInfo.birthDate,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "entregado":
                return "#4caf50";
            case "en-transito":
            case "enviado":
                return "#ff9800";
            case "pendiente":
            case "en_proceso":
                return "#2196f3";
            case "cancelado":
                return "#f44336";
            case "retraso":
                return "#ff5722";
            default:
                return "#666";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "entregado":
                return "Entregado";
            case "en-transito":
            case "enviado":
                return "En tránsito";
            case "pendiente":
                return "Pendiente";
            case "en_proceso":
                return "En proceso";
            case "cancelado":
                return "Cancelado";
            case "retraso":
                return "Con Retraso";
            default:
                return status;
        }
    };

    const getWelcomeMessage = () => `¡Hola, ${userInfo.name}!`;

    const getProfileStats = () => (
        <>
            <div className="stat">
                <span className="stat-number">{userInfo.totalOrders}</span>
                <span className="stat-label">Pedidos</span>
            </div>
            <div className="stat">
                <span className="stat-number">₡{Number(userInfo.totalSpent).toLocaleString()}</span>
                <span className="stat-label">Total gastado</span>
            </div>
        </>
    );

    const openAddAddress = () => {
        setAddressModal({ open: true, mode: "add", form: { name: "", fullAddress: "", type: "principal", details: "", isDefault: false }, id: null });
    };

    const openEditAddress = (a) => {
        setAddressModal({ open: true, mode: "edit", id: a.id, form: { name: a.name, fullAddress: a.fullAddress, type: a.type || "principal", details: a.details || "", isDefault: a.isDefault || false } });
    };

    const saveAddress = async () => {
        const { mode, id, form } = addressModal;
        try {
            if (mode === "add") {
                await ProfileAPI.createAddress(form);
            } else {
                await ProfileAPI.updateAddress(id, form);
            }
            setAddressModal((s) => ({ ...s, open: false }));
            const res = await ProfileAPI.listAddresses();
            setAddresses(res.data || []);
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.error || "No se pudo guardar la dirección.");
        }
    };

    const deleteAddress = async (id) => {
        if (!window.confirm("¿Eliminar esta dirección?")) return;
        try {
            await ProfileAPI.deleteAddress(id);
            const res = await ProfileAPI.listAddresses();
            setAddresses(res.data || []);
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.error || "No se pudo eliminar la dirección.");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.newPassword.value;
        const confirm = e.target.confirmPassword.value;
        if (newPassword !== confirm) return alert("Las contraseñas no coinciden.");
        try {
            await ProfileAPI.changePassword({ currentPassword, newPassword });
            alert("Contraseña actualizada");
            setShowPasswordForm(false);
            e.target.reset();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.error || "No se pudo cambiar la contraseña.");
        }
    };

    if (loading) {
        return (
            <main className="profile-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando tu perfil...</p>
                </div>
            </main>
        );
    }

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
                        <p>Miembro desde {new Date(userInfo.joinDate).toLocaleDateString("es-CR")}</p>
                        <div className="profile-stats">{getProfileStats()}</div>
                        <div className="profile-dashboard-action">
                            <Link to="/buyer/dashboard" className="btn-dashboard">
                                <i className="fa fa-tachometer-alt"></i> Ir al Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <nav className="profile-tabs">
                {getAvailableTabs().map((tab) => (
                    <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                        <i className={`fa ${tab.icon}`}></i> {tab.label}
                    </button>
                ))}
            </nav>

            {/* Contenido */}
            <div className="profile-content">
                {/* Personal */}
                {activeTab === "personal" && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Información Personal</h2>
                            <button className={`btn-edit ${isEditing ? "editing" : ""}`} onClick={handleEditToggle}>
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
                                {isEditing ? <input type="text" value={editForm.name} onChange={(e) => handleInputChange("name", e.target.value)} className="edit-input" /> : <span>{userInfo.name}</span>}
                            </div>

                            <div className="info-field">
                                <label>Correo electrónico</label>
                                <span>{userInfo.email}</span> {/* Email no editable aquí */}
                            </div>

                            <div className="info-field">
                                <label>Teléfono</label>
                                {isEditing ? <input type="tel" value={editForm.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="edit-input" /> : <span>{userInfo.phone || "—"}</span>}
                            </div>

                            <div className="info-field">
                                <label>Fecha de nacimiento</label>
                                {isEditing ? <input type="date" value={editForm.birthDate || ""} onChange={(e) => handleInputChange("birthDate", e.target.value)} className="edit-input" /> : <span>{userInfo.birthDate ? new Date(userInfo.birthDate).toLocaleDateString("es-CR") : "—"}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Direcciones */}
                {activeTab === "addresses" && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Mis Direcciones</h2>
                            <button className="btn-add-address" onClick={openAddAddress}>
                                <i className="fa fa-plus"></i> Agregar dirección
                            </button>
                        </div>

                        <div className="addresses-list">
                            {addresses.map((address) => (
                                <div key={address.id} className="address-card">
                                    <div className="address-header">
                                        <h3>{address.name}</h3>
                                        {address.isDefault && <span className="default-badge">Principal</span>}
                                    </div>

                                    <div className="address-details">
                                        <p>
                                            <strong>{address.fullAddress}</strong>
                                        </p>
                                        {address.details && <p className="address-note">{address.details}</p>}
                                    </div>

                                    <div className="address-actions">
                                        <button className="btn-edit-address" onClick={() => openEditAddress(address)}>
                                            <i className="fa fa-edit"></i> Editar
                                        </button>
                                        {!address.isDefault && (
                                            <button className="btn-delete-address" onClick={() => deleteAddress(address.id)}>
                                                <i className="fa fa-trash"></i> Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {addresses.length === 0 && (
                                <div className="empty-state">
                                    <i className="fa fa-map-marker"></i>
                                    <h3>No tenés direcciones registradas</h3>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pedidos */}
                {activeTab === "orders" && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Mis Pedidos</h2>
                            <Link to="/orders" className="view-all-link">
                                Ver todos
                            </Link>
                        </div>

                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Pedido #{order.id}</h3>
                                            <p className="order-date">{new Date(order.date).toLocaleDateString("es-CR")}</p>
                                        </div>
                                        <div className="order-status">
                                            <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-details">
                                        <div className="order-items">
                                            <strong>Productos:</strong> {(order.items || []).join(", ")}
                                        </div>
                                        <div className="order-total">
                                            <strong>Total: ₡{Number(order.total).toLocaleString()}</strong>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <Link to={`/orders/${order.id}`} className="btn-view-order">
                                            Ver detalles
                                        </Link>
                                        {order.status === "entregado" && <button className="btn-reorder">Volver a comprar</button>}
                                    </div>
                                </div>
                            ))}

                            {orders.length === 0 && (
                                <div className="empty-state">
                                    <i className="fa fa-inbox"></i>
                                    <h3>No hay pedidos recientes</h3>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Seguridad */}
                {activeTab === "security" && (
                    <div className="tab-content">
                        <div className="section-header">
                            <h2>Seguridad de la Cuenta</h2>
                        </div>

                        <div className="security-section">
                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Contraseña</h3>
                                    <p>Te recomendamos actualizarla periódicamente</p>
                                </div>
                                <button className="btn-change-password" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                                    Cambiar contraseña
                                </button>
                            </div>

                            {showPasswordForm && (
                                <form className="password-form" onSubmit={changePassword}>
                                    <div className="form-group">
                                        <label>Contraseña actual</label>
                                        <input name="currentPassword" type="password" className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Nueva contraseña</label>
                                        <input name="newPassword" type="password" className="form-input" required minLength={6} />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirmar nueva contraseña</label>
                                        <input name="confirmPassword" type="password" className="form-input" required minLength={6} />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn-save-password">
                                            Guardar cambios
                                        </button>
                                        <button type="button" className="btn-cancel" onClick={() => setShowPasswordForm(false)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="security-item">
                                <div className="security-info">
                                    <h3>Autenticación de dos factores</h3>
                                    <p>Próximamente</p>
                                </div>
                                <button className="btn-setup-2fa" disabled>
                                    Configurar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal dirección */}
            {addressModal.open && (
                <div className="modal-overlay" onClick={() => setAddressModal((s) => ({ ...s, open: false }))}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{addressModal.mode === "add" ? "Agregar Dirección" : "Editar Dirección"}</h2>
                            <button className="modal-close" onClick={() => setAddressModal((s) => ({ ...s, open: false }))}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input value={addressModal.form.name} onChange={(e) => setAddressModal((s) => ({ ...s, form: { ...s.form, name: e.target.value } }))} />
                            </div>
                            <div className="form-group">
                                <label>Dirección</label>
                                <input value={addressModal.form.fullAddress} onChange={(e) => setAddressModal((s) => ({ ...s, form: { ...s.form, fullAddress: e.target.value } }))} />
                            </div>
                            <div className="form-group">
                                <label>Detalles</label>
                                <input value={addressModal.form.details} onChange={(e) => setAddressModal((s) => ({ ...s, form: { ...s.form, details: e.target.value } }))} />
                            </div>
                            <label className="checkbox-label" style={{ marginTop: 8 }}>
                                <input type="checkbox" checked={!!addressModal.form.isDefault} onChange={(e) => setAddressModal((s) => ({ ...s, form: { ...s.form, isDefault: e.target.checked } }))} />
                                <span>Marcar como principal</span>
                            </label>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setAddressModal((s) => ({ ...s, open: false }))}>
                                Cancelar
                            </button>
                            <button className="btn-save" onClick={saveAddress}>
                                <i className="fa fa-save"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};
