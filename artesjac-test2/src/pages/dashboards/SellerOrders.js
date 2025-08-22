import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Cargar pedidos al montar el componente
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders/seller", {
                    withCredentials: true,
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error al obtener las órdenes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // ✅ Actualizar estado del pedido
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:5000/api/orders/${orderId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
    };

    // ✅ Render
    if (loading) return <p>Cargando órdenes...</p>;

    return (
        <div>
            <h2>Órdenes de mis productos</h2>
            {orders.length === 0 ? (
                <p>No tienes órdenes aún.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Comprador</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.buyer?.name || "Sin nombre"}</td>
                                <td>
                                    <ul>
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.product?.title || "Producto eliminado"} - {item.quantity} x ${item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>${order.totalAmount}</td>
                                <td>{order.status}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SellerOrders;
