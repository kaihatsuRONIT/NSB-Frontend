'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/users/profile');
      if (data?.id) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    const data = await api.post('/auth/register', { name, email, password, phone });
    if (data?.message === 'Registered successfully') {
      await fetchProfile();
    } else {
      throw new Error(data?.message || 'Registration failed');
    }
    return data;
  };

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data?.message === 'Logged in successfully') {
      await fetchProfile();
    } else {
      throw new Error(data?.message || 'Invalid credentials');
    }
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);