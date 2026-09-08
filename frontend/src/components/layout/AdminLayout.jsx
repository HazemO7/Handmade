import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiBox,
  FiTag,
  FiSettings,
  FiLogOut,
  FiHome,
  FiImage,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const closeSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex h-screen font-body overflow-hidden" style={{ backgroundColor: '#F7F1E8' }}>
      {/* ── Mobile Backdrop Overlay ── */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (Desktop fixed + Mobile slide-over drawer) ── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 flex flex-col shadow-2xl md:shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#292525', color: '#F7F1E8' }}
      >
        {/* Logo & Mobile Close */}
        <div
          className="h-16 sm:h-20 flex items-center justify-between px-6"
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

          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 rounded-md text-warm-400 hover:text-white hover:bg-warm-800 transition-colors"
            aria-label="Close menu"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-4 sm:py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center px-3.5 py-3 text-sm font-medium rounded-sm transition-colors ${
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
            className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-sm transition-colors"
            style={{ color: '#635751' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F7F1E8'; e.currentTarget.style.backgroundColor = '#3d3939'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#635751'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <FiLogOut className="mr-3 flex-shrink-0 h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Header */}
        <header
          className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0"
          style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8C7B8' }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-md transition-colors"
              style={{ color: '#542A3A', backgroundColor: '#F7F1E8' }}
              aria-label="Open sidebar menu"
            >
              <FiMenu className="h-5 w-5" />
            </button>

            <h2 className="font-heading font-normal text-lg sm:text-xl" style={{ color: '#292525' }}>
              Store Management
            </h2>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs font-body tracking-wider uppercase transition-colors px-2.5 py-1.5 rounded-sm"
            style={{ color: '#542A3A', backgroundColor: '#F7F1E8' }}
            onMouseEnter={e => e.currentTarget.style.color = '#3d1e2a'}
            onMouseLeave={e => e.currentTarget.style.color = '#542A3A'}
          >
            <FiHome className="mr-1.5 h-3.5 w-3.5" /> 
            <span className="hidden sm:inline">View Store</span>
            <span className="sm:hidden">Store</span>
          </a>
        </header>

        {/* Page Content Container with Mobile-Adaptive Padding */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8" style={{ backgroundColor: '#F7F1E8' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
