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
import { useState, useEffect, useRef } from "react";

const Scanner = () => {
  const [lastScan, setLastScan] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalType, setModalType] = useState(0);
  const [btnActive, setBtnActive] = useState("TIAM");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 8 && hour < 11) {
      setBtnActive("TIAM");
    } else if (hour >= 11 && hour < 13) {
      setBtnActive("TOAM");
    } else if (hour >= 13 && hour < 4) {
      setBtnActive("TIPM");
    } else {
      setBtnActive("TOPM");
    }
  }, []);

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

    if (btnActive === "TIAM") {
      if (hour >= 12) {
        setModalType(6);
        setIsShowModal(true);
        return;
      }

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

      if (hour >= 8) {
        if (minute > 0) {
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

          insertOne("lates", {
            employeeID: employee.id,
            employee: `${employee.firstName} ${employee.lastName}`,
            lateMode: "AM",
            timeInHour: hour,
            timeInMinute: minute,
            lateTime: {
              hour: hour >= 1 ? hour - 8 : 0,
              minute: minute,
            },
          });
        }
      }

      setModalType(4);
      setIsShowModal(true);
    } else if (btnActive === "TOAM") {
      if (hour >= 14 || (hour >= 6 && hour <= 9)) {
        setModalType(6);
        setIsShowModal(true);
        return;
      }

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
    } else if (btnActive === "TIPM") {
      if (hour >= 16 || (hour >= 6 && hour <= 11)) {
        setModalType(6);
        setIsShowModal(true);
        return;
      }

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

      if (hour >= 13) {
        if (minute > 0) {
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

          insertOne("lates", {
            employeeID: employee.id,
            employee: `${employee.firstName} ${employee.lastName}`,
            lateMode: "PM",
            timeInHour: hour,
            timeInMinute: minute,
            lateTime: {
              hour: hour >= 1 ? hour - 8 : 0,
              minute: minute,
            },
          });
        }
      }

      setModalType(4);
      setIsShowModal(true);
    } else if (btnActive === "TOPM") {
      if (hour >= 6 && hour <= 15) {
        setModalType(6);
        setIsShowModal(true);
        return;
      }

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
        <div className="scanner-buttons">
          <button
            className={btnActive === "TIAM" ? "active" : ""}
            onClick={() => {
              setBtnActive("TIAM");
            }}
          >
            Time In Morning
          </button>
          <button
            className={btnActive === "TOAM" ? "active" : ""}
            onClick={() => {
              setBtnActive("TOAM");
            }}
          >
            Time Out Morning
          </button>
          <button
            className={btnActive === "TIPM" ? "active" : ""}
            onClick={() => {
              setBtnActive("TIPM");
            }}
          >
            Time In Afternoon
          </button>
          <button
            className={btnActive === "TOPM" ? "active" : ""}
            onClick={() => {
              setBtnActive("TOPM");
            }}
          >
            Time Out Afternoon
          </button>
        </div>
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
