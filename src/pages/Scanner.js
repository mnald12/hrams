import "../css/scanner.css";
import {
  insertOne,
  getOneWithRFID,
  addToLate,
  updateTimeInOut,
} from "../methods/methods";
import pdlogo from "../pdlogo.png";
import { useState, useEffect, useRef } from "react";

// Configurable time session ranges
const timeRanges = {
  timeInAM: { start: 8, end: 12 },
  timeOutAM: { start: 12, end: 1 },
  timeInPM: { start: 13, end: 17 },
  timeOutPM: { start: 17, end: 24 },
};

const Scanner = () => {
  const [lastScan, setLastScan] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef(null);

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
      hour12: true, // 12-hour format with AM/PM
    }).format(new Date(date));
  };

  const checkAttendance = (scannedCode, scanDate, employee) => {
    const hour = scanDate.getHours();
    const minute = scanDate.getMinutes();

    // Check if the employee is already in attendance
    if (employee.isOnLeave) {
      alert("Employee is on leave!");
      return;
    }

    // Check if the employee is considered as absent
    if (employee.isOnLeave) {
      alert("Employee is on leave!");
      return;
    }

    // Check if the employee is on leave today
    if (employee.isOnLeave) {
      alert("Employee is on leave!");
      return;
    }

    insertOne("attendance", {
      rfid: scannedCode,
      lastName: employee.lastName,
      firstName: employee.firstName,
      data: scanDate,
      timeInAM: {
        hour: 0,
        minute: 0,
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
    });

    if (hour >= timeRanges.timeInAM.start && hour < timeRanges.timeInAM.end) {
      console.log("Morning time-in recorded.");
      updateTimeInOut("TIAM", employee.id, {
        hour: hour,
        minute: minute,
      });
      if (hour >= 8 && hour < 10) {
        addToLate("employee", employee.id, {
          lateMode: "AM",
          timeInHour: hour,
          timeInMinute: minute,
          lateTime: {
            hour: hour >= 1 ? hour - 8 : 0,
            minute: minute,
          },
        });
      }
    } else if (
      hour >= timeRanges.timeOutAM.start &&
      hour < timeRanges.timeOutAM.end
    ) {
      console.log("Morning time-out recorded.");
      updateTimeInOut("TOAM", employee.id, {
        hour: hour,
        minute: minute,
      });
    } else if (
      hour >= timeRanges.timeInPM.start &&
      hour < timeRanges.timeInPM.end
    ) {
      console.log("Afternoon time-in recorded.");
      updateTimeInOut("TIPM", employee.id, {
        hour: hour,
        minute: minute,
      });
      if (hour >= 1 && hour < 3) {
        addToLate("employee", employee.id, {
          lateMode: "PM",
          timeInHour: hour,
          timeInMinute: minute,
          lateTime: {
            hour: hour >= 1 ? hour - 8 : 0,
            minute: minute,
          },
        });
      }
    } else if (
      hour >= timeRanges.timeOutPM.start &&
      hour < timeRanges.timeOutPM.end
    ) {
      console.log("Afternoon time-out recorded.");
      updateTimeInOut("TOPM", employee.id, {
        hour: hour,
        minute: minute,
      });
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
    const scannedCode = event.target.value.trim();
    if (!scannedCode) return;

    const scanDate = new Date();
    insertOne("scanlog", {
      rfid: scannedCode,
      date: scanDate,
      time: formatDate(scanDate).toLocaleString(),
    });

    setLastScan({
      id: scannedCode,
      time: formatDate(scanDate).toLocaleString(),
    });

    getOneWithRFID("employee", scannedCode, (data, isExist) => {
      if (isExist) {
        checkAttendance(scannedCode, scanDate, data);
      } else {
        console.log("RFID NOT FOUND!");
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
    </div>
  );
};

export default Scanner;
