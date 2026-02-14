import { Outlet } from "react-router";
import { useContext } from "react";
import Sidebar from "./shared/sideBar/Sidebar";
import AuthModal from "../auth/AuthModal";
import AuthContext from "../../services/authContext/AuthContext";
import Topbar from "./shared/topBar/Topbar";

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="app">
      <AuthModal />
      <section>
        {isAuthenticated ? <Sidebar /> : <Topbar />}
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Dashboard;
