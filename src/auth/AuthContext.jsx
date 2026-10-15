import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../api/backend';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          logout();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.member);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  // ตรงตามลำดับที่ backend.js คาดหวัง: (email, password, displayName)
  const register = async (email, password, displayName) => {
    try {
      const data = await apiRegister(email, password, displayName);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.member);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);