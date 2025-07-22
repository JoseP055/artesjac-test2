import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="app-container">
                <BannerFullScreen />
                <header>
                    <Navbar />
                </header>

                <main>
                    <Routes>
                        {/* ===== PÁGINAS PRINCIPALES ===== */}
                        <Route path='/' element={<HomePage />} />
                        <Route path='/home' element={<HomePage />} />
                        
                        {/* ===== TIENDA Y PRODUCTOS ===== */}
                        <Route path='/shop' element={<ShopPage />} />
                        <Route path='/fashion' element={<ShopPage />} />
                        <Route path='/electronic' element={<ShopPage />} />
                        <Route path='/jewellery' element={<ShopPage />} />
                        <Route path='/product/:id' element={<ProductPage />} />
                        
                        {/* ===== CARRITO Y CHECKOUT ===== */}
                        <Route path='/cart' element={<CartPage />} />
                        <Route path='/checkout' element={<CheckoutPage />} />
                        <Route path='/order-confirmation/:id?' element={<OrderConfirmation />} />
                        
                        {/* ===== AUTENTICACIÓN ===== */}
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        
                        {/* ===== ÁREA DE USUARIO ===== */}
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/orders' element={<OrdersPage />} />
                        <Route path='/order/:id' element={<OrderConfirmation />} />
                        
                        {/* ===== 404 ===== */}
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}