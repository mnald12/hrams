import "../css/scanner.css";
import { insertOne, getOneWithRFID } from "../methods/methods";
import pdlogo from "../pdlogo.png";
import { useState, useEffect, useRef } from "react";

// Configurable time session ranges
const timeRanges = {
  timeInAM: { start: 8, end: 9 },
  timeOutAM: { start: 11, end: 12 },
  timeInPM: { start: 13, end: 14 },
  timeOutPM: { start: 17, end: 18 },
};

const checkAttendance = (employee, scanDate) => {
  const today = scanDate.toDateString();

  // Check if the employee is on leave today
  if (employee.leave.includes(today)) {
    console.log(`Employee ${employee.rfid} is on leave today.`);
    return;
  }

  const hour = scanDate.getHours();

  if (hour >= timeRanges.timeInAM.start && hour < timeRanges.timeInAM.end) {
    console.log("Morning time-in recorded.");
  } else if (
    hour >= timeRanges.timeOutAM.start &&
    hour < timeRanges.timeOutAM.end
  ) {
    console.log("Morning time-out recorded.");
  } else if (
    hour >= timeRanges.timeInPM.start &&
    hour < timeRanges.timeInPM.end
  ) {
    console.log("Afternoon time-in recorded.");
  } else if (
    hour >= timeRanges.timeOutPM.start &&
    hour < timeRanges.timeOutPM.end
  ) {
    console.log("Afternoon time-out recorded.");
  }

  // Check lateness (if scanned after 8 AM but before 10 AM)
  if (hour >= 8 && hour < 10 && !employee.late.includes(today)) {
    employee.late.push(today);
    console.log(`Employee ${employee.rfid} marked as late on ${today}`);
  }

  // Check absence (if scanned after 10 AM and no leave is applied)
  if (
    hour >= 10 &&
    employee.leave.length === 0 &&
    !employee.absent.includes(today)
  ) {
    employee.absent.push(today);
    console.log(`Employee ${employee.rfid} marked as absent on ${today}`);
  }

  // updateEmployee(employee);
};

const Scanner = () => {
  const [lastScan, setLastScan] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lastScan]);

  const handleScan = (event) => {
    const scannedCode = event.target.value.trim();
    if (!scannedCode) return;

    const scanDate = new Date();
    insertOne("scanlog", {
      rfid: scannedCode,
      date: scanDate,
      time: scanDate.toLocaleString(),
    });

    setLastScan({ id: scannedCode, time: scanDate });

    let employee = getOneWithRFID(scannedCode);
    if (!employee) {
      console.log("Employee not found.");
      return;
    }

    checkAttendance(employee, scanDate);
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
