import "../css/sidebar.css";
import pdlogo from "../pdlogo.jpg";
import { Link, useLocation } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { TbFileCertificate, TbAdjustmentsStar } from "react-icons/tb";
import { RiFolderChartFill } from "react-icons/ri";
import { IoIosPeople } from "react-icons/io";
import { fold, unFold } from "../methods/navMethods";
import { useContext } from "react";
import { DataContext } from "../App";

const Sidebar = () => {
  const location = useLocation();

  const { setNavActive } = useContext(DataContext);

  return (
    <>
      <div className="sidebar" id="sidebar">
        <div className="btn-container">
          <div className="nav-brand" id="brand">
            <div className="brand-logo">
              <img alt="" src={pdlogo} />
            </div>
            <h3 id="brandname">PDHRAMS</h3>
            <button onClick={() => fold()} className="menu" id="menuFold">
              <AiOutlineLeft />
            </button>
            <button onClick={() => unFold()} className="menu" id="menuUnfold">
              <AiOutlineRight />
            </button>
          </div>
          <div className="btns">
            <Link
              className={
                location.pathname === "/dashboard" || location.pathname === "/"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/dashboard"
              onClick={() => setNavActive("Dashboard")}
            >
              <BiSolidDashboard className="icn" /> <span>Dashboard</span>
            </Link>
            <Link
              className={
                location.pathname === "/employee"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/employee"
              onClick={() => setNavActive("Employee")}
            >
              <IoIosPeople className="icn" /> <span>Employee</span>
            </Link>
            <Link
              className={
                location.pathname === "/attendance"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/attendance"
              onClick={() => setNavActive("Attendance")}
            >
              <TbFileCertificate className="icn" /> <span>Attendance</span>
            </Link>
            <Link
              className={
                location.pathname === "/performance"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/performance"
              onClick={() => setNavActive("Perfomance")}
            >
              <RiFolderChartFill className="icn" /> <span>Perfomance</span>
            </Link>
            <Link
              className={
                location.pathname === "/scanlog"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/scanlog"
              onClick={() => setNavActive("Scan Log")}
            >
              <TbAdjustmentsStar className="icn" /> <span>Scan Log</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
