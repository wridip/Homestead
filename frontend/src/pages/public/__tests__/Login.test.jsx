import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext.jsx';
import Login from '../Login';
import * as authService from '../../../services/authService';

// Mock the authService
vi.mock('../../../services/authService');

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  it('should allow a user to login successfully', async () => {
    const mockLogin = vi.fn();
    authService.login.mockResolvedValue({
      token: 'fake-token',
      user: { name: 'Test User', email: 'test@example.com', role: 'Traveler' }
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show an error message on failed login', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});