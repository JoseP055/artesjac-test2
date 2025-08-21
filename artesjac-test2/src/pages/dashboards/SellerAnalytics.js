import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../modules/auth/AuthContext";
import "../../styles/dashboard.css";
import "../../styles/analytics.css";
import { AnalyticsAPI } from "../../api/analytics.service";

export const SellerAnalytics = () => {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState({
        monthlyData: [],
        topProducts: [],
        salesTrends: [],
        customerMetrics: {},
        revenueBreakdown: {},
        productCategories: [],
    });
    const [selectedPeriod, setSelectedPeriod] = useState("6months");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const res = await AnalyticsAPI.getSeller(selectedPeriod);
                const data = res?.data || {};
                setAnalyticsData({
                    monthlyData: Array.isArray(data.monthlyData) ? data.monthlyData : [],
                    topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
                    salesTrends: Array.isArray(data.salesTrends) ? data.salesTrends : [],
                    customerMetrics: data.customerMetrics || {},
                    revenueBreakdown: data.revenueBreakdown || {},
                    productCategories: Array.isArray(data.productCategories) ? data.productCategories : [],
                });
            } catch (e) {
                console.error("Error cargando analytics:", e);
                alert(e?.response?.data?.error || "No se pudieron cargar las estadísticas.");
                setAnalyticsData({
                    monthlyData: [],
                    topProducts: [],
                    salesTrends: [],
                    customerMetrics: {},
                    revenueBreakdown: {},
                    productCategories: [],
                });
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [selectedPeriod]);

    const formatCurrency = (amount = 0) => `₡${Number(amount || 0).toLocaleString()}`;

    const getMaxValue = (data, key) => {
        const arr = Array.isArray(data) ? data : [];
        if (arr.length === 0) return 1;
        const max = Math.max(...arr.map((item) => Number(item?.[key] || 0)));
        return max <= 0 ? 1 : max;
    };

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

    const cm = analyticsData.customerMetrics || {};
    const rb = analyticsData.revenueBreakdown || {};

    // Fallbacks sanos
    const totalCustomers = cm.totalCustomers ?? 0;
    const newCustomers = cm.newCustomers ?? 0;
    const returningCustomers = cm.returningCustomers ?? 0;
    const avgOrderValue = cm.avgOrderValue ?? 0;
    const customerSatisfaction = cm.customerSatisfaction ?? "—";

    const monthlyMaxSales = getMaxValue(analyticsData.monthlyData, "sales");
    const monthlyMaxRevenue = getMaxValue(analyticsData.monthlyData, "revenue");
    const categoriesMaxRevenue = getMaxValue(analyticsData.productCategories, "revenue");

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
                        <h3>{totalCustomers}</h3>
                        <p>Total Clientes</p>
                        <span className="stat-detail">{newCustomers} nuevos este periodo</span>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon avg-order">
                        <i className="fa fa-receipt"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{formatCurrency(avgOrderValue)}</h3>
                        <p>Valor Promedio del Pedido</p>
                        <span className="stat-detail">vs. periodo anterior (referencial)</span>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon satisfaction">
                        <i className="fa fa-heart"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{customerSatisfaction}</h3>
                        <p>Satisfacción del Cliente</p>
                        <span className="stat-detail">
                            {totalCustomers > 0 ? `Basado en ${totalCustomers} clientes` : "Sin datos"}
                        </span>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="stat-icon returning">
                        <i className="fa fa-redo"></i>
                    </div>
                    <div className="stat-content">
                        <h3>
                            {totalCustomers > 0
                                ? ((returningCustomers / totalCustomers) * 100).toFixed(1)
                                : "0.0"}
                            %
                        </h3>
                        <p>Clientes Recurrentes</p>
                        <span className="stat-detail">
                            {returningCustomers} de {totalCustomers} clientes
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
                                                height: `${(Number(data.sales || 0) / monthlyMaxSales) * 100}%`,
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
                                                height: `${(Number(data.revenue || 0) / monthlyMaxRevenue) * 100}%`,
                                            }}
                                        ></div>
                                        <span className="bar-label">{data.month}</span>
                                        <span className="bar-value">
                                            {formatCurrency((Number(data.revenue || 0) / 1000).toFixed(0))}K
                                        </span>
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
                        <span className="period-info">
                            Últimos {selectedPeriod === "3months" ? "3 meses" : selectedPeriod === "6months" ? "6 meses" : "12 meses"}
                        </span>
                    </div>
                    <div className="products-analytics-list">
                        {analyticsData.topProducts.map((product, index) => (
                            <div key={`${product.id || product.name}-${index}`} className="product-analytics-item">
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
                        {analyticsData.topProducts.length === 0 && <p>No hay datos en este periodo.</p>}
                    </div>
                </div>

                {/* Categorías */}
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
                                                width: `${(Number(category.revenue || 0) / categoriesMaxRevenue) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {analyticsData.productCategories.length === 0 && <p>Sin ventas por categoría en este periodo.</p>}
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
                                        background: `conic-gradient(#4caf50 0deg ${(rb.productSales || 0) * 3.6}deg, transparent 0deg)`,
                                    }}
                                ></div>
                                <div
                                    className="pie-slice shipping"
                                    style={{
                                        background: `conic-gradient(transparent 0deg ${(rb.productSales || 0) * 3.6}deg, #ff9800 ${(rb.productSales || 0) * 3.6}deg ${((rb.productSales || 0) + (rb.shipping || 0)) * 3.6}deg, transparent 0deg)`,
                                    }}
                                ></div>
                                <div
                                    className="pie-slice taxes"
                                    style={{
                                        background: `conic-gradient(transparent 0deg ${((rb.productSales || 0) + (rb.shipping || 0)) * 3.6}deg, #f44336 ${((rb.productSales || 0) + (rb.shipping || 0)) * 3.6}deg 360deg)`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="breakdown-legend">
                            <div className="legend-item">
                                <div className="legend-color product-sales-color"></div>
                                <span>Ventas de Productos</span>
                                <strong>{rb.productSales ?? 0}%</strong>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color shipping-color"></div>
                                <span>Envíos</span>
                                <strong>{rb.shipping ?? 0}%</strong>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color taxes-color"></div>
                                <span>Impuestos</span>
                                <strong>{rb.taxes ?? 0}%</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recomendaciones (placeholder) */}
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
                                <h4>Aumentá stock de lo más vendido</h4>
                                <p>
                                    Revisá el Top 3: reforzá inventario y crea bundles para subir ticket promedio.
                                </p>
                            </div>
                            <div className="recommendation-priority high">Alta</div>
                        </div>
                        <div className="recommendation-item medium-priority">
                            <div className="recommendation-icon">
                                <i className="fa fa-chart-line"></i>
                            </div>
                            <div className="recommendation-content">
                                <h4>Promocioná categorías débiles</h4>
                                <p>Hacé campañas y descuentos dirigidos en la categoría con menos ingresos.</p>
                            </div>
                            <div className="recommendation-priority medium">Media</div>
                        </div>
                        <div className="recommendation-item low-priority">
                            <div className="recommendation-icon">
                                <i className="fa fa-users"></i>
                            </div>
                            <div className="recommendation-content">
                                <h4>Fidelización</h4>
                                <p>Enviá cupones a clientes recurrentes para incentivar recompras.</p>
                            </div>
                            <div className="recommendation-priority low">Baja</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
