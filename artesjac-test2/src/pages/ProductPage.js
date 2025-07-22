import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/product.css';

export const ProductPage = () => {
    const { id } = useParams();

    return (
        <main className="product-container">
            <section className="product-details">
                <h1>Detalles del producto #{id}</h1>
                <p>Aquí podrías mostrar la información específica del producto seleccionado.</p>
                <Link to={-1} className="btn-back">← Volver a la tienda</Link>
            </section>
        </main>
    );
};
