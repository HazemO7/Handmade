import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import { AuthProvider } from '../context/AuthContext';
import { vi } from 'vitest';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isAuthenticated: false,
    loading: false
  }),
  AuthProvider: ({ children }) => <>{children}</>
}));

describe('LoginPage Component', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

});
