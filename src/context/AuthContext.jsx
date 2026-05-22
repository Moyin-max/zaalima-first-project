import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
});

const CURRENT_USER_KEY = 'opsmind-user';
const USERS_KEY = 'opsmind-users';

const demoUsers = [
  {
    name: 'Employee Demo',
    email: 'employee@company.com',
    password: 'Secure@123',
    role: 'employee',
  },
  {
    name: 'Admin Demo',
    email: 'admin@company.com',
    password: 'Admin@Secure#1',
    role: 'admin',
  },
];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function buildAvatarSeed(seed) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=006a61&fontFamily=Helvetica&fontSize=40`;
}

function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}

  const seededUsers = demoUsers.map((account) => ({
    ...account,
    email: normalizeEmail(account.email),
    avatar: buildAvatarSeed(account.name),
  }));

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers));
  } catch {}

  return seededUsers;
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const users = readUsers();
    const account = users.find(
      (candidate) => candidate.email === normalizedEmail && candidate.password === password
    );

    if (!account) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const userData = {
      email: account.email,
      name: account.name,
      role: account.role,
      avatar: account.avatar || buildAvatarSeed(account.name),
    };

    setUser(userData);
    try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData)); } catch {}
    return { ok: true, user: userData };
  };

  const signup = (name, email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const users = readUsers();

    if (users.some((candidate) => candidate.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const newAccount = {
      email: normalizedEmail,
      name: String(name || '').trim(),
      password,
      role: normalizedEmail.includes('admin') ? 'admin' : 'employee',
      avatar: buildAvatarSeed(name),
    };

    writeUsers([...users, newAccount]);

    const userData = {
      email: newAccount.email,
      name: newAccount.name,
      role: newAccount.role,
      avatar: newAccount.avatar,
    };

    setUser(userData);
    try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData)); } catch {}
    return { ok: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(CURRENT_USER_KEY); } catch {}
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
