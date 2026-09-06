import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    if (success) navigate(from, { replace: true });
    setIsSubmitting(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd4c4',
    borderRadius: '3px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    color: '#292525',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      className="min-h-screen flex font-body"
      style={{ backgroundColor: '#F7F1E8' }}
    >
      {/* Left — Brand panel (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16"
        style={{ backgroundColor: '#542A3A' }}
      >
        <div className="max-w-xs">
          <div className="font-heading font-semibold mb-1" style={{ fontSize: '52px', color: '#F7F1E8', lineHeight: 1 }}>
            حَبّة
          </div>
          <div className="font-body tracking-[0.22em] uppercase mb-8" style={{ fontSize: '11px', color: '#C5A56A' }}>
            HABA
          </div>
          <p className="font-heading italic" style={{ fontSize: '20px', color: '#C98B91', lineHeight: 1.6 }}>
            حَبّة ورا حَبّة،<br />حكاية بتتعمل.
          </p>
          <p className="font-body mt-4" style={{ fontSize: '13px', color: '#7a3d54', letterSpacing: '0.04em' }}>
            Made bead by bead.
          </p>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20">
        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="font-heading font-semibold" style={{ fontSize: '36px', color: '#542A3A', lineHeight: 1 }}>
              حَبّة
            </div>
            <div className="font-body tracking-[0.2em] uppercase mt-1" style={{ fontSize: '10px', color: '#C5A56A' }}>
              HABA
            </div>
          </div>

          <p className="font-body text-xs tracking-[0.15em] uppercase mb-2" style={{ color: '#C5A56A' }}>
            Admin
          </p>
          <h1 className="font-heading mb-8" style={{ fontSize: '32px', fontWeight: 400, color: '#292525' }}>
            Sign In
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-body font-medium tracking-wider uppercase mb-2" style={{ color: '#635751' }} htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#542A3A'; e.target.style.boxShadow = '0 0 0 2px rgba(84,42,58,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#ddd4c4'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-body font-medium tracking-wider uppercase mb-2" style={{ color: '#635751' }} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#542A3A'; e.target.style.boxShadow = '0 0 0 2px rgba(84,42,58,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#ddd4c4'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth size="md" isLoading={isSubmitting}>
                Sign In →
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
