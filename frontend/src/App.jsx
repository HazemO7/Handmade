import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout — always loaded (tiny, needed on every page)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// ── Critical public pages — lazy loaded ──
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));

// ── Admin pages — lazy loaded (never loaded for regular visitors) ──
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout'));
const ProtectedRoute = React.lazy(() => import('./components/auth/ProtectedRoute'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const CategoryManager = React.lazy(() => import('./pages/admin/CategoryManager'));
const ProductManager = React.lazy(() => import('./pages/admin/ProductManager'));
const AddProductPage = React.lazy(() => import('./pages/admin/AddProductPage'));
const SettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));

// Lightweight inline fallback — no extra component import needed
const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-warm-50">
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: '#E8C7B8', borderTopColor: '#542A3A' }}
      />
      <span className="font-body text-xs tracking-widest uppercase" style={{ color: '#978572' }}>
        Loading…
      </span>
    </div>
  </div>
);

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
      <Suspense fallback={<PageFallback />}>
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
            <Route path="settings" element={<SettingsPage />} />
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
      </Suspense>
    </div>
  );
};

export default App;
