// src/pages/ShopPage.js
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/shop.css";
import { ShopAPI } from "../api/shop.service";
import { resolveImgUrl } from "../utils/resolveImgUrl";
import noImage from "../assets/images/noimage.png";

// ---- Helpers ----

// 1) Primera imagen válida
const firstImg = (p) => {
    const candidate = Array.isArray(p?.images) && p.images.length
        ? p.images.find(Boolean)
        : p?.image || p?.img || p?.thumbnail || null;
    return candidate ? String(candidate).replace(/\\/g, "/") : null;
};

// 2) Normalizar categoría que viene del backend (en inglés)
const normalizeCategory = (cat) => {
    const c = String(cat || "").toLowerCase();
    const map = {
        jewelery: "joyeria",
        jewelry: "joyeria",
        art: "pintura",
        paintings: "pintura",
        ceramics: "ceramica",
        ceramic: "ceramica",
        textiles: "textil",
        textile: "textil",
        decoration: "decoracion",
        decor: "decoracion",
        bags: "bolsos",
        bag: "bolsos",
        wood: "escultura",       // si luego querés 'madera', cambiá aquí y en el sidebar
        sculpture: "escultura",
        esculturas: "escultura",
    };
    return map[c] || c || "otros";
};

// 3) Etiqueta bonita para mostrar en UI (es-CR)
const categoryLabel = (id) => {
    const map = {
        todos: "Todos los productos",
        textil: "Textil",
        joyeria: "Joyería",
        pintura: "Pintura",
        ceramica: "Cerámica",
        escultura: "Escultura",
        bolsos: "Bolsos",
        decoracion: "Decoración",
        otros: "Otros",
    };
    return map[id] || (id ? id[0].toUpperCase() + id.slice(1) : "Otros");
};

// 4) Emoji por categoría (cosmético)
const categoryIcon = (id) => {
    const map = {
        textil: "🧵",
        joyeria: "💎",
        pintura: "🎨",
        ceramica: "🏺",
        escultura: "🗿",
        bolsos: "👜",
        decoracion: "🖼️",
        otros: "🪄",
    };
    return map[id] || "🎨";
};

// 5) Formatear CRC
const fmtCRC = (n) =>
    typeof n === "number" ? `₡${n.toLocaleString("es-CR")}` : String(n || "");

// 6) Obtener precio numérico para el carrito, venga como venga
const getNumericPrice = (p) => {
    if (typeof p?.numericPrice === "number") return p.numericPrice;
    if (typeof p?.price === "number") return p.price;
    if (typeof p?.price === "string") {
        // "₡12.000" -> 12000
        const digits = p.price.replace(/[^\d]/g, "");
        return Number(digits || 0);
    }
    return 0;
};

// ---- Mock de respaldo si la API falla (mantengo tus textos) ----
const mockProducts = [
    { id: 1, name: "Collar artesanal de semillas", price: "₡12.000", numericPrice: 12000, category: "joyeria", description: "Hermoso collar hecho con semillas naturales costarricenses" },
    { id: 2, name: "Bolso tejido a mano", price: "₡18.500", numericPrice: 18500, category: "textil", description: "Bolso tradicional tejido por artesanas locales" },
    { id: 3, name: "Cuadro colorido abstracto", price: "₡22.000", numericPrice: 22000, category: "pintura", description: "Pintura original inspirada en la naturaleza de Costa Rica" },
    { id: 4, name: "Vasija de cerámica tradicional", price: "₡15.800", numericPrice: 15800, category: "ceramica", description: "Vasija elaborada con técnicas ancestrales de alfarería" },
    { id: 5, name: "Aretes de madera tallada", price: "₡8.500", numericPrice: 8500, category: "joyeria", description: "Aretes únicos tallados en madera de guanacaste" },
    { id: 6, name: "Manteles bordados", price: "₡25.000", numericPrice: 25000, category: "textil", description: "Manteles con bordados tradicionales hechos a mano" },
    { id: 7, name: "Escultura de madera", price: "₡35.000", numericPrice: 35000, category: "escultura", description: "Escultura artística tallada en madera preciosa" },
    { id: 8, name: "Pulsera de semillas naturales", price: "₡6.500", numericPrice: 6500, category: "joyeria", description: "Pulsera delicada hecha con semillas del bosque tropical" },
    { id: 9, name: "Cojines decorativos", price: "₡14.000", numericPrice: 14000, category: "textil", description: "Cojines con diseños típicos costarricenses" },
    { id: 10, name: "Tazas de cerámica artesanal", price: "₡9.800", numericPrice: 9800, category: "ceramica", description: "Set de tazas únicas hechas en torno de alfarero" },
    { id: 11, name: "Cuadro paisaje costarricense", price: "₡28.000", numericPrice: 28000, category: "pintura", description: "Paisaje inspirado en los volcanes de Costa Rica" },
    { id: 12, name: "Canasta tejida tradicional", price: "₡16.500", numericPrice: 16500, category: "textil", description: "Canasta funcional tejida con fibras naturales" },
];

export const ShopPage = () => {
    // Estado
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [addingToCart, setAddingToCart] = useState(null);
    const [error, setError] = useState("");

    // Cargar carrito al iniciar
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("artesjac-cart");
            if (savedCart && savedCart !== "null" && savedCart !== "[]") {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (e) {
            console.error("Error al cargar carrito:", e);
        }
    }, []);

    // Cargar productos desde backend (fallback a mock si falla)
    useEffect(() => {
        (async () => {
            setError("");
            try {
                const res = await ShopAPI.list({ limit: 200 });
                const list = Array.isArray(res?.data?.data) ? res.data.data : [];
                // Mapeo: normalizo categoría y defino campos de compatibilidad
                const normalized = list.map((p) => ({
                    ...p,
                    _normalizedCategory: normalizeCategory(p.category),
                    _displayName: p.title || p.name || "Producto",
                    _displayPrice: fmtCRC(typeof p.price === "number" ? p.price : p.price),
                }));
                setProducts(normalized);
            } catch (e) {
                console.error(e);
                setError("No se pudieron cargar los productos. Mostrando datos de ejemplo.");
                // Mock: también normalizo para que filtros funcionen
                const normalizedMock = mockProducts.map((p) => ({
                    ...p,
                    _normalizedCategory: normalizeCategory(p.category),
                    _displayName: p.name,
                    _displayPrice: p.price,
                }));
                setProducts(normalizedMock);
            }
        })();
    }, []);

    // Filtrar por categoría y búsqueda
    useEffect(() => {
        let list = products;

        if (selectedCategory !== "todos") {
            list = list.filter((p) => p._normalizedCategory === selectedCategory);
        }

        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            list = list.filter((p) => {
                const name = (p._displayName || "").toLowerCase();
                const desc = (p.description || "").toLowerCase();
                return name.includes(s) || desc.includes(s);
            });
        }

        setFilteredProducts(list);
    }, [selectedCategory, searchTerm, products]);

    // Conteo de categorías dinamico
    const categories = useMemo(() => {
        const counts = {
            textil: 0,
            joyeria: 0,
            pintura: 0,
            ceramica: 0,
            escultura: 0,
            bolsos: 0,
            decoracion: 0,
            otros: 0,
        };
        products.forEach((p) => {
            const key = p._normalizedCategory || "otros";
            if (counts[key] !== undefined) counts[key] += 1;
            else counts.otros += 1;
        });
        const base = [
            "todos",
            "textil",
            "joyeria",
            "pintura",
            "ceramica",
            "escultura",
            "bolsos",
            "decoracion",
            "otros",
        ];
        return base.map((id) => ({
            id,
            name: categoryLabel(id),
            count: id === "todos" ? products.length : counts[id],
            icon: categoryIcon(id),
        }));
    }, [products]);

    // Imagen final o fallback
    const getImgSrc = (p) => {
        const candidate = firstImg(p);
        if (!candidate) return noImage;
        try {
            return resolveImgUrl(candidate) || noImage;
        } catch {
            return noImage;
        }
    };

    // Agregar al carrito (compatibilidad con mock y API)
    const addToCart = async (product) => {
        // ID de carrito: _id o id o slug
        const itemId = product._id || product.id || product.slug;
        setAddingToCart(itemId);

        try {
            const savedCart = localStorage.getItem("artesjac-cart");
            let currentCart = savedCart && savedCart !== "null" ? JSON.parse(savedCart) : [];

            const idx = currentCart.findIndex((it) => it.id === itemId);
            if (idx > -1) {
                currentCart[idx].quantity = (currentCart[idx].quantity || 1) + 1;
            } else {
                currentCart.push({
                    id: itemId,
                    productId: itemId,
                    slug: product.slug,
                    name: product._displayName, // para UIs previas
                    title: product._displayName,
                    quantity: 1,
                    image: firstImg(product),
                    category: product._normalizedCategory,
                    numericPrice: getNumericPrice(product),
                    price: product.price,
                });
            }

            localStorage.setItem("artesjac-cart", JSON.stringify(currentCart));
            setCartItems(currentCart);

            // Notificación
            await new Promise((r) => setTimeout(r, 500));
            const notification = document.createElement("div");
            notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white; padding: 1rem 1.5rem; border-radius: 8px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 1000; font-weight: bold; animation: slideIn 0.3s ease;
      `;
            notification.innerHTML = `✅ ${product._displayName} agregado al carrito!`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            alert("Error al agregar el producto al carrito");
        } finally {
            setAddingToCart(null);
        }
    };

    // Totales del carrito
    const calculateCartTotal = () =>
        cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);

    const getTotalCartItems = () =>
        cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <main className="shop-container">
            {/* Header */}
            <div className="shop-header">
                <h1>Tienda ArtesJAC</h1>
                <p>Descubre arte auténtico costarricense hecho a mano por talentosos artesanos locales</p>
            </div>

            {/* Indicador carrito */}
            <div className="cart-indicator">
                <div className="cart-indicator-info">
                    <i className="fa fa-shopping-cart"></i>
                    <span>
                        {getTotalCartItems()} producto{getTotalCartItems() !== 1 ? "s" : ""} en el carrito -{" "}
                        Total: {fmtCRC(calculateCartTotal())}
                    </span>
                </div>
                <Link to="/cart" className="view-cart-btn">
                    <i className="fa fa-arrow-right"></i> Ver Carrito
                </Link>
            </div>

            {/* Buscador */}
            <div className="shop-search">
                <input
                    type="text"
                    placeholder="🔍 Buscar productos, categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="shop-content">
                {/* Sidebar categorías */}
                <aside className="shop-sidebar">
                    <h3>📂 Categorías</h3>
                    <div className="category-filters">
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                className={`category-btn ${selectedCategory === c.id ? "active" : ""}`}
                                onClick={() => setSelectedCategory(c.id)}
                            >
                                <span style={{ marginRight: "0.5rem" }}>{c.icon}</span>
                                {c.name} ({c.count})
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Grid de productos */}
                <section className="products-section">
                    <div className="products-header">
                        <h2>
                            {selectedCategory === "todos"
                                ? "🎨 Todos los productos"
                                : `${categoryIcon(selectedCategory)} ${categoryLabel(selectedCategory)}`}
                        </h2>
                        <span className="products-count">{filteredProducts.length} productos</span>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: 16 }}>
                            <i className="fa fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="products-grid">
                        {filteredProducts.map((p) => {
                            // Clave estable
                            const key = p.slug || p._id || p.id;
                            // Href: preferimos slug; si no hay (mock), usamos id
                            const href = p.slug ? `/p/${p.slug}` : `/product/${p.id}`;
                            // Nombre y precio display
                            const name = p._displayName;
                            const price = fmtCRC(typeof p.price === "number" ? p.price : p.price);

                            return (
                                <div key={key} className="product-card">
                                    <div className="product-media">
                                        <img
                                            src={getImgSrc(p)}
                                            alt={`Imagen de ${name}`}
                                            className="product-thumb"
                                            loading="lazy"
                                            decoding="async"
                                            referrerPolicy="no-referrer"
                                            crossOrigin="anonymous"
                                            onError={(e) => {
                                                if (e.currentTarget.dataset.fallback === "1") return;
                                                e.currentTarget.dataset.fallback = "1";
                                                e.currentTarget.src = noImage;
                                            }}
                                        />
                                    </div>

                                    <div className="product-info">
                                        <h3 className="product-name">{name}</h3>
                                        <p className="product-price">{price}</p>
                                        <p className="product-category">
                                            {categoryIcon(p._normalizedCategory)} {categoryLabel(p._normalizedCategory)}
                                        </p>
                                    </div>

                                    <div className="product-actions">
                                        <button
                                            className="btn-add-to-cart"
                                            onClick={() => addToCart(p)}
                                            disabled={addingToCart === (p._id || p.id || p.slug)}
                                        >
                                            {addingToCart === (p._id || p.id || p.slug) ? (
                                                <>
                                                    <i className="fa fa-spinner fa-spin"></i>
                                                    Agregando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-shopping-cart"></i>
                                                    Agregar al carrito
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            to={href}
                                            className="btn-view-details"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <i className="fa fa-eye"></i>
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <i
                                className="fa fa-search"
                                style={{ fontSize: "3rem", color: "#666", marginBottom: "1rem" }}
                            ></i>
                            <h3>No se encontraron productos</h3>
                            <p>
                                {searchTerm
                                    ? `No hay productos que coincidan con "${searchTerm}"`
                                    : "No hay productos en esta categoría"}
                            </p>
                            <p>Intenta cambiar los filtros o el término de búsqueda</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Animación notificación */}
            <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </main>
    );
};
