import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('taskboard_token') || sessionStorage.getItem('taskboard_token');
    setIsLoggedIn(!!token);
  }, []);

  const login = (rememberMe) => {
    const token = Date.now().toString();
    if (rememberMe) localStorage.setItem('taskboard_token', token);
    else sessionStorage.setItem('taskboard_token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('taskboard_token');
    sessionStorage.removeItem('taskboard_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
