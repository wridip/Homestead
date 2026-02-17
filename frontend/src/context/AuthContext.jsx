import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_STATE_INITIALIZED':
      return {
        ...state,
        isAuthenticated: !!action.payload.user,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await api.get('/me');
          const user = response.data;
          dispatch({
            type: 'AUTH_STATE_INITIALIZED',
            payload: { user, token },
          });
        } catch (error) {
          console.error('Token verification failed', error);
          dispatch({ type: 'AUTH_STATE_INITIALIZED', payload: { user: null, token: null } });
        }
      } else {
        dispatch({ type: 'AUTH_STATE_INITIALIZED', payload: { user: null, token: null } });
      }
    };

    verifyToken();
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    dispatch({
      type: 'LOGIN',
      payload: { user: userData.user, token: userData.token },
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
  }), [state, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;