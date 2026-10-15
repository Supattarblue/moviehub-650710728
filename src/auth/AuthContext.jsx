import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../api/backend';

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
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.member);
      }
      return data;
    } catch (err) {
      // ดึงเฉพาะข้อความ String ออกมา throw เสมอ เพื่อป้องกันปัญหา [object Object]
      const message = typeof err === 'string' ? err : (err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);