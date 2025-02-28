import { DataContext } from "../App";
import Scannermodal from "../components/Scannermodal";
import "../css/scanner.css";
import {
  insertOne,
  getOneWithRFID,
  addToLate,
  updateTimeInOut,
  checkEmployeeInAttendance,
  checkSession,
} from "../methods/methods";
import pdlogo from "../pdlogo.png";
import { useState, useEffect, useRef, useContext } from "react";

const timeRanges = {
  timeInAM: { start: 5, end: 11 },
  timeOutAM: { start: 11, end: 12 },
  timeInPM: { start: 12, end: 15 },
  timeOutPM: { start: 16, end: 19 },
};

const Scanner = () => {
  const [lastScan, setLastScan] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalType, setModalType] = useState(0);
  const { setTodaysLate } = useContext(DataContext);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  const checkAttendance = async (scannedCode, scanDate, employee) => {
    const hour = scanDate.getHours();
    const minute = scanDate.getMinutes();

    if (employee.isOnLeave) {
      setModalType(3);
      setIsShowModal(true);
      return;
    }

    if (hour >= timeRanges.timeInAM.start && hour < timeRanges.timeInAM.end) {
      const isScanned = await checkSession(employee.id, "TIME_IN_AM");

      if (isScanned) {
        setModalType(2);
        setIsShowModal(true);
        return;
      }

      const isInAttendance = await checkEmployeeInAttendance(employee.id);

      if (!isInAttendance) {
        insertOne("attendance", {
          rfid: scannedCode,
          employeeID: employee.id,
          avatar: employee.avatar,
          lastName: employee.lastName,
          firstName: employee.firstName,
          date: scanDate.toISOString().split("T")[0],
          timeInAM: {
            hour: hour,
            minute: minute,
          },
          timeInPM: {
            hour: 0,
            minute: 0,
          },
          timeOutAM: {
            hour: 0,
            minute: 0,
          },
          timeOutPM: {
            hour: 0,
            minute: 0,
          },
          sessions: {
            timeInAmDone: true,
            timeInPmDone: false,
            timeOutAmDone: false,
            timeOutPmDone: false,
          },
        });
      }

      if (hour >= 8 && hour <= 10) {
        addToLate("employee", employee.id, {
          date: scanDate,
          lateMode: "AM",
          timeInHour: hour,
          timeInMinute: minute,
          lateTime: {
            hour: hour >= 1 ? hour - 8 : 0,
            minute: minute,
          },
        });
        setTodaysLate((prevCount) => prevCount + 1);
      }

      setModalType(4);
      setIsShowModal(true);
    } else if (
      hour >= timeRanges.timeOutAM.start &&
      hour < timeRanges.timeOutAM.end
    ) {
      const isScanned = await checkSession(employee.id, "TIME_OUT_AM");

      if (isScanned) {
        setModalType(2);
        setIsShowModal(true);
        return;
      }

      const isInAttendance = await checkEmployeeInAttendance(employee.id);

      if (!isInAttendance) {
        setModalType(5);
        setIsShowModal(true);
        return;
      }

      updateTimeInOut(employee.id, {
        timeOutAM: {
          hour: hour,
          minute: minute,
        },
        sessions: {
          timeOutAmDone: true,
        },
      });

      setModalType(4);
      setIsShowModal(true);
    } else if (
      hour >= timeRanges.timeInPM.start &&
      hour <= timeRanges.timeInPM.end
    ) {
      const isScanned = await checkSession(employee.id, "TIME_IN_PM");

      if (isScanned) {
        setModalType(2);
        setIsShowModal(true);
        return;
      }

      const isInAttendance = await checkEmployeeInAttendance(employee.id);

      if (!isInAttendance) {
        insertOne("attendance", {
          rfid: scannedCode,
          employeeID: employee.id,
          avatar: employee.avatar,
          lastName: employee.lastName,
          firstName: employee.firstName,
          date: scanDate.toISOString().split("T")[0],
          timeInAM: {
            hour: 0,
            minute: 0,
          },
          timeInPM: {
            hour: hour,
            minute: minute,
          },
          timeOutAM: {
            hour: 0,
            minute: 0,
          },
          timeOutPM: {
            hour: 0,
            minute: 0,
          },
          sessions: {
            timeInAmDone: false,
            timeInPmDone: true,
            timeOutAmDone: false,
            timeOutPmDone: false,
          },
        });
      }

      updateTimeInOut(employee.id, {
        timeInPM: {
          hour: hour,
          minute: minute,
        },
        sessions: {
          timeInPmDone: true,
        },
      });

      if (hour >= 13 && hour <= 15) {
        addToLate("employee", employee.id, {
          date: scanDate,
          lateMode: "PM",
          timeInHour: hour,
          timeInMinute: minute,
          lateTime: {
            hour: hour > 13 ? hour - 13 : 0,
            minute: minute,
          },
        });
        setTodaysLate((prevCount) => prevCount + 1);
      }

      setModalType(4);
      setIsShowModal(true);
    } else if (
      hour >= timeRanges.timeOutPM.start &&
      hour < timeRanges.timeOutPM.end
    ) {
      const isScanned = await checkSession(employee.id, "TIME_OUT_PM");

      if (isScanned) {
        setModalType(2);
        setIsShowModal(true);
        return;
      }

      const isInAttendance = await checkEmployeeInAttendance(employee.id);

      if (!isInAttendance) {
        setModalType(5);
        setIsShowModal(true);
        return;
      }

      updateTimeInOut(employee.id, {
        timeOutPM: {
          hour: hour,
          minute: minute,
        },
        sessions: {
          timeOutPmDone: true,
        },
      });

      setModalType(4);
      setIsShowModal(true);
    }
  };

  const focusInput = () => {
    if (document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      focusInput();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleScan = (event) => {
    setIsShowModal(false);
    const scannedCode = event.target.value.trim();
    if (!scannedCode) return;

    const scanDate = new Date();

    insertOne("scanlog", {
      rfid: scannedCode,
      time: formatDate(scanDate).toLocaleString(),
      date: scanDate,
    });

    setLastScan({
      id: scannedCode,
      time: formatDate(scanDate).toLocaleString(),
    });

    getOneWithRFID("employee", scannedCode, (data, isExist) => {
      if (isExist) {
        checkAttendance(scannedCode, scanDate, data);
      } else {
        setModalType(0);
        setIsShowModal(true);
        return;
      }
    });

    event.target.value = "";
  };

  return (
    <div className="container">
      <div className="scanner-box">
        <img alt="PD Logo" className="scanner-logo" src={pdlogo} />
        <h1>PDHRAMS RFID Scanner</h1>
        <p>Scan your RFID card</p>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          className="hidden-input"
          onKeyDown={(e) => e.key === "Enter" && handleScan(e)}
        />
        <div className="time-box">
          <p>Current Time:</p>
          <p className="time">{currentTime.toLocaleString()}</p>
        </div>
        {lastScan && (
          <div className="last-scan-box">
            <p>Last Scan:</p>
            <p className="scan-id">ID: {lastScan.id}</p>
            <p className="scan-time">
              Scanned at: {lastScan.time.toLocaleString()}
            </p>
          </div>
        )}
      </div>
      {isShowModal ? (
        <>
          <div className="modal-scanner" id="modal-scanner">
            <div className="scanner-not-exist">
              <Scannermodal
                type={modalType}
                handleClose={() => setIsShowModal(false)}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Scanner;
