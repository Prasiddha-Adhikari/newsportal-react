// src/app/Layout.tsx or wherever your layout is
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <CartProvider>
        <Header />
        <Toaster position="top-right" />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </CartProvider>
    </div>
  );
};

export default Layout;
