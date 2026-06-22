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
        loading: false,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const verifySession = async () => {
      try {
        // The HTTPOnly cookie is sent automatically by the browser (withCredentials: true).
        // If it's valid the server returns the user profile; otherwise it 401s.
        const response = await api.get('/me');
        dispatch({
          type: 'AUTH_STATE_INITIALIZED',
          payload: { user: response.data },
        });
      } catch (error) {
        dispatch({ type: 'AUTH_STATE_INITIALIZED', payload: { user: null } });
      }
    };

    verifySession();
  }, []);

  const login = useCallback((userData) => {
    dispatch({
      type: 'LOGIN',
      payload: { user: userData.user },
    });
  }, []);

  const logout = useCallback(() => {
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