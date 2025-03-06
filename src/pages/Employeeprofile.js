import "../css/loginemployee.css";
import { useState } from "react";
import { getOneWithRFID, insertOne } from "../methods/methods";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/db";
import cryptoRandomString from "crypto-random-string";

const EmployeeViewer = ({ employee, setLogout }) => {
  const [btnActive, setBtnActive] = useState("profile");
  const [alfFile, setAlfFile] = useState("");
  const [newLeave, setNewLeave] = useState({
    type: "",
    from: "",
    to: "",
  });

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
    late = [],
    absent = [],
    leave = [],
    points = [],
  } = employee;

  const convertTo12Hour = (hour, minute) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const minuteStr = minute.toString().padStart(2, "0");
    return `${hour12}:${minuteStr} ${ampm}`;
  };

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
              <h3>Attendance</h3>
              <div className="attendance-summary">
                <div className="attendance-item">
                  <span className="label">Late:</span>
                  <span className="value">{late.length}</span>
                </div>
                <div className="attendance-item">
                  <span className="label">Absent:</span>
                  <span className="value">{absent.length}</span>
                </div>
                <div className="attendance-item">
                  <span className="label">Leave:</span>
                  <span className="value">{leave.length}</span>
                </div>
              </div>
              {late.length > 0 && (
                <div className="attendance-details">
                  <h4>Late Details</h4>
                  <ul>
                    {late.map((item, index) => (
                      <li key={index}>
                        {convertTo12Hour(item.timeInHour, item.timeInMinute)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : btnActive === "points" ? (
            <div className="employee-points">
              <h3>Points</h3>
              <ul>
                {points.map((point, index) => (
                  <li key={index} className="point-item">
                    <p>
                      <strong>Period:</strong> {point.from} - {point.to}
                    </p>
                    <p>
                      <strong>SL Balance:</strong> {point.slb || "-"}{" "}
                      <strong>SL Earned:</strong> {point.sle || "-"}{" "}
                      <strong>SL Spent:</strong> {point.sls || "-"}
                    </p>
                    <p>
                      <strong>VL Balance:</strong> {point.vlb || "-"}{" "}
                      <strong>VL Earned:</strong> {point.vle || "-"}{" "}
                      <strong>VL Spent:</strong> {point.vls || "-"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
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

              <h4>PDS :</h4>
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
          )}
        </div>
      </div>
    </div>
  );
};

const LoginEmployee = ({ seter, setEmployee }) => {
  const [cardId, setCardId] = useState("");
  const [nf, setNf] = useState(false);
  const [errMsg, setErrMsg] = useState("RFID Not Found!");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cardId) {
      getOneWithRFID("employee", cardId, (emp, exists) => {
        if (exists) {
          setEmployee(emp);
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

  if (isLogin) {
    return <EmployeeViewer employee={employee} setLogout={setIsLogin} />;
  }
  return (
    <div className="container-preview">
      <LoginEmployee seter={setIsLogin} setEmployee={setEmployee} />
    </div>
  );
};

export default EmployeeProfile;
