import { useContext } from "react";
import ThemeContext from "../../../../services/themeContext/ThemeContext";
import AuthContext from "../../../../services/authContext/AuthContext";

const Topbar = () => {
  const { theme, onChangeTheme } = useContext(ThemeContext);
  const { setShowAuthModal } = useContext(AuthContext);

  const handleToggleTheme = () => onChangeTheme();

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 2000,
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleToggleTheme}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowAuthModal(true)}
      >
        Login
      </button>
    </div>
  );
};

export default Topbar;
