import "../css/sidebar.css";
import pdlogo from "../pdlogo.png";
import { Link, useLocation } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { TbFileCertificate } from "react-icons/tb";
import { IoIosPeople } from "react-icons/io";
import { MdListAlt } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { FcDepartment } from "react-icons/fc";
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
              onClick={() => {
                setNavActive("Dashboard");
                sessionStorage.setItem("navActive", "Dashboard");
              }}
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
              onClick={() => {
                setNavActive("Employee");
                sessionStorage.setItem("navActive", "Employee");
              }}
            >
              <IoIosPeople className="icn" /> <span>Employee</span>
            </Link>
            <Link
              className={
                location.pathname === "/department"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/department"
              onClick={() => {
                setNavActive("Department");
                sessionStorage.setItem("navActive", "Department");
              }}
            >
              <FcDepartment className="icn" /> <span>Department</span>
            </Link>
            <Link
              className={
                location.pathname === "/attendance"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/attendance"
              onClick={() => {
                setNavActive("Today's Attendance");
                sessionStorage.setItem("navActive", "Today's Attendance");
              }}
            >
              <TbFileCertificate className="icn" />{" "}
              <span>Today's Attendance</span>
            </Link>
            <Link
              className={
                location.pathname === "/allattendance"
                  ? "side-btn active"
                  : "side-btn"
              }
              to="/allattendance"
              onClick={() => {
                setNavActive("All Attendance");
                sessionStorage.setItem("navActive", "All Attendance");
              }}
            >
              <TbFileCertificate className="icn" /> <span>All Attendance</span>
            </Link>
            <Link
              className={
                location.pathname === "/leave" ? "side-btn active" : "side-btn"
              }
              to="/leave"
              onClick={() => {
                setNavActive("Leave Management");
                sessionStorage.setItem("navActive", "Leave Management");
              }}
            >
              <MdListAlt className="icn" /> <span>Leave Management</span>
            </Link>
            <Link
              className={
                location.pathname === "/events" ? "side-btn active" : "side-btn"
              }
              to="/events"
              onClick={() => {
                setNavActive("Events");
                sessionStorage.setItem("navActive", "Events");
              }}
            >
              <MdEventNote className="icn" /> <span>Events</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
