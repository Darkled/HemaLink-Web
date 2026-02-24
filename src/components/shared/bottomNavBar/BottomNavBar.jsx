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
  cilAccountLogout,
  cilMoon,
  cilSun,
  cilList,
} from "@coreui/icons";

import "./bottomNavBar.css";

const BottomNavBar = () => {
  const { theme, onChangeTheme } = useContext(ThemeContext);
  const { isAuthenticated, role, setShowAuthModal, logout } = useContext(AuthContext);

  const handleToggleTheme = () => {
    onChangeTheme();
  };

  return (
    <nav className="bottom-nav-bar noselect">
      <div className="nav-items">
        {isAuthenticated && role === ROLES.REQUESTER && (
          <NavLink
            to="/your-campaigns"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title="Your Campaigns"
          >
            <CIcon icon={cilList} className="nav-icon" />
            <span className="nav-label">Your Campaigns</span>
          </NavLink>
        )}
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
          </>
        )}
        {isAuthenticated && role >= ROLES.ADMIN && (
          <NavLink
            to="/moderators"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title="Moderators"
          >
            <CIcon icon={cilPeople} className="nav-icon" />
            <span className="nav-label">Moderators</span>
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
