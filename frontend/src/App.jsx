import { Routes, Route } from 'react-router-dom';

// Placeholder pages — will be replaced in Phase 10+
function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <h1 className="font-heading text-5xl font-bold text-warm-900 mb-4">
          Handmade Store
        </h1>
        <p className="text-lg text-warm-600 mb-8">
          Premium handcrafted products — coming soon
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/products"
            className="px-6 py-3 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors font-medium"
          >
            Browse Products
          </a>
          <a
            href="/admin/login"
            className="px-6 py-3 border border-warm-300 text-warm-700 rounded-lg hover:bg-warm-100 transition-colors font-medium"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-warm-900 mb-2">{title}</h1>
        <p className="text-warm-500">This page will be built in upcoming phases.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<PlaceholderPage title="Products" />} />
      <Route path="/products/:slug" element={<PlaceholderPage title="Product Details" />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<PlaceholderPage title="Admin Login" />} />
      <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
      <Route path="/admin/products" element={<PlaceholderPage title="Manage Products" />} />
      <Route path="/admin/products/new" element={<PlaceholderPage title="Add Product" />} />
      <Route path="/admin/products/:id/edit" element={<PlaceholderPage title="Edit Product" />} />
      <Route path="/admin/categories" element={<PlaceholderPage title="Categories" />} />
      <Route path="/admin/settings" element={<PlaceholderPage title="Settings" />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-warm-50">
            <div className="text-center">
              <h1 className="font-heading text-6xl font-bold text-warm-300 mb-4">404</h1>
              <p className="text-warm-600 mb-6">Page not found</p>
              <a href="/" className="text-brand-700 hover:text-brand-800 underline font-medium">
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
