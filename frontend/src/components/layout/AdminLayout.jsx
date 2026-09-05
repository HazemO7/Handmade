import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiGrid, 
  FiBox, 
  FiTag, 
  FiSettings, 
  FiLogOut,
  FiHome,
  FiImage
} from 'react-icons/fi';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid, exact: true },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Categories', path: '/admin/categories', icon: FiTag },
    { name: 'Media', path: '/admin/media', icon: FiImage },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-warm-100 font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-950 text-warm-100 flex flex-col shadow-xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-brand-800">
          <span className="text-xl font-heading font-bold text-white tracking-wide">Admin Portal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-brand-800 text-white'
                        : 'text-brand-100 hover:bg-brand-900 hover:text-white'
                    }`
                  }
                >
                  <Icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-brand-800">
          <div className="flex items-center px-3 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-brand-300 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-brand-100 hover:bg-brand-900 hover:text-white transition-colors"
          >
            <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-warm-200">
          <h2 className="text-lg font-medium text-warm-800">Dashboard</h2>
          <div className="flex items-center">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-600 hover:text-brand-800 flex items-center"
            >
              <FiHome className="mr-2" /> View Public Store
            </a>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-warm-50 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
