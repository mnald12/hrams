import "../css/scannermodal.css";
import {
  FaExclamationTriangle,
  FaTimesCircle,
  FaUserCheck,
  FaCalendarTimes,
} from "react-icons/fa";

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
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          {messages[type].icon}
          <h2 className="modal-title">{messages[type].title}</h2>
          <p className="modal-message">{messages[type].message}</p>
          <button className="modal-button" onClick={handleClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scannermodal;
