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
    <div className="flex h-screen font-body" style={{ backgroundColor: '#F7F1E8' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shadow-lg z-20"
        style={{ backgroundColor: '#292525', color: '#F7F1E8' }}
      >
        {/* Logo */}
        <div
          className="h-20 flex items-center px-6"
          style={{ borderBottom: '1px solid #3d3939' }}
        >
          <div>
            <div className="font-heading font-semibold" style={{ fontSize: '22px', color: '#F7F1E8', lineHeight: 1 }}>
              حَبّة
            </div>
            <div className="font-body tracking-[0.18em] uppercase" style={{ fontSize: '9px', color: '#C5A56A', marginTop: '2px' }}>
              HABA · Admin
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-0.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'hover:text-white'
                    }`
                  }
                  style={({ isActive }) => isActive
                    ? { backgroundColor: '#542A3A', color: '#F7F1E8' }
                    : { color: '#978572' }
                  }
                >
                  <Icon className="mr-3 flex-shrink-0 h-4 w-4" aria-hidden="true" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User + Logout */}
        <div className="p-4" style={{ borderTop: '1px solid #3d3939' }}>
          <div className="flex items-center px-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#F7F1E8' }}>{user?.name || 'Admin'}</p>
              <p className="text-xs truncate" style={{ color: '#635751' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors"
            style={{ color: '#635751' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F7F1E8'; e.currentTarget.style.backgroundColor = '#3d3939'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#635751'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <FiLogOut className="mr-3 flex-shrink-0 h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-20 flex items-center justify-between px-8 z-10"
          style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8C7B8' }}
        >
          <h2 className="font-heading font-normal" style={{ fontSize: '20px', color: '#292525' }}>
            Store Management
          </h2>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs font-body tracking-widest uppercase transition-colors"
            style={{ color: '#542A3A' }}
            onMouseEnter={e => e.currentTarget.style.color = '#3d1e2a'}
            onMouseLeave={e => e.currentTarget.style.color = '#542A3A'}
          >
            <FiHome className="mr-2 h-3.5 w-3.5" /> View Store
          </a>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8" style={{ backgroundColor: '#F7F1E8' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
