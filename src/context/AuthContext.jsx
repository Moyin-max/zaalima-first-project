import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('opsmind-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const userData = {
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: email.includes('admin') ? 'admin' : 'employee',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=006a61&fontFamily=Helvetica&fontSize=40`,
    };
    setUser(userData);
    try { localStorage.setItem('opsmind-user', JSON.stringify(userData)); } catch {}
    return true;
  };

  const signup = (name, email, password) => {
    const userData = {
      email,
      name,
      role: email.includes('admin') ? 'admin' : 'employee',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=006a61&fontFamily=Helvetica&fontSize=40`,
    };
    setUser(userData);
    try { localStorage.setItem('opsmind-user', JSON.stringify(userData)); } catch {}
    return true;
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('opsmind-user'); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
