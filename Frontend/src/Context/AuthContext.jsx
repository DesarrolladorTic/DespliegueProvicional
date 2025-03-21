import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dummyToken");
    if (token) {
      // Si hay un token dummy, recuperamos el usuario almacenado en localStorage o usamos valores fijos.
      const storedUser = localStorage.getItem("dummyUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setAuthenticated(true);
      }
    }
    setLoadingAuth(false);
  }, []);

  const login = async (email, password) => {
    // Simulación: si el email es "admin@test.com" y password "admin", asignamos rol admin.
    // De lo contrario, se asigna rol user.
    let role = "user";
    if (email === "admin@test.com" && password === "admin") {
      role = "admin";
    }
    const dummyToken = "dummyToken";
    localStorage.setItem("dummyToken", dummyToken);
    const dummyUser = { user_id: "1", email, role };
    localStorage.setItem("dummyUser", JSON.stringify(dummyUser));
    setUser(dummyUser);
    setAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("dummyToken");
    localStorage.removeItem("dummyUser");
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
