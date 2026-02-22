import { useState, useEffect } from "react";
import AuthContext from "./AuthContext.js";
import { login as loginService, register as registerService } from "../../components/auth/auth.services.js";
import { getRoleFromToken, decodeToken } from "./auth.utils.js";

const TOKEN_KEY = "hemalink-token";

function findJwt(obj) {
  if (!obj || typeof obj !== "object") return null;
  for (const val of Object.values(obj)) {
    if (typeof val === "string" && val.split(".").length === 3 && val.length > 40) {
      return val;
    }
  }
  return null;
}

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalView, setModalView] = useState("login");

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        setUser(payload);
        setRole(getRoleFromToken(token));
        setIsAuthenticated(true);
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve) => {
      loginService(
        { email, password },
        (res) => {
          if (res.ok) {
            const token = res.token ?? res.Token ?? res.accessToken ?? res.access_token
              ?? findJwt(res);
            if (token) {
              window.localStorage.setItem(TOKEN_KEY, token);
              const payload = decodeToken(token);
              const userRole = getRoleFromToken(token);
              setUser(payload);
              setRole(userRole);
              setIsAuthenticated(true);
              setShowAuthModal(false);
            }
          }
          resolve(res);
        },
        (err) => {
          resolve({ ok: false, message: err?.message || "Login failed" });
        }
      );
    });
  };

  const register = async (name, email, password) => {
    return new Promise((resolve) => {
      registerService(
        { name, email, password },
        (res) => {
          resolve(res);
        },
        (err) => {
          resolve({ ok: false, message: err?.message || "Registration failed" });
        }
      );
    });
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        showAuthModal,
        setShowAuthModal,
        modalView,
        setModalView,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
