import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-warm-900 text-warm-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <Link to="/" className="text-2xl font-heading font-bold text-brand-100 tracking-tight mb-4 inline-block">
              Handmade Store
            </Link>
            <p className="text-warm-300 max-w-md text-sm leading-relaxed mb-6">
              Curating the finest artisan-crafted goods for your home and lifestyle. 
              Every piece tells a story of craftsmanship, dedication, and beauty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-warm-400 hover:text-brand-300 transition-colors">
                <span className="sr-only">Instagram</span>
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-warm-400 hover:text-brand-300 transition-colors">
                <span className="sr-only">Facebook</span>
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-warm-400 hover:text-brand-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-warm-400 mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-warm-200 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link to="/categories" className="text-warm-200 hover:text-white transition-colors text-sm">Categories</Link></li>
              <li><Link to="/new-arrivals" className="text-warm-200 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-warm-400 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-warm-200 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/faq" className="text-warm-200 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/shipping" className="text-warm-200 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-warm-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-warm-400">
            &copy; {new Date().getFullYear()} Handmade Store. All rights reserved.
          </p>
          <Link to="/admin" className="text-xs text-warm-500 hover:text-warm-300 transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
