import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  HOD_ADMIN: 'Admin/HoD',
  STAFF: 'Staff/Faculty',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

const DEFAULT_USER = {
  id: 'usr_001',
  username: 'admin_hod',
  name: 'Dr. Sarah Jenkins',
  email: 's.jenkins@campuscommand.edu',
  role: ROLES.HOD_ADMIN,
  department: 'Computer Science & Engineering',
  isFirstLogin: false,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campus_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('campus_auth_token') || 'jwt_mock_token_77812');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campus_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campus_auth_user');
    }
  }, [user]);

  const login = async (username, password) => {
    if (isRateLimited) {
      throw new Error('Too many login attempts. Rate limited for 60 seconds.');
    }

    if (loginAttempts >= 5) {
      setIsRateLimited(true);
      setTimeout(() => {
        setIsRateLimited(false);
        setLoginAttempts(0);
      }, 60000);
      throw new Error('Too many failed attempts. Rate limited.');
    }

    // ── Real backend authentication ────────────────────────────────
    // Calls POST /api/auth/login — backend issues a real HMAC-SHA256 signed JWT.
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Map backend Spring role → frontend ROLES enum
        const roleMap = {
          'ROLE_SUPER_ADMIN': ROLES.SUPER_ADMIN,
          'ROLE_ADMIN_HOD':   ROLES.HOD_ADMIN,
          'ROLE_STAFF':       ROLES.STAFF,
          'ROLE_STUDENT':     ROLES.STUDENT,
          'ROLE_PARENT':      ROLES.PARENT,
        };
        const newUser = {
          id: `usr_${Date.now()}`,
          username: data.username,
          name: data.displayName || data.username,
          email: data.username.includes('@') ? data.username : `${data.username}@alma.edu`,
          role: roleMap[data.role] || ROLES.STUDENT,
          department: 'Computer Science & Engineering',
          isFirstLogin: password === 'change123',
        };
        setUser(newUser);
        setToken(data.token);                                    // Real signed JWT
        localStorage.setItem('campus_auth_token', data.token);   // Stored for API calls
        setLoginAttempts(0);
        return newUser;
      } else if (response.status === 401) {
        setLoginAttempts(prev => prev + 1);
        throw new Error('Invalid username or password.');
      } else {
        throw new Error(`Auth server error: HTTP ${response.status}`);
      }
    } catch (err) {
      // Network error → backend offline → fall back to mock mode for local demo
      if (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        console.warn('[Alma] Backend offline — using mock authentication (demo mode only)');
        return _mockLogin(username, password);
      }
      throw err;
    }
  };

  // ── Mock login fallback (supports preset & newly created users) ────
  const _mockLogin = (username, password) => {
    const u = username.toLowerCase().trim();

    const mockCredentials = {
      'admin_hod':   { role: ROLES.HOD_ADMIN,   name: 'Dr. Sarah Jenkins',             pass: 'hod123'     },
      'super_admin': { role: ROLES.SUPER_ADMIN,  name: 'System Administrator',          pass: 'super123'   },
      'staff_001':   { role: ROLES.STAFF,        name: 'Prof. Marcus Vance',            pass: 'staff123'   },
      'student_001': { role: ROLES.STUDENT,      name: 'Alex Rivera (CS2024-042)',      pass: 'student123' },
      'parent_001':  { role: ROLES.PARENT,       name: 'Elena Rivera (Parent of Alex)', pass: 'parent123'  },
    };

    let record = mockCredentials[u];

    // Dynamic resolution for newly added students, staff, or parents
    if (!record) {
      const isValidPass = password === 'change123' || password === 'student123' || password === 'staff123' || password === 'parent123' || password === 'hod123' || password === 'super123' || password.toLowerCase() === u;
      if (isValidPass) {
        if (u.startsWith('emp') || u.startsWith('stf') || u.includes('staff') || u.includes('prof') || u.includes('dr') || password === 'staff123') {
          record = { role: ROLES.STAFF, name: `Faculty Member (${username})`, pass: password };
        } else if (u.startsWith('parent') || u.includes('parent') || password === 'parent123') {
          record = { role: ROLES.PARENT, name: `Parent Account (${username})`, pass: password };
        } else if (u.includes('admin') || u.includes('hod') || password === 'hod123') {
          record = { role: ROLES.HOD_ADMIN, name: `Admin/HoD (${username})`, pass: password };
        } else if (u.includes('super') || password === 'super123') {
          record = { role: ROLES.SUPER_ADMIN, name: `Super Admin (${username})`, pass: password };
        } else {
          record = { role: ROLES.STUDENT, name: `Student (${username})`, pass: password };
        }
      }
    }

    if (!record) {
      setLoginAttempts(prev => prev + 1);
      throw new Error('Invalid username or password.');
    }

    const mockToken = `mock_jwt_${Date.now()}`;
    const newUser = {
      id: `usr_${Date.now()}`,
      username,
      name: record.name,
      email: username.includes('@') ? username : `${username}@alma.edu`,
      role: record.role,
      department: 'Computer Science & Engineering',
      isFirstLogin: password === 'change123',
    };
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('campus_auth_token', mockToken);
    setLoginAttempts(0);
    return newUser;
  };


  const completeFirstLoginPasswordChange = (newPassword) => {
    if (!user) return;
    const updated = { ...user, isFirstLogin: false };
    setUser(updated);
  };

  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === ROLES.SUPER_ADMIN ? 'System Administrator' :
            newRole === ROLES.STAFF ? 'Prof. Marcus Vance' :
            newRole === ROLES.STUDENT ? 'Alex Rivera (CS2024-042)' :
            newRole === ROLES.PARENT ? 'Elena Rivera (Parent)' : 'Dr. Sarah Jenkins'
    }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_auth_user');
    localStorage.removeItem('campus_auth_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      switchRole,
      completeFirstLoginPasswordChange,
      isRateLimited
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
