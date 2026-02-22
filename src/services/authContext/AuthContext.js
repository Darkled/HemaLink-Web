import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  role: null,
  isAuthenticated: false,
  showAuthModal: false,
  setShowAuthModal: () => {},
  modalView: "login",
  setModalView: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export default AuthContext;
