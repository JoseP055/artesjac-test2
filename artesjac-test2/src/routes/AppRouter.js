import React from 'react'
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
                            {/* ===== PÁGINAS PÚBLICAS ===== */}
                            <Route path='/' element={<HomePage />} />
                            <Route path='/home' element={<HomePage />} />

                            {/* ===== AUTENTICACIÓN ===== */}
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='/register' element={<RegisterPage />} />

                            {/* ===== TIENDA Y PRODUCTOS (PÚBLICO/COMPRADOR) ===== */}
                            <Route path='/shop' element={<ShopPage />} />
                            <Route path='/fashion' element={<ShopPage />} />
                            <Route path='/electronic' element={<ShopPage />} />
                            <Route path='/jewellery' element={<ShopPage />} />
                            <Route path='/product/:id' element={<ProductPage />} />

                            {/* ===== DASHBOARDS PROTEGIDOS ===== */}
                            <Route path='/buyer/dashboard' element={
                                <BuyerRoute>
                                    <BuyerDashboard />
                                </BuyerRoute>
                            } />

                            <Route path='/seller/dashboard' element={
                                <SellerRoute>
                                    <SellerDashboard />
                                </SellerRoute>
                            } />

                            {/* ===== RUTAS DE COMPRADOR ===== */}
                            <Route path='/cart' element={
                                <BuyerRoute>
                                    <CartPage />
                                </BuyerRoute>
                            } />

                            <Route path='/checkout' element={
                                <BuyerRoute>
                                    <CheckoutPage />
                                </BuyerRoute>
                            } />

                            <Route path='/order-confirmation/:id?' element={
                                <BuyerRoute>
                                    <OrderConfirmation />
                                </BuyerRoute>
                            } />

                            <Route path='/orders' element={
                                <BuyerRoute>
                                    <OrdersPage />
                                </BuyerRoute>
                            } />

                            <Route path='/orders/:id' element={
                                <BuyerRoute>
                                    <OrdersPage />
                                </BuyerRoute>
                            } />

                            {/* ===== NUEVAS RUTAS DEL VENDEDOR ===== */}
                            <Route path='/seller/inventory' element={
                                <SellerRoute>
                                    <SellerInventory />
                                </SellerRoute>
                            } />

                            <Route path='/seller/orders' element={
                                <SellerRoute>
                                    <SellerOrders />
                                </SellerRoute>
                            } />

                            <Route path='/seller/store-profile' element={
                                <SellerRoute>
                                    <SellerStoreProfile />
                                </SellerRoute>
                            } />

                            <Route path='/seller/analytics' element={
                                <SellerRoute>
                                    <SellerAnalytics />
                                </SellerRoute>
                            } />

                            {/* ===== ÁREA DE USUARIO (AMBOS TIPOS) ===== */}
                            <Route path='/profile' element={
                                <AuthenticatedRoute>
                                    <ProfilePage />
                                </AuthenticatedRoute>
                            } />

                            {/* ===== 404 ===== */}
                            <Route path='*' element={<NotFoundPage />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}