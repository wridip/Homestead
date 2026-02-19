import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext.jsx';
import ProtectedRoute from '../ProtectedRoute.jsx';

const TestComponent = () => <div>Protected Content</div>;
const HomePage = () => <div>Home Page</div>;

const renderWithRouter = (authContextValue, initialEntries = ['/protected']) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
          <Route element={<ProtectedRoute roles={['Host']} />}>
            <Route path="/host" element={<div>Host Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute', () => {
  it('should redirect unauthenticated users to the login page', () => {
    const authContextValue = {
      isAuthenticated: false,
      user: null,
      loading: false,
    };
    renderWithRouter(authContextValue);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should allow authenticated users to access the route', () => {
    const authContextValue = {
      isAuthenticated: true,
      user: { name: 'Test User', role: 'Traveler' },
      loading: false,
    };
    renderWithRouter(authContextValue);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show a loading indicator while auth state is loading', () => {
    const authContextValue = {
      isAuthenticated: false,
      user: null,
      loading: true,
    };
    renderWithRouter(authContextValue);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect users without the required role', () => {
    const authContextValue = {
      isAuthenticated: true,
      user: { name: 'Test User', role: 'Traveler' },
      loading: false,
    };
    renderWithRouter(authContextValue, ['/host']);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Host Page')).not.toBeInTheDocument();
  });

  it('should allow users with the required role to access the route', () => {
    const authContextValue = {
      isAuthenticated: true,
      user: { name: 'Test User', role: 'Host' },
      loading: false,
    };
    renderWithRouter(authContextValue, ['/host']);

    expect(screen.getByText('Host Page')).toBeInTheDocument();
  });
});
