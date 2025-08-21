// src/pages/seller/SellerInventory.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import "../../styles/dashboard.css";
import "../../styles/inventory.css";
import { ProductsAPI } from "../../api/products.service";
import { resolveImgUrl } from "../../utils/resolveImgUrl";
import noImage from "../../assets/images/noimage.png"; // ⬅️ Fallback local

// ---- Helpers ----
const isEmptyLike = (v) => {
    if (v == null) return true;
    const s = String(v).trim().toLowerCase();
    return s === "" || s === "null" || s === "undefined";
};
const normalizePath = (s) => String(s || "").replace(/\\/g, "/").trim();

// Devuelve una URL válida o el fallback local
const resolveUrlOrFallback = (maybeUrl) => {
    try {
        if (isEmptyLike(maybeUrl)) return noImage;
        const raw = normalizePath(maybeUrl);
        if (raw.startsWith("data:")) return raw; // soporta base64
        const url = resolveImgUrl(raw);
        return isEmptyLike(url) ? noImage : url;
    } catch {
        return noImage;
    }
};

// ---- Componente Img con fallback robusto ----
const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(resolveUrlOrFallback(src));
    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => {
                if (imgSrc !== noImage) setImgSrc(noImage); // evita loop
            }}
        />
    );
};

export const SellerInventory = () => {


    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        status: "active",
        imageUrl: "",
    });

    const categories = [
        { value: "all", label: "Todas las categorías" },
        { value: "jewelery", label: "Joyería" },
        { value: "bags", label: "Bolsos y Accesorios" },
        { value: "decoration", label: "Decoración" },
        { value: "art", label: "Arte" },
        { value: "ceramics", label: "Cerámica" },
        { value: "textiles", label: "Textiles" },
        { value: "sculpture", label: "Escultura" },
        { value: "others", label: "Otros" },
    ];

    // 🔧 Cargar MIS productos (endpoint correcto)
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await ProductsAPI.mine({ page: 1, limit: 100 });
            const list = res?.data?.data || [];

            // Mapear del backend al estado de la UI
            const mapped = list.map((p) => {
                const uiStatus =
                    (Number(p.stock) || 0) === 0
                        ? "out_of_stock"
                        : p.status === "draft"
                            ? "inactive"
                            : "active";

                // primera imagen válida (array o string)
                const rawFirst = Array.isArray(p.images)
                    ? p.images.find((x) => !isEmptyLike(x))
                    : p.images;
                const img = isEmptyLike(rawFirst) ? "" : normalizePath(rawFirst);

                return {
                    id: p._id || p.id,
                    name: p.title,
                    description: p.description || "",
                    price: Number(p.price) || 0,
                    stock: Number(p.stock) || 0,
                    category: p.category || "",
                    status: uiStatus,
                    imageUrl: img, // se resuelve en el <img/>
                    createdAt: p.createdAt,
                    lastUpdated: p.updatedAt || p.createdAt,
                };
            });

            setProducts(mapped);
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.error || "Error cargando productos");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        let filtered = [...products];

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(q) ||
                    (product.description || "").toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter((product) => product.category === selectedCategory);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "price":
                    return a.price - b.price;
                case "stock":
                    return b.stock - a.stock;
                case "date":
                    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, selectedCategory, sortBy]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Guardar (crear/actualizar)
    const handleSaveProduct = async () => {
        // Normalizar estado UI -> schema
        let status = formData.status || "active";
        let stock = Number(formData.stock || 0);

        if (status === "inactive") status = "draft"; // UI "Inactivo" => schema "draft"
        if (status === "out_of_stock") {
            status = "active"; // UI "Sin stock" => schema "active" + stock=0
            stock = 0;
        }

        const payload = {
            title: formData.name,
            description: formData.description || "",
            price: Number(formData.price || 0),
            stock,
            category: formData.category || "",
            status, // "draft" | "active"
            images: !isEmptyLike(formData.imageUrl) ? [normalizePath(formData.imageUrl)] : [],
        };

        try {
            if (editingProduct) {
                await ProductsAPI.update(editingProduct.id, payload);
            } else {
                await ProductsAPI.create(payload);
            }
            await loadProducts();
            setShowModal(false);
            setEditingProduct(null);
            resetForm();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.error || "Error guardando producto");
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description,
            price: String(product.price ?? ""),
            stock: String(product.stock ?? ""),
            category: product.category,
            status: product.status, // "active" | "inactive" | "out_of_stock"
            imageUrl: product.imageUrl || "",
        });
        setShowModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("¿Eliminar este producto?")) return;
        try {
            await ProductsAPI.remove(productId);
            await loadProducts();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.error || "Error eliminando producto");
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            status: "active",
            imageUrl: "",
        });
    };

    const openAddModal = () => {
        resetForm();
        setEditingProduct(null);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "#4caf50";
            case "inactive":
                return "#9e9e9e";
            case "out_of_stock":
                return "#f44336";
            default:
                return "#666";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "active":
                return "Activo";
            case "inactive":
                return "Inactivo";
            case "out_of_stock":
                return "Sin Stock";
            default:
                return status;
        }
    };

    const getCategoryLabel = (category) => {
        const cat = categories.find((c) => c.value === category);
        return cat ? cat.label : category;
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando inventario...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container inventory-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <Link to="/seller/dashboard" className="back-button">
                        <i className="fa fa-arrow-left"></i>
                        Regresar al Dashboard
                    </Link>
                    <h1>📦 Gestión de Inventario</h1>
                    <p>Administra todos tus productos</p>
                </div>
                <button onClick={openAddModal} className="btn-add-product">
                    <i className="fa fa-plus"></i>
                    Agregar Producto
                </button>
            </div>

            {/* Controles y Filtros */}
            <div className="inventory-controls">
                <div className="search-section">
                    <div className="search-box">
                        <i className="fa fa-search"></i>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-section">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="name">Ordenar por Nombre</option>
                        <option value="price">Ordenar por Precio</option>
                        <option value="stock">Ordenar por Stock</option>
                        <option value="date">Ordenar por Fecha</option>
                    </select>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="inventory-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fa fa-boxes"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{products.length}</h3>
                        <p>Total Productos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon active">
                        <i className="fa fa-check-circle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{products.filter((p) => p.status === "active").length}</h3>
                        <p>Productos Activos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon out-stock">
                        <i className="fa fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{products.filter((p) => p.stock === 0).length}</h3>
                        <p>Sin Stock</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon total-value">
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                        <h3>
                            ₡
                            {products
                                .reduce((total, p) => total + p.price * p.stock, 0)
                                .toLocaleString()}
                        </h3>
                        <p>Valor Inventario</p>
                    </div>
                </div>
            </div>

            {/* Tabla de Productos */}
            <div className="section-card products-table-card">
                <div className="section-header">
                    <h2>📋 Lista de Productos</h2>
                    <span className="products-count">{filteredProducts.length} productos</span>
                </div>

                <div className="products-table-container">
                    <div className="products-table">
                        <div className="table-header">
                            <div className="header-cell">Producto</div>
                            <div className="header-cell">Categoría</div>
                            <div className="header-cell">Precio</div>
                            <div className="header-cell">Stock</div>
                            <div className="header-cell">Estado</div>
                            <div className="header-cell">Acciones</div>
                        </div>

                        {filteredProducts.map((product) => (
                            <div key={product.id} className="table-row product-row">
                                <div className="table-cell product-info">
                                    <div className="product-image">
                                        <ImageWithFallback
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="product-thumb"
                                        />
                                    </div>

                                    <div className="product-details">
                                        <h4>{product.name}</h4>
                                        <p>{(product.description || "").substring(0, 60)}...</p>
                                    </div>
                                </div>

                                <div className="table-cell category">
                                    <span className="category-badge">
                                        {getCategoryLabel(product.category)}
                                    </span>
                                </div>

                                <div className="table-cell price">
                                    ₡{product.price.toLocaleString()}
                                </div>

                                <div className="table-cell stock">
                                    <span
                                        className={`stock-badge ${product.stock === 0
                                            ? "no-stock"
                                            : product.stock <= 5
                                                ? "low-stock"
                                                : "good-stock"
                                            }`}
                                    >
                                        {product.stock} unidades
                                    </span>
                                </div>

                                <div className="table-cell status">
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(product.status) }}
                                    >
                                        {getStatusText(product.status)}
                                    </span>
                                </div>

                                <div className="table-cell actions">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="btn-action edit"
                                        title="Editar"
                                    >
                                        <i className="fa fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="btn-action delete"
                                        title="Eliminar"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="empty-state">
                                <i className="fa fa-box-open"></i>
                                <h3>No hay productos</h3>
                                <p>No se encontraron productos con los filtros aplicados</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Agregar/Editar */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close">
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre del Producto</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Ingresa el nombre del producto"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.slice(1).map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Precio (₡)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe tu producto..."
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Estado</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                        <option value="out_of_stock">Sin Stock</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>URL de Imagen (opcional)</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://ejemplo.com/imagen.jpg o /uploads/archivo.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setShowModal(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={handleSaveProduct} className="btn-save">
                                <i className="fa fa-save"></i>
                                {editingProduct ? "Actualizar" : "Guardar"} Producto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerInventory;
