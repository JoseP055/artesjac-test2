import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/shop.css';

export const ShopPage = () => {
    const [products] = useState([
        {
            id: 1,
            name: "Collar artesanal de semillas",
            price: "₡12.000",
            numericPrice: 12000,
            category: "joyeria",
            description: "Hermoso collar hecho con semillas naturales costarricenses"
        },
        {
            id: 2,
            name: "Bolso tejido a mano",
            price: "₡18.500",
            numericPrice: 18500,
            category: "textil",
            description: "Bolso tradicional tejido por artesanas locales"
        },
        {
            id: 3,
            name: "Cuadro colorido abstracto",
            price: "₡22.000",
            numericPrice: 22000,
            category: "pintura",
            description: "Pintura original inspirada en la naturaleza de Costa Rica"
        },
        {
            id: 4,
            name: "Vasija de cerámica tradicional",
            price: "₡15.800",
            numericPrice: 15800,
            category: "ceramica",
            description: "Vasija elaborada con técnicas ancestrales de alfarería"
        },
        {
            id: 5,
            name: "Aretes de madera tallada",
            price: "₡8.500",
            numericPrice: 8500,
            category: "joyeria",
            description: "Aretes únicos tallados en madera de guanacaste"
        },
        {
            id: 6,
            name: "Manteles bordados",
            price: "₡25.000",
            numericPrice: 25000,
            category: "textil",
            description: "Manteles con bordados tradicionales hechos a mano"
        },
        {
            id: 7,
            name: "Escultura de madera",
            price: "₡35.000",
            numericPrice: 35000,
            category: "escultura",
            description: "Escultura artística tallada en madera preciosa"
        },
        {
            id: 8,
            name: "Pulsera de semillas naturales",
            price: "₡6.500",
            numericPrice: 6500,
            category: "joyeria",
            description: "Pulsera delicada hecha con semillas del bosque tropical"
        },
        {
            id: 9,
            name: "Cojines decorativos",
            price: "₡14.000",
            numericPrice: 14000,
            category: "textil",
            description: "Cojines con diseños típicos costarricenses"
        },
        {
            id: 10,
            name: "Tazas de cerámica artesanal",
            price: "₡9.800",
            numericPrice: 9800,
            category: "ceramica",
            description: "Set de tazas únicas hechas en torno de alfarero"
        },
        {
            id: 11,
            name: "Cuadro paisaje costarricense",
            price: "₡28.000",
            numericPrice: 28000,
            category: "pintura",
            description: "Paisaje inspirado en los volcanes de Costa Rica"
        },
        {
            id: 12,
            name: "Canasta tejida tradicional",
            price: "₡16.500",
            numericPrice: 16500,
            category: "textil",
            description: "Canasta funcional tejida con fibras naturales"
        }
    ]);

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [addingToCart, setAddingToCart] = useState(null);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem('artesjac-cart');
                if (savedCart && savedCart !== 'null' && savedCart !== '[]') {
                    const cart = JSON.parse(savedCart);
                    setCartItems(cart);
                }
            } catch (error) {
                console.error('Error al cargar carrito:', error);
            }
        };
        loadCart();
    }, []);

    // Filtrar productos por categoría y búsqueda
    useEffect(() => {
        let filtered = products;

        // Filtrar por categoría
        if (selectedCategory !== 'todos') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, searchTerm, products]);

    // Función para agregar al carrito con animación
    const addToCart = async (product) => {
        setAddingToCart(product.id);
        
        try {
            const savedCart = localStorage.getItem('artesjac-cart');
            let currentCart = [];

            if (savedCart && savedCart !== 'null') {
                currentCart = JSON.parse(savedCart);
            }

            // Verificar si el producto ya está en el carrito
            const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                // Si ya existe, incrementar cantidad
                currentCart[existingItemIndex].quantity += 1;
            } else {
                // Si no existe, agregarlo con cantidad 1
                currentCart.push({
                    ...product,
                    quantity: 1
                });
            }

            // Guardar en localStorage
            localStorage.setItem('artesjac-cart', JSON.stringify(currentCart));
            setCartItems(currentCart);

            // Simular delay para animación
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mostrar confirmación más elegante
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4caf50, #45a049);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                z-index: 1000;
                font-weight: bold;
                animation: slideIn 0.3s ease;
            `;
            notification.innerHTML = `✅ ${product.name} agregado al carrito!`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);

            console.log('Producto agregado:', product);
            console.log('Carrito actualizado:', currentCart);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito');
        } finally {
            setAddingToCart(null);
        }
    };

    // Calcular total del carrito
    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.numericPrice * item.quantity), 0);
    };

    // Calcular total de items en carrito
    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const categories = [
        { id: 'todos', name: 'Todos los productos', count: products.length, icon: '🎨' },
        { id: 'textil', name: 'Textil', count: products.filter(p => p.category === 'textil').length, icon: '🧵' },
        { id: 'joyeria', name: 'Joyería', count: products.filter(p => p.category === 'joyeria').length, icon: '💎' },
        { id: 'pintura', name: 'Pintura', count: products.filter(p => p.category === 'pintura').length, icon: '🎨' },
        { id: 'ceramica', name: 'Cerámica', count: products.filter(p => p.category === 'ceramica').length, icon: '🏺' },
        { id: 'escultura', name: 'Escultura', count: products.filter(p => p.category === 'escultura').length, icon: '🗿' }
    ];

    return (
        <main className="shop-container">
            {/* Header de la tienda */}
            <div className="shop-header">
                <h1>Tienda ArtesJAC</h1>
                <p>Descubre arte auténtico costarricense hecho a mano por talentosos artesanos locales</p>
            </div>

            {/* Indicador del carrito mejorado */}
            <div className="cart-indicator">
                <div className="cart-indicator-info">
                    <i className="fa fa-shopping-cart"></i>
                    <span>
                        {getTotalCartItems()} producto{getTotalCartItems() !== 1 ? 's' : ''} en el carrito - 
                        Total: ₡{calculateCartTotal().toLocaleString()}
                    </span>
                </div>
                <Link to="/cart" className="view-cart-btn">
                    <i className="fa fa-arrow-right"></i> Ver Carrito
                </Link>
            </div>

            {/* Buscador mejorado */}
            <div className="shop-search">
                <input
                    type="text"
                    placeholder="🔍 Buscar productos, categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="shop-content">
                {/* Sidebar de categorías mejorado */}
                <aside className="shop-sidebar">
                    <h3>📂 Categorías</h3>
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span style={{marginRight: '0.5rem'}}>{category.icon}</span>
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Grid de productos mejorado */}
                <section className="products-section">
                    <div className="products-header">
                        <h2>
                            {selectedCategory === 'todos' ? '🎨 Todos los productos' :
                             `${categories.find(c => c.id === selectedCategory)?.icon} ${categories.find(c => c.id === selectedCategory)?.name}`}
                        </h2>
                        <span className="products-count">{filteredProducts.length} productos</span>
                    </div>

                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <div className="product-image-sim">
                                        <span style={{fontSize: '0.9rem', color: '#888'}}>
                                            Imagen de {product.name}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{product.price}</p>
                                    <p className="product-category">
                                        {categories.find(c => c.id === product.category)?.icon} {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                    </p>
                                </div>

                                <div className="product-actions">
                                    <button
                                        className="btn-add-to-cart"
                                        onClick={() => addToCart(product)}
                                        disabled={addingToCart === product.id}
                                    >
                                        {addingToCart === product.id ? (
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
                                        to={`/product/${product.id}`} 
                                        className="btn-view-details"
                                        style={{textDecoration: 'none'}}
                                    >
                                        <i className="fa fa-eye"></i>
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <i className="fa fa-search" style={{fontSize: '3rem', color: '#666', marginBottom: '1rem'}}></i>
                            <h3>No se encontraron productos</h3>
                            <p>
                                {searchTerm ? 
                                    `No hay productos que coincidan con "${searchTerm}"` :
                                    'No hay productos en esta categoría'
                                }
                            </p>
                            <p>Intenta cambiar los filtros o el término de búsqueda</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Estilos para la animación de notificación */}
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