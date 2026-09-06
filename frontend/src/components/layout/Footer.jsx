import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#292525', color: '#F7F1E8' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-1">
            {/* Logo */}
            <div className="mb-5">
              <div className="font-heading font-semibold" style={{ fontSize: '32px', color: '#F7F1E8', lineHeight: 1 }}>
                حَبّة
              </div>
              <div className="font-body tracking-[0.2em] uppercase" style={{ fontSize: '11px', color: '#C5A56A', marginTop: '3px' }}>
                HABA
              </div>
            </div>
            <p className="font-heading italic" style={{ fontSize: '17px', color: '#C98B91', lineHeight: 1.6, maxWidth: '260px' }}>
              حَبّة ورا حَبّة،<br />حكاية بتتعمل.
            </p>
            <p className="mt-3 text-sm" style={{ color: '#978572', lineHeight: 1.8 }}>
              Made bead by bead.
            </p>
            {/* Social */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="transition-colors hover:opacity-70" style={{ color: '#978572' }}>
                <span className="sr-only">Instagram</span>
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors hover:opacity-70" style={{ color: '#978572' }}>
                <span className="sr-only">Facebook</span>
                <FiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-body font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: '#C5A56A' }}>
              Shop
            </h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-sm transition-colors hover:opacity-80" style={{ color: '#c8bcaa' }}>All Products</Link></li>
              <li><Link to="/categories" className="text-sm transition-colors hover:opacity-80" style={{ color: '#c8bcaa' }}>Collections</Link></li>
              <li><Link to="/shop?sort=-createdAt" className="text-sm transition-colors hover:opacity-80" style={{ color: '#c8bcaa' }}>New Arrivals</Link></li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-xs font-body font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: '#C5A56A' }}>
              Info
            </h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm transition-colors hover:opacity-80" style={{ color: '#c8bcaa' }}>Our Story</Link></li>
              <li><Link to="/contact" className="text-sm transition-colors hover:opacity-80" style={{ color: '#c8bcaa' }}>Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid #3d3939' }}>
          <p className="text-xs" style={{ color: '#635751' }}>
            &copy; {new Date().getFullYear()} HABA · حَبّة. All rights reserved.
          </p>
          <Link to="/admin" className="text-xs transition-colors hover:opacity-70" style={{ color: '#635751' }}>
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
