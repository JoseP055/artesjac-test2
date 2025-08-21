// src/pages/seller/SellerStoreProfile.js
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../modules/auth/AuthContext";
import "../../styles/dashboard.css";
import "../../styles/store-profile.css";
import { StoreProfileAPI } from "../../api/storeProfile.service";

export const SellerStoreProfile = () => {
    const { user, updateUser } = useAuth();

    const [storeData, setStoreData] = useState({
        businessName: "",
        description: "",
        location: { address: "", city: "", province: "", country: "Costa Rica" },
        contact: { email: "", phone: "", whatsapp: "", website: "" },
        socialMedia: { facebook: "", instagram: "", twitter: "", tiktok: "" },
        businessInfo: { category: "", foundedYear: "", employees: "", specialties: [] },
        settings: {
            acceptsCustomOrders: true,
            minOrderAmount: 0,
            deliveryAreas: [],
            workingHours: {
                monday: { open: "08:00", close: "17:00", enabled: true },
                tuesday: { open: "08:00", close: "17:00", enabled: true },
                wednesday: { open: "08:00", close: "17:00", enabled: true },
                thursday: { open: "08:00", close: "17:00", enabled: true },
                friday: { open: "08:00", close: "17:00", enabled: true },
                saturday: { open: "09:00", close: "15:00", enabled: true },
                sunday: { open: "10:00", close: "14:00", enabled: false },
            },
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");

    const businessCategories = [
        "Artesanías Tradicionales",
        "Joyería Artesanal",
        "Textiles y Tejidos",
        "Cerámica y Alfarería",
        "Arte y Decoración",
        "Productos de Madera",
        "Productos Naturales",
        "Otros",
    ];

    const provinces = [
        "San José",
        "Alajuela",
        "Cartago",
        "Heredia",
        "Guanacaste",
        "Puntarenas",
        "Limón",
    ];

    const loadStoreData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await StoreProfileAPI.getMe();
            const data = res?.data || {};
            // Prefill con email/nombre del user si viene vacío
            setStoreData((prev) => ({
                ...prev,
                ...data,
                businessName: data.businessName || user?.businessName || user?.name || "",
                contact: {
                    email: data?.contact?.email || user?.email || "",
                    phone: data?.contact?.phone || "",
                    whatsapp: data?.contact?.whatsapp || "",
                    website: data?.contact?.website || "",
                },
            }));
        } catch (e) {
            console.error("Error cargando perfil de tienda:", e);
            alert("No se pudo cargar la información de la tienda.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadStoreData();
    }, [loadStoreData]);

    const handleInputChange = (section, field, value) => {
        if (section) {
            setStoreData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setStoreData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleWorkingHoursChange = (day, field, value) => {
        setStoreData((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                workingHours: {
                    ...prev.settings.workingHours,
                    [day]: {
                        ...prev.settings.workingHours[day],
                        [field]: value,
                    },
                },
            },
        }));
    };

    const handleSpecialtiesChange = (specialty) => {
        setStoreData((prev) => {
            const current = prev.businessInfo.specialties || [];
            const updated = current.includes(specialty)
                ? current.filter((s) => s !== specialty)
                : [...current, specialty];
            return { ...prev, businessInfo: { ...prev.businessInfo, specialties: updated } };
        });
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...storeData,
                // coerciones suaves
                settings: {
                    ...storeData.settings,
                    minOrderAmount: Number(storeData.settings.minOrderAmount || 0),
                },
            };

            const res = await StoreProfileAPI.updateMe(payload);
            const saved = res?.data;

            // Actualizar contexto de usuario (visible en header/menus)
            if (updateUser) {
                updateUser({
                    businessName: saved?.businessName || storeData.businessName,
                    email: saved?.contact?.email || storeData.contact.email,
                });
            }

            setStoreData(saved);
            setIsEditing(false);
            alert("Información de la tienda guardada exitosamente");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert(error?.response?.data?.error || "Error al guardar la información.");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadStoreData();
    };

    const getDayName = (day) => {
        const days = {
            monday: "Lunes",
            tuesday: "Martes",
            wednesday: "Miércoles",
            thursday: "Jueves",
            friday: "Viernes",
            saturday: "Sábado",
            sunday: "Domingo",
        };
        return days[day] || day;
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando información de la tienda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container store-profile-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <Link to="/seller/dashboard" className="back-button">
                        <i className="fa fa-arrow-left"></i>
                        Regresar al Dashboard
                    </Link>
                    <h1>🏪 Mi Tienda</h1>
                    <p>Configura el perfil y la información de tu tienda</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn-edit-store">
                        <i className="fa fa-edit"></i>
                        Editar Información
                    </button>
                ) : (
                    <div className="edit-actions">
                        <button onClick={handleSave} className="btn-save">
                            <i className="fa fa-save"></i>
                            Guardar Cambios
                        </button>
                        <button onClick={handleCancel} className="btn-cancel">
                            <i className="fa fa-times"></i>
                            Cancelar
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <div className="tabs-nav">
                    <button
                        className={`tab-button ${activeTab === "general" ? "active" : ""}`}
                        onClick={() => setActiveTab("general")}
                    >
                        <i className="fa fa-info-circle"></i>
                        Información General
                    </button>
                    <button
                        className={`tab-button ${activeTab === "contact" ? "active" : ""}`}
                        onClick={() => setActiveTab("contact")}
                    >
                        <i className="fa fa-address-book"></i>
                        Contacto y Ubicación
                    </button>
                    <button
                        className={`tab-button ${activeTab === "social" ? "active" : ""}`}
                        onClick={() => setActiveTab("social")}
                    >
                        <i className="fa fa-share-alt"></i>
                        Redes Sociales
                    </button>
                    <button
                        className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <i className="fa fa-cog"></i>
                        Configuración
                    </button>
                </div>

                <div className="tabs-content">
                    {/* General */}
                    {activeTab === "general" && (
                        <div className="tab-panel">
                            <div className="section-card">
                                <h2>📋 Información General del Negocio</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre del Negocio *</label>
                                        <input
                                            type="text"
                                            value={storeData.businessName}
                                            onChange={(e) => handleInputChange(null, "businessName", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="Nombre de tu tienda o negocio"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Categoría del Negocio</label>
                                        <select
                                            value={storeData.businessInfo.category}
                                            onChange={(e) => handleInputChange("businessInfo", "category", e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {businessCategories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Descripción de la Tienda</label>
                                        <textarea
                                            value={storeData.description}
                                            onChange={(e) => handleInputChange(null, "description", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="Describe tu tienda, productos y lo que te hace especial..."
                                            rows="4"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Año de Fundación</label>
                                        <input
                                            type="number"
                                            value={storeData.businessInfo.foundedYear}
                                            onChange={(e) => handleInputChange("businessInfo", "foundedYear", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="2020"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Número de Empleados</label>
                                        <select
                                            value={storeData.businessInfo.employees}
                                            onChange={(e) => handleInputChange("businessInfo", "employees", e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Selecciona</option>
                                            <option value="1">Solo yo</option>
                                            <option value="2-5">2-5 empleados</option>
                                            <option value="6-10">6-10 empleados</option>
                                            <option value="11+">Más de 10 empleados</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Especialidades</label>
                                        <div className="specialties-grid">
                                            {businessCategories.map((specialty) => (
                                                <label key={specialty} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={storeData.businessInfo.specialties?.includes(specialty) || false}
                                                        onChange={() => handleSpecialtiesChange(specialty)}
                                                        disabled={!isEditing}
                                                    />
                                                    <span>{specialty}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contacto y Ubicación */}
                    {activeTab === "contact" && (
                        <div className="tab-panel">
                            <div className="section-card">
                                <h2>📞 Información de Contacto</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Correo Electrónico *</label>
                                        <input
                                            type="email"
                                            value={storeData.contact.email}
                                            onChange={(e) => handleInputChange("contact", "email", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="tu-email@ejemplo.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            value={storeData.contact.phone}
                                            onChange={(e) => handleInputChange("contact", "phone", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="+506 8888-8888"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={storeData.contact.whatsapp}
                                            onChange={(e) => handleInputChange("contact", "whatsapp", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="+506 8888-8888"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Sitio Web</label>
                                        <input
                                            type="url"
                                            value={storeData.contact.website}
                                            onChange={(e) => handleInputChange("contact", "website", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="https://tu-sitio.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="section-card">
                                <h2>📍 Ubicación del Negocio</h2>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Dirección</label>
                                        <input
                                            type="text"
                                            value={storeData.location.address}
                                            onChange={(e) => handleInputChange("location", "address", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="Dirección completa de tu negocio"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Ciudad</label>
                                        <input
                                            type="text"
                                            value={storeData.location.city}
                                            onChange={(e) => handleInputChange("location", "city", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="Ciudad"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Provincia</label>
                                        <select
                                            value={storeData.location.province}
                                            onChange={(e) => handleInputChange("location", "province", e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Selecciona una provincia</option>
                                            {provinces.map((province) => (
                                                <option key={province} value={province}>
                                                    {province}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>País</label>
                                        <input
                                            type="text"
                                            value={storeData.location.country}
                                            onChange={(e) => handleInputChange("location", "country", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="Costa Rica"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social */}
                    {activeTab === "social" && (
                        <div className="tab-panel">
                            <div className="section-card">
                                <h2>📱 Redes Sociales</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>
                                            <i className="fab fa-facebook"></i> Facebook
                                        </label>
                                        <input
                                            type="url"
                                            value={storeData.socialMedia.facebook}
                                            onChange={(e) => handleInputChange("socialMedia", "facebook", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="https://facebook.com/tu-pagina"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <i className="fab fa-instagram"></i> Instagram
                                        </label>
                                        <input
                                            type="url"
                                            value={storeData.socialMedia.instagram}
                                            onChange={(e) => handleInputChange("socialMedia", "instagram", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="https://instagram.com/tu-usuario"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <i className="fab fa-twitter"></i> Twitter
                                        </label>
                                        <input
                                            type="url"
                                            value={storeData.socialMedia.twitter}
                                            onChange={(e) => handleInputChange("socialMedia", "twitter", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="https://twitter.com/tu-usuario"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <i className="fab fa-tiktok"></i> TikTok
                                        </label>
                                        <input
                                            type="url"
                                            value={storeData.socialMedia.tiktok}
                                            onChange={(e) => handleInputChange("socialMedia", "tiktok", e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="https://tiktok.com/@tu-usuario"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {activeTab === "settings" && (
                        <div className="tab-panel">
                            <div className="section-card">
                                <h2>⚙️ Configuración del Negocio</h2>
                                <div className="settings-grid">
                                    <div className="setting-item">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={storeData.settings.acceptsCustomOrders}
                                                onChange={(e) =>
                                                    handleInputChange("settings", "acceptsCustomOrders", e.target.checked)
                                                }
                                                disabled={!isEditing}
                                            />
                                            <span>Acepto pedidos personalizados</span>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Monto mínimo de pedido (₡)</label>
                                        <input
                                            type="number"
                                            value={storeData.settings.minOrderAmount}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "settings",
                                                    "minOrderAmount",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            disabled={!isEditing}
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="section-card">
                                <h2>🕒 Horarios de Atención</h2>
                                <div className="working-hours">
                                    {Object.entries(storeData.settings.workingHours).map(([day, hours]) => (
                                        <div key={day} className="day-hours">
                                            <div className="day-name">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={hours.enabled}
                                                        onChange={(e) => handleWorkingHoursChange(day, "enabled", e.target.checked)}
                                                        disabled={!isEditing}
                                                    />
                                                    <span>{getDayName(day)}</span>
                                                </label>
                                            </div>
                                            {hours.enabled ? (
                                                <div className="time-inputs">
                                                    <input
                                                        type="time"
                                                        value={hours.open}
                                                        onChange={(e) => handleWorkingHoursChange(day, "open", e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                    <span>a</span>
                                                    <input
                                                        type="time"
                                                        value={hours.close}
                                                        onChange={(e) => handleWorkingHoursChange(day, "close", e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="closed">Cerrado</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Vista previa */}
            {!isEditing && (
                <div className="section-card store-preview">
                    <h2>👁️ Vista Previa del Perfil</h2>
                    <div className="preview-content">
                        <div className="store-header">
                            <div className="store-logo">
                                <i className="fa fa-store"></i>
                            </div>
                            <div className="store-info">
                                <h3>{storeData.businessName || "Nombre de la Tienda"}</h3>
                                <p className="store-category">{storeData.businessInfo.category}</p>
                                <p className="store-description">{storeData.description}</p>
                            </div>
                        </div>

                        <div className="store-details">
                            {storeData.contact.email && (
                                <div className="detail-item">
                                    <i className="fa fa-envelope"></i>
                                    <span>{storeData.contact.email}</span>
                                </div>
                            )}
                            {storeData.contact.phone && (
                                <div className="detail-item">
                                    <i className="fa fa-phone"></i>
                                    <span>{storeData.contact.phone}</span>
                                </div>
                            )}
                            {storeData.location.address && (
                                <div className="detail-item">
                                    <i className="fa fa-map-marker-alt"></i>
                                    <span>
                                        {storeData.location.address}
                                        {storeData.location.city ? `, ${storeData.location.city}` : ""}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="social-links">
                            {storeData.socialMedia.facebook && (
                                <a href={storeData.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook"></i>
                                </a>
                            )}
                            {storeData.socialMedia.instagram && (
                                <a href={storeData.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            )}
                            {storeData.socialMedia.twitter && (
                                <a href={storeData.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            )}
                            {storeData.socialMedia.tiktok && (
                                <a href={storeData.socialMedia.tiktok} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-tiktok"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
