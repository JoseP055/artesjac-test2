import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../modules/auth/AuthContext';
import { ProtectedRoute, BuyerRoute, SellerRoute, AuthenticatedRoute } from '../components/ProtectedRoute';
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
                            
                            {/* ===== RUTAS DE VENDEDOR ===== */}
                            <Route path='/seller/products' element={
                                <SellerRoute>
                                    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
                                        <h1>Mis Productos - Próximamente</h1>
                                        <p>Esta sección estará disponible pronto para gestionar tu inventario.</p>
                                    </div>
                                </SellerRoute>
                            } />
                            
                            <Route path='/seller/products/new' element={
                                <SellerRoute>
                                    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
                                        <h1>Agregar Producto - Próximamente</h1>
                                        <p>Esta sección estará disponible pronto para agregar nuevos productos.</p>
                                    </div>
                                </SellerRoute>
                            } />
                            
                            <Route path='/seller/orders' element={
                                <SellerRoute>
                                    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
                                        <h1>Gestión de Pedidos - Próximamente</h1>
                                        <p>Esta sección estará disponible pronto para gestionar los pedidos de tus clientes.</p>
                                    </div>
                                </SellerRoute>
                            } />
                            
                            <Route path='/seller/analytics' element={
                                <SellerRoute>
                                    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
                                        <h1>Estadísticas y Analíticas - Próximamente</h1>
                                        <p>Esta sección estará disponible pronto para ver el análisis detallado de tus ventas.</p>
                                    </div>
                                </SellerRoute>
                            } />
                            
                            <Route path='/seller/profile' element={
                                <SellerRoute>
                                    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
                                        <h1>Perfil de Vendedor - Próximamente</h1>
                                        <p>Esta sección estará disponible pronto para configurar tu tienda y perfil de vendedor.</p>
                                    </div>
                                </SellerRoute>
                            } />
                            
                            <Route path='/seller/messages' element={
                                <SellerRoute>
                                    <div style={{ padding: '2rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
                                        <h1>Mensajes con Clientes - Próximamente</h1>
                                        <p>Esta sección estará disponible pronto para comunicarte con tus clientes.</p>
                                    </div>
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