import "../css/scannermodal.css";
import {
  FaExclamationTriangle,
  FaTimesCircle,
  FaUserCheck,
  FaCalendarTimes,
  FaCheckCircle,
  FaClock,
  FaBan,
} from "react-icons/fa";
import { useEffect } from "react";

const Scannermodal = ({ type, handleClose }) => {
  const messages = [
    {
      icon: <FaTimesCircle className="icon red" />,
      title: "Access Denied",
      message:
        "This RFID card does not belong to any registered employee. Access is restricted.",
    },
    {
      icon: <FaExclamationTriangle className="icon yellow" />,
      title: "Unregistered RFID",
      message:
        "Your RFID card is not linked to your employee profile. Please visit HR to update your records.",
    },
    {
      icon: <FaUserCheck className="icon blue" />,
      title: "Already Scanned",
      message:
        "You have already scanned in this session. No need to scan again.",
    },
    {
      icon: <FaCalendarTimes className="icon orange" />,
      title: "On Leave",
      message:
        "You are currently on leave. Please check with HR if this is incorrect.",
    },
    {
      icon: <FaCheckCircle className="icon green" />,
      title: "Scan Successful",
      message: "Your attendance has been recorded successfully.",
    },
    {
      icon: <FaClock className="icon purple" />,
      title: "Missed Time-In",
      message:
        "You did not scan during the time-in session but scanned during time-out. Please inform HR for corrections.",
    },
    {
      icon: <FaBan className="icon gray" />,
      title: "Invalid Scan Time",
      message:
        "You are attempting to scan outside of the allowed time period. Please check the schedule and try again.",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 1000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          {messages[type].icon}
          <h2 className="modal-title">{messages[type].title}</h2>
          <p className="modal-message">{messages[type].message}</p>
        </div>
      </div>
    </div>
  );
};

export default Scannermodal;
