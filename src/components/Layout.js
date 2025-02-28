import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Profile from "./Profile";
import Settings from "./Settings";
import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import LoginPage from "../pages/Loginpage";
import { doc, onSnapshot } from "firebase/firestore";

const Layout = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "profile", "admin");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.isLogin) {
            setIsLogin(true);
          } else {
            setIsLogin(false);
          }
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (location.pathname === "/scanner" || location.pathname === "/scanlog") {
    return <Outlet />;
  }

  if (!isLogin) {
    return <LoginPage />;
  }

  return (
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
  );
};

export default Layout;
