// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {id,name,email,role}
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // optionally fetch profile here
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (type, credentials) => {
    const path = type === 'expert' ? '/auth/login-expert' : '/auth/login-user';
    const res = await API.post(path, credentials);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (type, data) => {
    const path = type === 'expert' ? '/auth/register-expert' : '/auth/register-user';
    const res = await API.post(path, data);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};