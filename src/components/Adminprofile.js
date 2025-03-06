import { useState } from "react";
import "../css/loginemployee.css";

const Adminprofile = ({ employee, attendance, leaves }) => {
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
    employed,
    position,
    rfid,
    points = [],
  } = employee;

  return (
    <div
      className="employee-viewers"
      style={{ padding: "0", marginTop: "16px" }}
    >
      <div className="employee-cards" style={{ height: "480px" }}>
        <div className="employee-avatars">
          <img
            src={avatar}
            alt={`${firstName} ${lastName}`}
            style={{ marginTop: "12px" }}
          />
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
              className={btnActive === "request" ? "active" : ""}
              onClick={() => {
                setBtnActive("request");
              }}
            >
              Leave Requests
            </button>
          </div>
          {btnActive === "profile" ? (
            <>
              <h2>
                {firstName} {middleName} {lastName}
              </h2>
              <p className="position">{position}</p>
              <div className="detail-row">
                <span className="label">Age:</span>
                <span className="value">{age}</span>
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
            </>
          ) : btnActive === "attendance" ? (
            <div className="employee-attendance">
              <div
                className="leave-form"
                style={{
                  width: "100%",
                  padding: "20px",
                  marginTop: "20px !important",
                }}
              >
                <h2>Attendance</h2>
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
              </div>
            </div>
          ) : btnActive === "points" ? (
            <div className="employee-points">
              <div
                className="leave-form"
                style={{
                  width: "100%",
                  padding: "20px",
                  marginTop: "20px !important",
                }}
              >
                <h2>Points</h2>
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
              </div>
            </div>
          ) : (
            <div className="employee-points">
              <div
                className="leave-form"
                style={{
                  width: "100%",
                  padding: "20px",
                  marginTop: "20px !important",
                }}
              >
                <h2>Leave Requests</h2>
                <table>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((l, i) => (
                      <tr key={i}>
                        <td>{l.from}</td>
                        <td>{l.to}</td>
                        <td>{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminprofile;
