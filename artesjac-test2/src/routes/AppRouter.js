// src/routes/AppRouter.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../modules/auth/AuthContext';
import { BuyerRoute, SellerRoute, AuthenticatedRoute } from '../components/ProtectedRoute';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RecoverPasswordPage } from '../pages/RecoverPasswordPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProductPage } from '../pages/ProductPage';
import { OrdersPage } from '../pages/OrdersPage';
import { OrderConfirmation } from '../pages/OrderConfirmation';
import { NotFoundPage } from '../pages/NotFoundPage';
import { BannerFullScreen } from '../components/ui/BannerFullScreen';
import { BuyerDashboard } from '../pages/dashboards/BuyerDashboard';
import { SellerDashboard } from '../pages/dashboards/SellerDashboard';

import { SellerInventory } from '../pages/dashboards/SellerInventory';
import { SellerOrders } from '../pages/dashboards/SellerOrders';
import { SellerStoreProfile } from '../pages/dashboards/SellerStoreProfile';
import { SellerAnalytics } from '../pages/dashboards/SellerAnalytics';
import { SellerProfile } from '../pages/SellerProfile';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app-container">
                    <BannerFullScreen />
                    <header>
                        <Navbar />
                    </header>
                    <main>
                        <Routes>
                            {/* Públicas */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/home" element={<HomePage />} />

                            {/* Auth */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/recuperar" element={<RecoverPasswordPage />} />

                            {/* Tienda */}
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/p/:slug" element={<ProductPage />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/fashion" element={<ShopPage />} />
                            <Route path="/electronic" element={<ShopPage />} />
                            <Route path="/jewellery" element={<ShopPage />} />

                            {/* Perfil público de vendedor */}
                            <Route path="/seller-profile/:sellerId" element={<SellerProfile />} />

                            {/* Dashboards */}
                            <Route
                                path="/buyer/dashboard"
                                element={
                                    <AuthenticatedRoute>
                                        <BuyerDashboard />
                                    </AuthenticatedRoute>
                                }
                            />
                            <Route
                                path="/seller/dashboard"
                                element={
                                    <SellerRoute>
                                        <SellerDashboard />
                                    </SellerRoute>
                                }
                            />

                            {/* Comprador (solo requiere sesión) */}
                            <Route
                                path="/cart"
                                element={
                                    <AuthenticatedRoute>
                                        <CartPage />
                                    </AuthenticatedRoute>
                                }
                            />
                            <Route
                                path="/checkout"
                                element={
                                    <AuthenticatedRoute>
                                        <CheckoutPage />
                                    </AuthenticatedRoute>
                                }
                            />
                            <Route
                                path="/order-confirmation/:id?"
                                element={
                                    <AuthenticatedRoute>
                                        <OrderConfirmation />
                                    </AuthenticatedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <AuthenticatedRoute>
                                        <OrdersPage />
                                    </AuthenticatedRoute>
                                }
                            />
                            <Route
                                path="/orders/:id"
                                element={
                                    <AuthenticatedRoute>
                                        <OrdersPage />
                                    </AuthenticatedRoute>
                                }
                            />

                            {/* Vendedor */}
                            <Route
                                path="/seller/inventory"
                                element={
                                    <SellerRoute>
                                        <SellerInventory />
                                    </SellerRoute>
                                }
                            />
                            <Route
                                path="/seller/orders"
                                element={
                                    <SellerRoute>
                                        <SellerOrders />
                                    </SellerRoute>
                                }
                            />
                            <Route
                                path="/seller/store-profile"
                                element={
                                    <SellerRoute>
                                        <SellerStoreProfile />
                                    </SellerRoute>
                                }
                            />
                            <Route
                                path="/seller/analytics"
                                element={
                                    <SellerRoute>
                                        <SellerAnalytics />
                                    </SellerRoute>
                                }
                            />

                            {/* Perfil */}
                            <Route
                                path="/profile"
                                element={
                                    <AuthenticatedRoute>
                                        <ProfilePage />
                                    </AuthenticatedRoute>
                                }
                            />

                            {/* 404 */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
