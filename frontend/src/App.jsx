import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';

// Admin Pages placeholders (to be done in Phase 11)
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-warm-900 mb-2">{title}</h1>
        <p className="text-warm-500">This page will be built in upcoming phases.</p>
        <a href="/" className="mt-4 inline-block text-brand-600 hover:text-brand-800">Back to Store</a>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div className="flex flex-col min-h-screen font-body text-warm-800 bg-warm-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          
          {/* Admin Routes (Phase 11 placeholders) */}
          <Route path="/admin/login" element={<PlaceholderPage title="Admin Login" />} />
          <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
          <Route path="/admin/products" element={<PlaceholderPage title="Manage Products" />} />
          <Route path="/admin/products/new" element={<PlaceholderPage title="Add Product" />} />
          <Route path="/admin/categories" element={<PlaceholderPage title="Categories" />} />
          <Route path="/admin/settings" element={<PlaceholderPage title="Settings" />} />

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-3xl font-heading font-bold text-warm-900 mb-4">404 - Page Not Found</h2>
              <a href="/" className="text-brand-600 hover:text-brand-800 font-medium">Return to Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
