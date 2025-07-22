import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/shop.css';

export const ShopPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        if (categoryParam) setSelectedCategory(categoryParam);
        if (searchParam) setSearchTerm(searchParam);
    }, [location.search]);

    const products = [
        { id: 1, name: 'Collar artesanal de semillas', price: '₡12.000', category: 'joyeria' },
        { id: 2, name: 'Bolso tejido a mano', price: '₡18.500', category: 'textil' },
        { id: 3, name: 'Cuadro colorido abstracto', price: '₡22.000', category: 'pintura' },
        { id: 4, name: 'Vasija de cerámica tradicional', price: '₡15.800', category: 'ceramica' },
        { id: 5, name: 'Aretes de madera tallada', price: '₡8.500', category: 'joyeria' },
        { id: 6, name: 'Tapete tejido multicolor', price: '₡25.000', category: 'textil' },
        { id: 7, name: 'Retrato al óleo', price: '₡35.000', category: 'pintura' },
        { id: 8, name: 'Juego de tazas de arcilla', price: '₡14.000', category: 'ceramica' },
        { id: 9, name: 'Pulsera de cuentas naturales', price: '₡9.800', category: 'joyeria' },
        { id: 10, name: 'Manta tejida artesanal', price: '₡32.000', category: 'textil' },
        { id: 11, name: 'Paisaje costarricense', price: '₡28.000', category: 'pintura' },
        { id: 12, name: 'Platos decorativos de barro', price: '₡19.500', category: 'ceramica' }
    ];

    const categories = [
        { id: 'all', name: 'Todos los productos', count: products.length },
        { id: 'textil', name: 'Textil', count: products.filter(p => p.category === 'textil').length },
        { id: 'joyeria', name: 'Joyería', count: products.filter(p => p.category === 'joyeria').length },
        { id: 'pintura', name: 'Pintura', count: products.filter(p => p.category === 'pintura').length },
        { id: 'ceramica', name: 'Cerámica', count: products.filter(p => p.category === 'ceramica').length }
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        const searchParams = new URLSearchParams(location.search);
        if (categoryId === 'all') searchParams.delete('category');
        else searchParams.set('category', categoryId);
        const newSearch = searchParams.toString();
        navigate(`/shop${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    };

    return (
        <main className="shop-container">
            <section className="shop-hero">
                <h1>Tienda ArtesJAC</h1>
                <p>Descubre arte auténtico costarricense hecho a mano</p>
            </section>

            <section className="shop-search">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </section>

            <div className="shop-content">
                <aside className="shop-filters">
                    <h3>Categorías</h3>
                    <div className="filter-categories">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category.id)}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="shop-products">
                    <div className="products-header">
                        <h2>{selectedCategory === 'all' ? 'Todos los productos' : categories.find(c => c.id === selectedCategory)?.name}</h2>
                        <span className="products-count">{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="product-card"
                            >
                                <div className="product-image-sim"></div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};
