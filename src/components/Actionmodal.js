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
} from "react-icons/fa";
import { useEffect } from "react";

const ActionModal = ({ type, handleClose }) => {
  const messages = [
    {
      icon: <FaUserPlus className="icon green" />, // Adding Employee Success
      title: "Employee Added",
      message: "The new employee has been added successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Adding Employee Fail
      title: "Employee Addition Failed",
      message: "There was an error adding the employee. Please try again.",
    },
    {
      icon: <FaUserEdit className="icon blue" />, // Updating Employee Success
      title: "Employee Updated",
      message: "Employee details have been updated successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Updating Employee Fail
      title: "Employee Update Failed",
      message:
        "There was an error updating employee details. Please try again.",
    },
    {
      icon: <FaCalendarPlus className="icon orange" />, // Adding Event Success
      title: "Event Added",
      message: "The event has been successfully added to the system.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Adding Event Fail
      title: "Event Addition Failed",
      message: "There was an error adding the event. Please try again.",
    },
    {
      icon: <FaCalendarCheck className="icon green" />, // Adding Leave Success
      title: "Leave Added",
      message: "The leave request has been successfully added.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Adding Leave Fail
      title: "Leave Addition Failed",
      message: "There was an error adding the leave request. Please try again.",
    },
    {
      icon: <FaCheckCircle className="icon blue" />, // Approving Leave
      title: "Leave Approved",
      message: "The leave request has been approved successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Approving Leave Fail
      title: "Leave Approval Failed",
      message:
        "There was an error approving the leave request. Please try again.",
    },
    {
      icon: <FaCalendarTimes className="icon red" />, // Rejecting Leave
      title: "Leave Rejected",
      message: "The leave request has been rejected.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Rejecting Leave Fail
      title: "Leave Rejection Failed",
      message:
        "There was an error rejecting the leave request. Please try again.",
    },
    {
      icon: <FaClock className="icon purple" />, // Attendance Proceed at 6 PM
      title: "Attendance Processed",
      message: "Attendance records have been successfully processed.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Attendance Process Fail
      title: "Attendance Processing Failed",
      message: "There was an error processing attendance. Please try again.",
    },
    {
      icon: <FaTrash className="icon red" />, // Deleting Event
      title: "Event Deleted",
      message: "The event has been deleted successfully.",
    },
    {
      icon: <FaTimesCircle className="icon red" />, // Deleting Event Fail
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
