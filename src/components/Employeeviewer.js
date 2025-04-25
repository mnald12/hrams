import { useContext, useEffect, useState } from "react";
import "../css/loginemployee.css";
import ExcelViewer from "./Excelviewer";
import { download } from "../methods/methods";
import { FaEye } from "react-icons/fa";
import { DataContext } from "../App";
import { Link } from "react-router-dom";

const EmployeeViewer = ({ employee, attendance, leaves }) => {
  const [btnActive, setBtnActive] = useState("profile");
  const [newAtt, setNewAtt] = useState([]);

  const { setNavActive, setMonthlyToView } = useContext(DataContext);

  useEffect(() => {
    const groupByMonthAndYear = (data) => {
      const grouped = {};

      data.forEach((entry) => {
        if (entry.date) {
          const dateObj = new Date(entry.date);
          const month = dateObj.toLocaleString("default", { month: "long" });
          const year = dateObj.getFullYear();
          const key = `${month} ${year}`;

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push(entry);
        }
      });

      const result = Object.entries(grouped)
        .map(([monthYear, attendance]) => ({
          month: monthYear,
          attendance,
        }))
        .sort((a, b) => {
          const aDate = new Date(a.attendance[0].date);
          const bDate = new Date(b.attendance[0].date);
          return aDate - bDate;
        });

      return result;
    };

    if (attendance.length > 0) {
      const grouped = groupByMonthAndYear(attendance);
      setNewAtt(grouped);
      console.log(grouped);
    }
  }, [attendance]);

  if (!employee) return null;

  const {
    avatar,
    firstName,
    middleName,
    lastName,
    email,
    phone,
    address,
    age,
    gender,
    employed,
    department,
    position,
    rfid,
    pds,
    points = [],
    late,
    absent,
  } = employee;

  return (
    <div
      className="employee-viewers"
      style={{ padding: "0", marginTop: "16px", background: "white" }}
    >
      <div className="employee-cards" style={{ height: "480px" }}>
        <div
          className="employee-avatars"
          style={{ textAlign: "center", position: "relative" }}
        >
          <img
            src={avatar}
            alt={`${firstName} ${lastName}`}
            style={{ marginTop: "12px", borderRadius: "unset" }}
          />
          <div className="pdetails">
            <h3
              style={{ color: "#2C5AA0", fontSize: "26px", fontWeight: "700" }}
            >
              {firstName} {middleName} {lastName}
            </h3>
            <p
              style={{ color: "#555555", fontSize: "17px", fontWeight: "500" }}
            >
              {position}
            </p>
          </div>
        </div>
        <div className="employee-details">
          <div className="navbars">
            <button
              className={btnActive === "profile" ? "active" : ""}
              onClick={() => {
                setBtnActive("profile");
              }}
            >
              Profile
            </button>
            <button
              className={btnActive === "attendance" ? "active" : ""}
              onClick={() => {
                setBtnActive("attendance");
              }}
            >
              Attendance
            </button>
            <button
              className={btnActive === "points" ? "active" : ""}
              onClick={() => {
                setBtnActive("points");
              }}
            >
              Points
            </button>
            <button
              className={btnActive === "leave" ? "active" : ""}
              onClick={() => {
                setBtnActive("leave");
              }}
            >
              Leaves
            </button>
            <button
              className={btnActive === "late" ? "active" : ""}
              onClick={() => {
                setBtnActive("late");
              }}
            >
              Lates
            </button>
            <button
              className={btnActive === "absent" ? "active" : ""}
              onClick={() => {
                setBtnActive("absent");
              }}
            >
              Absents
            </button>

            <button
              id="downbtn"
              onClick={() => {
                download(pds);
                document.getElementById("downbtn").innerText = "Downloading...";
                setTimeout(() => {
                  document.getElementById("downbtn").innerText = "Download PDS";
                }, 1500);
              }}
            >
              Download PDS
            </button>
          </div>
          {btnActive === "profile" ? (
            <div className="profile-container">
              <div className="pc-left">
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  Personal Information
                </h3>
                <div className="detail-row">
                  <span className="label">Age:</span>
                  <span className="value">{age}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Gender:</span>
                  <span className="value">{gender}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">{address}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Employed:</span>
                  <span className="value">{employed}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Department:</span>
                  <span className="value">{department}</span>
                </div>
                <div className="detail-row">
                  <span className="label">RFID:</span>
                  <span className="value">{rfid}</span>
                </div>
              </div>
              <div className="pc-right">
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  Attendances
                </h3>
                <div className="detail-row">
                  <span className="label">Late: </span>
                  <span className="value">{late.length}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Absent: </span>
                  <span className="value">{absent.length}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Leaves: </span>
                  <span className="value">{leaves.length}</span>
                </div>
                <h3
                  style={{
                    color: "black",
                    fontSize: "22px",
                    fontWeight: "600",
                    paddingTop: "12px",
                  }}
                >
                  Current Points
                </h3>
                <div class="points-container">
                  <div class="point-box">
                    <h4>🏥 Sick Leave</h4>
                    <p>
                      Balance:{" "}
                      <b style={{ fontSize: "14px" }}>{points[0].slb}</b>
                    </p>
                    <p>
                      Earned:{" "}
                      <b style={{ fontSize: "14px" }}>{points[0].sle}</b>
                    </p>
                    <p>
                      Spent: <b style={{ fontSize: "14px" }}>{points[0].sls}</b>{" "}
                    </p>
                  </div>
                  <div class="point-box">
                    <h4>🌴 Vacation Leave</h4>
                    <p>
                      Balance:{" "}
                      <b style={{ fontSize: "14px" }}>{points[0].vlb}</b>
                    </p>
                    <p>
                      Earned:{" "}
                      <b style={{ fontSize: "14px" }}>{points[0].vle}</b>
                    </p>
                    <p>
                      Spent: <b style={{ fontSize: "14px" }}>{points[0].vls}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : btnActive === "attendance" ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Date & Year</th>
                    <th>Attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newAtt.map((a, k) => (
                    <tr key={k}>
                      <td>{a.month}</td>
                      <td>{a.attendance.length}</td>
                      <td>
                        <Link
                          title="view"
                          className="add-btn-icn"
                          to={`/employee/profile/attendance`}
                          onClick={() => {
                            setNavActive("View Employee Attendance");
                            setMonthlyToView({
                              name: `${firstName} ${middleName} ${lastName} `,
                              attendance: a.attendance,
                            });
                          }}
                        >
                          <FaEye color="green" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : btnActive === "points" ? (
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>SL Bal</th>
                  <th>SL Earned</th>
                  <th>SL Spent</th>
                  <th>VL Bal</th>
                  <th>VL Earned</th>
                  <th>VL Spent</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point, index) => (
                  <tr key={index}>
                    <td>{point.from}</td>
                    <td>{point.to}</td>
                    <td>{point.slb}</td>
                    <td>{point.sle}</td>
                    <td>{point.sls}</td>
                    <td>{point.vlb}</td>
                    <td>{point.vle}</td>
                    <td>{point.vls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : btnActive === "leave" ? (
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l, i) => (
                  <tr key={i}>
                    <td>{l.type}</td>
                    <td>{l.from}</td>
                    <td>{l.to}</td>
                    <td
                      style={{
                        color: `${
                          l.status === "Approved"
                            ? "green"
                            : l.status === "Rejected"
                            ? "red"
                            : "orange"
                        }`,
                      }}
                    >
                      {l.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : btnActive === "late" ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Late</th>
                </tr>
              </thead>
              <tbody>
                {late.map((l, i) => (
                  <tr key={i}>
                    <td>
                      {l.date
                        ? l.date.toDate().toISOString().split("T")[0]
                        : "Invalid Date"}
                    </td>

                    <td>
                      {String(l.timeInHour % 12 || 12).padStart(2, "0")} :{" "}
                      {String(l.timeInMinute).padStart(2, "0")} {l.lateMode}
                    </td>

                    <td>
                      {l.lateTime.hour === 0
                        ? `${String(l.lateTime.minute).padStart(
                            2,
                            "0"
                          )} Minutes`
                        : `${String(l.lateTime.hour).padStart(
                            2,
                            "0"
                          )} Hours & ${String(l.lateTime.minute).padStart(
                            2,
                            "0"
                          )} Minutes`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <ExcelViewer fileUrl={pds} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewer;
