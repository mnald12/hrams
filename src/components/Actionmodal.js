import "../css/scannermodal.css";
import {
  FaUserPlus,
  FaUserEdit,
  FaCalendarPlus,
  FaCalendarCheck,
  FaCalendarTimes,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useEffect } from "react";

const ActionModal = ({ type, handleClose }) => {
  const messages = [
    {
      icon: <FaUserPlus className="icon green" />, // Adding Employee Success 0
      title: "Employee Added",
      message: "The new employee has been added successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Adding Employee Fail 1
      title: "Employee Addition Failed",
      message: "There was an error adding the employee. Please try again.",
    },
    {
      icon: <FaUserEdit className="icon blue" />, // Updating Employee Success 2
      title: "Employee Updated",
      message: "Employee details have been updated successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Updating Employee Fail 3
      title: "Employee Update Failed",
      message:
        "There was an error updating employee details. Please try again.",
    },
    {
      icon: <FaCalendarPlus className="icon orange" />, // Adding Event Success 4
      title: "Event Added",
      message: "The event has been successfully added to the system.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Adding Event Fail 5
      title: "Event Addition Failed",
      message: "There was an error adding the event. Please try again.",
    },
    {
      icon: <FaCalendarCheck className="icon green" />, // Adding Leave Success 6
      title: "Leave Added",
      message: "The leave request has been successfully added.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Adding Leave Fail 7
      title: "Leave Addition Failed",
      message: "There was an error adding the leave request. Please try again.",
    },
    {
      icon: <FaCheckCircle className="icon blue" />, // Approving Leave 8
      title: "Leave Approved",
      message: "The leave request has been approved successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Approving Leave Fail 9
      title: "Leave Approval Failed",
      message:
        "There was an error approving the leave request. Please try again.",
    },
    {
      icon: <FaCalendarTimes className="icon red" />, // Rejecting Leave 10
      title: "Leave Rejected",
      message: "The leave request has been rejected.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Rejecting Leave Fail 11
      title: "Leave Rejection Failed",
      message:
        "There was an error rejecting the leave request. Please try again.",
    },

    {
      icon: <FaExclamationTriangle className="icon yellow" />, // Inputs Empty 12
      title: "Missing Information",
      message:
        "Some required fields are empty. Please fill in all fields before proceeding.",
    },

    {
      icon: <FaClock className="icon purple" />, // Attendance Proceed at 6 PM 13
      title: "Attendance Processed",
      message: "Attendance records have been successfully processed.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Attendance Process Fail 14
      title: "Attendance Processing Failed",
      message: "There was an error processing attendance. Please try again.",
    },
    {
      icon: <FaTrash className="icon red" />, // Deleting Event 15
      title: "Event Deleted",
      message: "The event has been deleted successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Deleting Event Fail 16
      title: "Event Deletion Failed",
      message: "There was an error deleting the event. Please try again.",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          {messages[type].icon}
          <h2 className="modal-title">{messages[type].title}</h2>
          <p className="modal-message">{messages[type].message}</p>
          <button className="modal-close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
