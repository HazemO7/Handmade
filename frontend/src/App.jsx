import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';

import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManager from './pages/admin/CategoryManager';
import ProductManager from './pages/admin/ProductManager';
import AddProductPage from './pages/admin/AddProductPage';

// Admin Pages placeholders (to be done in later tasks)
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-warm-900 mb-2">{title}</h1>
        <p className="text-warm-500">This page will be built in upcoming phases.</p>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div className="flex flex-col min-h-screen font-body text-warm-800 bg-warm-50">
      <Routes>
        {/* Public Routes - Wrapped in Header/Footer */}
        <Route path="/" element={
          <>
            <Header />
            <main className="flex-grow"><Home /></main>
            <Footer />
          </>
        } />
        <Route path="/shop" element={
          <>
            <Header />
            <main className="flex-grow"><Shop /></main>
            <Footer />
          </>
        } />
        <Route path="/categories" element={
          <>
            <Header />
            <main className="flex-grow"><Shop /></main>
            <Footer />
          </>
        } />
        <Route path="/product/:slug" element={
          <>
            <Header />
            <main className="flex-grow"><ProductDetail /></main>
            <Footer />
          </>
        } />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="media" element={<PlaceholderPage title="Media" />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={
          <>
            <Header />
            <main className="flex-grow min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-3xl font-heading font-bold text-warm-900 mb-4">404 - Page Not Found</h2>
              <a href="/" className="text-brand-600 hover:text-brand-800 font-medium">Return to Home</a>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
};

export default App;
