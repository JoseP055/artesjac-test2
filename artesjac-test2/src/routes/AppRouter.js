import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { BannerFullScreen } from '../components/ui/BannerFullScreen';


export const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="app-container">
                <BannerFullScreen></BannerFullScreen>
                <header>
                    <Navbar></Navbar>
                </header>

                <main>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/home' element={<HomePage />} />
                        
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </main>

                <Footer></Footer>

            </div>
        </BrowserRouter>
    );
}
