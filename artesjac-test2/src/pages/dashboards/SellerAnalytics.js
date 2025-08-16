import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';
import '../../styles/dashboard.css';
import '../../styles/analytics.css';

export const SellerAnalytics = () => {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState({
        monthlyData: [],
        topProducts: [],
        salesTrends: [],
        customerMetrics: {},
        revenueBreakdown: {},
        productCategories: []
    });
    const [selectedPeriod, setSelectedPeriod] = useState('6months');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalyticsData();
    }, [selectedPeriod]);

    const loadAnalyticsData = () => {
        setIsLoading(true);
        // Simular carga de datos analíticos
        setTimeout(() => {
            setAnalyticsData({
                monthlyData: [
                    { month: 'Ago', sales: 8, revenue: 95000, orders: 12 },
                    { month: 'Sep', sales: 12, revenue: 140000, orders: 18 },
                    { month: 'Oct', sales: 15, revenue: 180000, orders: 22 },
                    { month: 'Nov', sales: 18, revenue: 220000, orders: 25 },
                    { month: 'Dic', sales: 22, revenue: 280000, orders: 30 },
                    { month: 'Ene', sales: 25, revenue: 320000, orders: 35 }
                ],
                topProducts: [
                    { id: 1, name: 'Collar artesanal de semillas', sales: 45, revenue: 540000, percentage: 35 },
                    { id: 2, name: 'Bolso tejido a mano', sales: 32, revenue: 384000, percentage: 25 },
                    { id: 3, name: 'Aretes de madera tallada', sales: 28, revenue: 238000, percentage: 20 },
                    { id: 4, name: 'Vasija cerámica decorativa', sales: 15, revenue: 180000, percentage: 12 },
                    { id: 5, name: 'Cuadro paisaje artesanal', sales: 10, revenue: 150000, percentage: 8 }
                ],
                customerMetrics: {
                    totalCustomers: 87,
                    newCustomers: 23,
                    returningCustomers: 64,
                    avgOrderValue: 28500,
                    customerSatisfaction: 4.8
                },
                revenueBreakdown: {
                    productSales: 85,
                    shipping: 10,
                    taxes: 5
                },
                productCategories: [
                    { category: 'Joyería', count: 8, sales: 45, revenue: 540000 },
                    { category: 'Bolsos y Accesorios', count: 5, sales: 32, revenue: 384000 },
                    { category: 'Decoración', count: 4, sales: 28, revenue: 268000 },
                    { category: 'Arte', count: 3, sales: 15, revenue: 180000 }
                ]
            });
            setIsLoading(false);
        }, 1000);
    };

    const formatCurrency = (amount) => `₡${amount.toLocaleString()}`;

    const getMaxValue = (data, key) => Math.max(...data.map(item => item[key]));

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container analytics-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <Link to="/seller/dashboard" className="back-button">
                        <i className="fa fa-arrow-left"></i>
                        Regresar al Dashboard
                    </Link>
                    <h1>📊 Estadísticas y Análisis</h1>
                    <p>Análisis detallado del rendimiento de tu tienda</p>
                </div>
                <div className="period-selector">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="period-select"
                    >
                        <option value="3months">Últimos 3 meses</option>
                        <option value="6months">Últimos 6 meses</option>
                        <option value="1year">Último año</option>
                    </select>
                </div>
            </div>

            {/* Métricas principales */}
            <div className="analytics-stats-grid">
                <div className="analytics-stat-card">
                    <div className="stat-icon customers">
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{analyticsData.customerMetrics.totalCustomers}</h3>
                        <p>Total Clientes</p>
                        <span className="stat-detail">
                            {analyticsData.customerMetrics.newCustomers} nuevos este mes
                        </span>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon avg-order">
                        <i className="fa fa-receipt"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{formatCurrency(analyticsData.customerMetrics.avgOrderValue)}</h3>
                        <p>Valor Promedio del Pedido</p>
                        <span className="stat-detail">
                            +15% vs mes anterior
                        </span>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon satisfaction">
                        <i className="fa fa-heart"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{analyticsData.customerMetrics.customerSatisfaction}</h3>
                        <p>Satisfacción del Cliente</p>
                        <span className="stat-detail">
                            Basado en {analyticsData.customerMetrics.totalCustomers} reseñas
                        </span>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon returning">
                        <i className="fa fa-redo"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{((analyticsData.customerMetrics.returningCustomers / analyticsData.customerMetrics.totalCustomers) * 100).toFixed(1)}%</h3>
                        <p>Clientes Recurrentes</p>
                        <span className="stat-detail">
                            {analyticsData.customerMetrics.returningCustomers} de {analyticsData.customerMetrics.totalCustomers} clientes
                        </span>
                    </div>
                </div>
            </div>

            {/* Gráficos y análisis */}
            <div className="analytics-content">
                {/* Ventas por mes */}
                <div className="section-card analytics-chart-card">
                    <div className="section-header">
                        <h2>📈 Tendencia de Ventas Mensuales</h2>
                        <div className="chart-legend">
                            <span className="legend-item sales">
                                <div className="legend-color"></div>
                                Ventas
                            </span>
                            <span className="legend-item revenue">
                                <div className="legend-color"></div>
                                Ingresos
                            </span>
                        </div>
                    </div>
                    <div className="dual-chart-container">
                        <div className="chart-section">
                            <h4>Número de Ventas</h4>
                            <div className="chart-container sales-chart">
                                {analyticsData.monthlyData.map((data, index) => (
                                    <div key={index} className="chart-bar-group">
                                        <div
                                            className="chart-bar sales-bar"
                                            style={{
                                                height: `${(data.sales / getMaxValue(analyticsData.monthlyData, 'sales')) * 100}%`
                                            }}
                                        ></div>
                                        <span className="bar-label">{data.month}</span>
                                        <span className="bar-value">{data.sales}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="chart-section">
                            <h4>Ingresos (₡)</h4>
                            <div className="chart-container revenue-chart">
                                {analyticsData.monthlyData.map((data, index) => (
                                    <div key={index} className="chart-bar-group">
                                        <div
                                            className="chart-bar revenue-bar"
                                            style={{
                                                height: `${(data.revenue / getMaxValue(analyticsData.monthlyData, 'revenue')) * 100}%`
                                            }}
                                        ></div>
                                        <span className="bar-label">{data.month}</span>
                                        <span className="bar-value">{formatCurrency(data.revenue / 1000)}K</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Productos más vendidos */}
                <div className="section-card top-products-analytics">
                    <div className="section-header">
                        <h2>🏆 Productos Más Vendidos</h2>
                        <span className="period-info">Últimos {selectedPeriod === '3months' ? '3 meses' : selectedPeriod === '6months' ? '6 meses' : 'año'}</span>
                    </div>
                    <div className="products-analytics-list">
                        {analyticsData.topProducts.map((product, index) => (
                            <div key={product.id} className="product-analytics-item">
                                <div className="product-rank">#{index + 1}</div>
                                <div className="product-details">
                                    <h4>{product.name}</h4>
                                    <div className="product-metrics">
                                        <span className="metric">
                                            <i className="fa fa-shopping-cart"></i>
                                            {product.sales} ventas
                                        </span>
                                        <span className="metric">
                                            <i className="fa fa-dollar-sign"></i>
                                            {formatCurrency(product.revenue)}
                                        </span>
                                    </div>
                                </div>
                                <div className="product-performance">
                                    <div className="performance-bar">
                                        <div
                                            className="performance-fill"
                                            style={{ width: `${product.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="performance-percentage">{product.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categorías de productos */}
                <div className="section-card categories-analytics">
                    <div className="section-header">
                        <h2>📦 Rendimiento por Categoría</h2>
                    </div>
                    <div className="categories-grid">
                        {analyticsData.productCategories.map((category, index) => (
                            <div key={index} className="category-card">
                                <div className="category-header">
                                    <h4>{category.category}</h4>
                                    <span className="category-count">{category.count} productos</span>
                                </div>
                                <div className="category-metrics">
                                    <div className="category-metric">
                                        <span className="metric-label">Ventas</span>
                                        <span className="metric-value">{category.sales}</span>
                                    </div>
                                    <div className="category-metric">
                                        <span className="metric-label">Ingresos</span>
                                        <span className="metric-value">{formatCurrency(category.revenue)}</span>
                                    </div>
                                </div>
                                <div className="category-performance">
                                    <div className="performance-indicator">
                                        <div
                                            className="indicator-fill"
                                            style={{
                                                width: `${(category.revenue / getMaxValue(analyticsData.productCategories, 'revenue')) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desglose de ingresos */}
                <div className="section-card revenue-breakdown">
                    <div className="section-header">
                        <h2>💰 Desglose de Ingresos</h2>
                    </div>
                    <div className="breakdown-container">
                        <div className="breakdown-chart">
                            <div className="pie-chart">
                                <div
                                    className="pie-slice product-sales"
                                    style={{
                                        background: `conic-gradient(#4caf50 0deg ${analyticsData.revenueBreakdown.productSales * 3.6}deg, transparent 0deg)`
                                    }}
                                ></div>
                                <div
                                    className="pie-slice shipping"
                                    style={{
                                        background: `conic-gradient(transparent 0deg ${analyticsData.revenueBreakdown.productSales * 3.6}deg, #ff9800 ${analyticsData.revenueBreakdown.productSales * 3.6}deg ${(analyticsData.revenueBreakdown.productSales + analyticsData.revenueBreakdown.shipping) * 3.6}deg, transparent 0deg)`
                                    }}
                                ></div>
                                <div
                                    className="pie-slice taxes"
                                    style={{
                                        background: `conic-gradient(transparent 0deg ${(analyticsData.revenueBreakdown.productSales + analyticsData.revenueBreakdown.shipping) * 3.6}deg, #f44336 ${(analyticsData.revenueBreakdown.productSales + analyticsData.revenueBreakdown.shipping) * 3.6}deg 360deg)`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="breakdown-legend">
                            <div className="legend-item">
                                <div className="legend-color product-sales-color"></div>
                                <span>Ventas de Productos</span>
                                <strong>{analyticsData.revenueBreakdown.productSales}%</strong>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color shipping-color"></div>
                                <span>Envíos</span>
                                <strong>{analyticsData.revenueBreakdown.shipping}%</strong>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color taxes-color"></div>
                                <span>Impuestos</span>
                                <strong>{analyticsData.revenueBreakdown.taxes}%</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recomendaciones */}
                <div className="section-card recommendations">
                    <div className="section-header">
                        <h2>💡 Recomendaciones para Mejorar</h2>
                    </div>
                    <div className="recommendations-list">
                        <div className="recommendation-item high-priority">
                            <div className="recommendation-icon">
                                <i className="fa fa-exclamation-circle"></i>
                            </div>
                            <div className="recommendation-content">
                                <h4>Aumentar inventario de productos populares</h4>
                                <p>Los collares artesanales representan el 35% de tus ventas. Considera aumentar la variedad en esta categoría.</p>
                            </div>
                            <div className="recommendation-priority high">Alta</div>
                        </div>

                        <div className="recommendation-item medium-priority">
                            <div className="recommendation-icon">
                                <i className="fa fa-chart-line"></i>
                            </div>
                            <div className="recommendation-content">
                                <h4>Promocionar categorías de menor rendimiento</h4>
                                <p>La categoría de Arte tiene potencial de crecimiento. Considera crear promociones especiales.</p>
                            </div>
                            <div className="recommendation-priority medium">Media</div>
                        </div>

                        <div className="recommendation-item low-priority">
                            <div className="recommendation-icon">
                                <i className="fa fa-users"></i>
                            </div>
                            <div className="recommendation-content">
                                <h4>Programa de fidelización</h4>
                                <p>Con un 73% de clientes recurrentes, un programa de recompensas podría aumentar las ventas.</p>
                            </div>
                            <div className="recommendation-priority low">Baja</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}