import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Profile from "./Profile";
import Settings from "./Settings";
import Addemployee from "./Addemployee";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/scanner" ? (
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
          <Addemployee />
        </>
      )}
    </>
  );
};

export default Layout;
