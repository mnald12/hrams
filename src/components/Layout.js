import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Profile from "./Profile";
import Settings from "./Settings";
import { useContext } from "react";
import LoginPage from "../pages/Loginpage";
import ActionModal from "./Actionmodal";
import { DataContext } from "../App";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";

const Layout = () => {
  const location = useLocation();
  const {
    type,
    isActionModal,
    setIsActionModal,
    isLogin,
    isAddDepartment,
    isEditDepartment,
  } = useContext(DataContext);

  if (
    location.pathname === "/scanner" ||
    location.pathname === "/scanlog" ||
    location.pathname === "/employee/profile"
  ) {
    return <Outlet />;
  }

  if (!isLogin) {
    return <LoginPage />;
  }

  return (
    <>
      <div
        className="container"
        style={{ maxWidth: "1500px", margin: "0 auto" }}
      >
        <Sidebar />
        <div className="page">
          <Header className="header-z" />
          <Outlet />
          {isActionModal ? (
            <ActionModal
              type={type}
              handleClose={() => setIsActionModal(false)}
            />
          ) : (
            <></>
          )}
          {isAddDepartment ? <AddDepartment /> : <></>}
          {isEditDepartment ? <EditDepartment /> : <></>}
        </div>
      </div>
      <Profile />
      <Settings />
    </>
  );
};

export default Layout;
