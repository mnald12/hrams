import "../css/loginemployee.css";
import { useEffect, useState } from "react";
import {
  getEmployeeAttendance,
  getEmployeeLeaves,
  getOneWithRFID,
  insertOne,
} from "../methods/methods";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/db";
import cryptoRandomString from "crypto-random-string";
import { collection, onSnapshot } from "firebase/firestore";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const EmployeeViewer = ({ employee, setLogout, id }) => {
  const [btnActive, setBtnActive] = useState("profile");
  const [alfFile, setAlfFile] = useState("");
  const [newLeave, setNewLeave] = useState({
    type: "",
    from: "",
    to: "",
  });

  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const getAtt = async () => {
      try {
        const att = await getEmployeeAttendance(employee.id);
        setAttendance(att);
        console.log(id);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    const getLeaves = async () => {
      try {
        const att = await getEmployeeLeaves(employee.id);
        setLeaves(att);
        console.log(att);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    getAtt();
    getLeaves();
  }, [employee.id, id]);

  useEffect(() => {
    const collectionRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(items);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (!employee) return;

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
    gender,
    points = [],
    late = [],
  } = employee;

  const submitApp = async () => {
    if (newLeave.from && newLeave.to && newLeave.type) {
      const laf = ref(
        storage,
        `forms/${alfFile.name + cryptoRandomString({ length: 10 })}`
      );
      const lafSnapshot = await uploadBytes(laf, alfFile);
      const lafUrl = await getDownloadURL(lafSnapshot.ref);

      const isInsert = await insertOne("leave", {
        employeeID: employee.id,
        firstName: firstName,
        lastName: lastName,
        type: newLeave.type,
        from: newLeave.from,
        to: newLeave.to,
        status: "Pending",
        applicationForm: lafUrl,
      });
      if (isInsert) {
        setNewLeave({
          type: "",
          from: "",
          to: "",
        });
      }
    }
  };

  return (
    <div className="employee-viewer">
      <div className="employee-card">
        <div className="employee-avatar">
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
              Request Leave
            </button>
            <button
              className={btnActive === "event" ? "active" : ""}
              onClick={() => {
                setBtnActive("event");
              }}
            >
              Events
            </button>
            <button onClick={() => setLogout(false)}>Logout</button>
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
            </>
          ) : btnActive === "attendance" ? (
            <div className="employee-attendance" style={{ maxHeight: "400px" }}>
              <div className="attendance-summary">
                <div className="attendance-item">
                  <span className="label">Late:</span>
                  <span className="value">{late.length}</span>
                </div>
                <div className="attendance-item">
                  <span className="label">Leave:</span>
                  <span className="value">{leaves.length}</span>
                </div>
              </div>
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
          ) : btnActive === "request" ? (
            <div
              className="leave-form"
              style={{
                width: "100%",
                padding: "20px",
                marginTop: "20px !important",
              }}
            >
              <h2>Request Leave</h2>
              <div className="lfc">
                <div className="inpsg">
                  <h4>From :</h4>
                  <input
                    type="date"
                    value={newLeave.from}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, from: e.target.value })
                    }
                    className="leave-input"
                  />
                </div>
                <div className="inpsg">
                  <h4>To :</h4>
                  <input
                    type="date"
                    value={newLeave.to}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, to: e.target.value })
                    }
                    className="leave-input"
                  />
                </div>
              </div>
              <h4>Leave Type :</h4>
              <select
                value={newLeave.type}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, type: e.target.value })
                }
                className="leave-input"
              >
                <option value="0" selected>
                  Select Leave Type
                </option>
                <option value="Vacation Leave" selected>
                  Vacation Leave
                </option>
                <option value="Sick Leave">Sick Leave</option>
              </select>

              <h4>Leave Application Form :</h4>
              <input
                type="file"
                onChange={(e) => setAlfFile(e.target.files[0])}
                className="leave-input"
              />
              <button
                style={{ marginTop: "12px" }}
                className="leave-button"
                onClick={() => submitApp()}
              >
                Send Request
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                paddingBottom: "20px",
                height: "300px",
              }}
            >
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                selectable={true}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginEmployee = ({ seter, setEmployee, setCardIds }) => {
  const [cardId, setCardId] = useState("");
  const [nf, setNf] = useState(false);
  const [errMsg, setErrMsg] = useState("RFID Not Found!");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cardId) {
      getOneWithRFID("employee", cardId, (emp, exists) => {
        if (exists) {
          setEmployee(emp);
          setCardIds(cardId);
          seter(true);
        } else {
          setErrMsg("RFID Not Found!");
          setNf(true);
          setTimeout(() => {
            setNf(false);
          }, 2000);
        }
      });
    } else {
      setErrMsg("Please enter your RFID.");
      setNf(true);
      setTimeout(() => {
        setNf(false);
      }, 2000);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Employee Login</h2>
        {nf ? (
          <p style={{ color: "red", textAlign: "center" }}>{errMsg}</p>
        ) : (
          ""
        )}

        <label htmlFor="rfid">RFID Card ID</label>
        <input
          type="text"
          id="rfid"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          placeholder="Enter RFID Card ID"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const EmployeeProfile = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [employee, setEmployee] = useState({});
  const [id, setId] = useState("");

  if (isLogin) {
    return (
      <EmployeeViewer employee={employee} setLogout={setIsLogin} id={id} />
    );
  }
  return (
    <div className="container-preview">
      <LoginEmployee
        seter={setIsLogin}
        setEmployee={setEmployee}
        setCardIds={setId}
      />
    </div>
  );
};

export default EmployeeProfile;
