import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext.jsx';
import Signup from '../Signup';
import * as authService from '../../../services/authService';

// Mock the authService
vi.mock('../../../services/authService');

// Mock react-router-dom's useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});


const renderWithProviders = (ui) => {
  const { container, ...rest } = render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
  return { container, ...rest };
};

describe('Signup Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should show an error message on signup with an invalid email format', async () => {
    authService.signup.mockRejectedValue({
      response: { data: { message: 'Invalid email format' } },
    });

    const { container } = renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }, // Invalid email format
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });
    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'Traveler',
      });
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('should show an error message when passwords do not match', async () => {
    const { container } = renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'different-password' }, // Passwords do not match
    });
    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      expect(authService.signup).not.toHaveBeenCalled(); // signup service should not be called
    });
  });

  it('should allow a user to sign up successfully', async () => {
    const mockUser = { name: 'New User', email: 'new@example.com', role: 'Traveler' };
    authService.signup.mockResolvedValue({ token: 'new-token', user: mockUser });

    const { container } = renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: mockUser.name },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: mockUser.email },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /traveler/i })); // Ensure Traveler role is selected
    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: 'password123',
        role: 'Traveler',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should allow a host to sign up successfully', async () => {
    const mockUser = { name: 'Host User', email: 'host@example.com', role: 'Host' };
    authService.signup.mockResolvedValue({ token: 'host-token', user: mockUser });

    const { container } = renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: mockUser.name },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: mockUser.email },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /host/i })); // Select Host role
    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: 'password123',
        role: 'Host',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
