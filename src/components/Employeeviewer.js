import { useState } from "react";
import "../css/loginemployee.css";

const EmployeeViewer = ({ employee, attendance, leaves }) => {
  const [btnActive, setBtnActive] = useState("profile");

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
    position,
    rfid,
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
            <table>
              <thead style={{ paddingTop: "0 !important" }}>
                <tr>
                  <th width="15%">Date</th>
                  <th width="15%">Time in</th>
                  <th width="15%">Time out</th>
                  <th width="15%">Time in</th>
                  <th width="15%">Time out</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((e, i) => (
                  <tr key={i}>
                    <td>{e.date}</td>
                    <td>
                      {e.timeInAM.hour ? (
                        <>
                          {e.timeInAM.hour <= 9
                            ? `0${e.timeInAM.hour}`
                            : e.timeInAM.hour}{" "}
                          :{" "}
                          {e.timeInAM.minute <= 9
                            ? `0${e.timeInAM.minute}`
                            : e.timeInAM.minute}{" "}
                          AM
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {e.timeOutAM.hour ? (
                        <>
                          {e.timeOutAM.hour <= 9
                            ? `0${e.timeOutAM.hour}`
                            : e.timeOutAM.hour}{" "}
                          :{" "}
                          {e.timeOutAM.minute <= 9
                            ? `0${e.timeOutAM.minute}`
                            : e.timeOutAM.minute}{" "}
                          AM
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {e.timeInPM.hour ? (
                        <>
                          {e.timeInPM.hour <= 9
                            ? `0${e.timeInPM.hour}`
                            : e.timeInPM.hour}{" "}
                          :{" "}
                          {e.timeInPM.minute <= 9
                            ? `0${e.timeInPM.minute}`
                            : e.timeInPM.minute}{" "}
                          PM
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {e.timeOutPM.hour ? (
                        <>
                          {e.timeOutPM.hour <= 9
                            ? `0${e.timeOutPM.hour}`
                            : e.timeOutPM.hour}{" "}
                          :{" "}
                          {e.timeOutPM.minute <= 9
                            ? `0${e.timeOutPM.minute}`
                            : e.timeOutPM.minute}{" "}
                          PM
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    <td>{l.date.toDate().toISOString().split("T")[0]}</td>
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
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewer;
