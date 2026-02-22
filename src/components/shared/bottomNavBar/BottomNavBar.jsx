import { NavLink } from "react-router-dom";
import { useContext } from "react";
import ThemeContext from "../../../services/themeContext/ThemeContext";
import AuthContext from "../../../services/authContext/AuthContext";
import { THEME } from "../../../services/themeContext/ThemeContext.const";
import { ROLES } from "../../../services/authContext/auth.utils";

import CIcon from "@coreui/icons-react";
import {
  cilDrop,
  cilUser,
  cilPeople,
  cilHospital,
  cilCalendar,
  cilSettings,
  cilAccountLogout,
  cilMoon,
  cilSun,
} from "@coreui/icons";

import "./BottomNavBar.css";

const BottomNavBar = () => {
  const { theme, onChangeTheme } = useContext(ThemeContext);
  const { isAuthenticated, role, setShowAuthModal, logout } = useContext(AuthContext);

  const handleToggleTheme = () => {
    onChangeTheme();
  };

  return (
    <nav className="bottom-nav-bar noselect">
      <div className="nav-items">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          title="Donations"
        >
          <CIcon icon={cilDrop} className="nav-icon" />
          <span className="nav-label">Donations</span>
        </NavLink>
        {isAuthenticated && role >= ROLES.MODERATOR && (
          <>
            <NavLink
              to="/donors"
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              title="Donors"
            >
              <CIcon icon={cilPeople} className="nav-icon" />
              <span className="nav-label">Donors</span>
            </NavLink>
            <NavLink
              to="/entities"
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              title="Entities"
            >
              <CIcon icon={cilHospital} className="nav-icon" />
              <span className="nav-label">Entities</span>
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              title="Appointments"
            >
              <CIcon icon={cilCalendar} className="nav-icon" />
              <span className="nav-label">Appointments</span>
            </NavLink>
          </>
        )}
        {isAuthenticated && role >= ROLES.ADMIN && (
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title="Settings"
          >
            <CIcon icon={cilSettings} className="nav-icon" />
            <span className="nav-label">Settings</span>
          </NavLink>
        )}
      </div>

      <div className="nav-actions">
        <button
          onClick={handleToggleTheme}
          className="nav-action-button"
          title={theme === THEME.DARK ? "Light Mode" : "Dark Mode"}
          aria-label={theme === THEME.DARK ? "Light Mode" : "Dark Mode"}
        >
          <CIcon
            icon={theme === THEME.DARK ? cilSun : cilMoon}
            className="nav-icon"
          />
        </button>

        {!isAuthenticated ? (
          <button
            onClick={() => setShowAuthModal(true)}
            className="nav-action-button"
            title="Login"
            aria-label="Login"
          >
            <CIcon icon={cilUser} className="nav-icon" />
          </button>
        ) : (
          <button
            onClick={() => logout()}
            className="nav-action-button logout-button"
            title="Logout"
            aria-label="Logout"
          >
            <CIcon icon={cilAccountLogout} className="nav-icon" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default BottomNavBar;
