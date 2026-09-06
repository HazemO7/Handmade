import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiUser } from 'react-icons/fi';
import Button from '../common/Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="bg-brand-50 border-b border-warm-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-heading font-bold text-brand-800 tracking-tight">
              Handmade Store
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `text-base font-medium transition-colors hover:text-brand-700 ${
                    isActive ? 'text-brand-700 border-b-2 border-brand-700' : 'text-warm-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-warm-700 hover:text-brand-700 transition-colors" title="Search">
              <FiSearch className="h-5 w-5" />
            </button>
            <Link 
              to="/admin" 
              className="p-2 text-warm-700 hover:text-brand-700 transition-colors" 
              title="Admin Login"
            >
              <FiUser className="h-5 w-5" />
            </Link>
            <Button variant="primary" size="sm" className="hidden lg:inline-flex">
              Contact on WhatsApp
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button className="p-2 text-warm-700 hover:text-brand-700 transition-colors" title="Search">
              <FiSearch className="h-5 w-5" />
            </button>
            <Link 
              to="/admin" 
              className="p-2 text-warm-700 hover:text-brand-700 transition-colors" 
              title="Admin Login"
            >
              <FiUser className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-warm-700 hover:text-brand-700 transition-colors focus:outline-none"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-50 border-b border-warm-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive 
                      ? 'bg-brand-100 text-brand-800' 
                      : 'text-warm-700 hover:bg-warm-100 hover:text-brand-800'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="px-3 py-2">
              <Button variant="primary" fullWidth size="sm">
                Contact on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
