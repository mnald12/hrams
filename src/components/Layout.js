import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Profile from "./Profile";
import Settings from "./Settings";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/scanner" || location.pathname === "/scanlog" ? (
        <Outlet />
      ) : (
        <>
          <div className="container">
            <Sidebar />
            <div className="page">
              <Header className="header-z" />
              <Outlet />
            </div>
          </div>
          <Profile />
          <Settings />
        </>
      )}
    </>
  );
};

export default Layout;
