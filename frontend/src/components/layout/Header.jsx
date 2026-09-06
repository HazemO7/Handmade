import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/categories' },
    { name: 'Our Story', path: '/about' },
  ];

  return (
    <header className="bg-warm-50 border-b border-peach-200 sticky top-0 z-50" style={{ borderColor: '#E8C7B8' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex flex-col items-start leading-none">
            <span
              className="font-heading font-semibold tracking-tight"
              style={{ fontSize: '26px', color: '#542A3A', lineHeight: 1 }}
            >
              حَبّة
            </span>
            <span
              className="font-body tracking-[0.18em] uppercase"
              style={{ fontSize: '11px', color: '#C5A56A', letterSpacing: '0.18em', marginTop: '1px' }}
            >
              HABA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'text-brand-700'
                      : 'text-warm-700 hover:text-brand-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin"
              className="p-2 text-warm-600 hover:text-brand-700 transition-colors"
              title="Admin"
            >
              <FiUser className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/admin" className="p-2 text-warm-600 hover:text-brand-700 transition-colors">
              <FiUser className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-warm-700 hover:text-brand-700 transition-colors focus:outline-none"
            >
              {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-warm-50 border-t" style={{ borderColor: '#E8C7B8' }}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-3 text-sm font-medium tracking-wider uppercase border-b ${
                    isActive
                      ? 'text-brand-700 border-peach-300'
                      : 'text-warm-700 hover:text-brand-700 border-transparent'
                  }`
                }
                style={{ borderColor: isMenuOpen ? '#E8C7B8' : 'transparent' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
