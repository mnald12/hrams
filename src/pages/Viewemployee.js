import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/employee.css";
import { getOne } from "../methods/methods";
import { useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Viewemployee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState({ attendance: [] });
  const params = useParams();
  const [search, setSearch] = useState("");

  const filteredEmployees = employee.attendance.filter((emp) =>
    emp.date.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOne("employee", params.id);
        setEmployee(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview">
            <img id="img" src={employee.avatar} alt="avatar" />
          </div>
        </div>

        <div className="form-right">
          <h2>Personal Information</h2>
          <div className="inps">
            <div className="inp-grp">
              <h4>Rfid:</h4>
              <input type="text" value={employee.rfid} disabled />
            </div>
            <div className="inp-grp">
              <h4>Last Name:</h4>
              <input type="text" value={employee.lastName} disabled />
            </div>
            <div className="inp-grp">
              <h4>First Name:</h4>
              <input type="text" value={employee.firstName} disabled />
            </div>
            <div className="inp-grp">
              <h4>Middle Name:</h4>
              <input type="text" value={employee.middleName} disabled />
            </div>
            <div className="inp-grp">
              <h4>Age:</h4>
              <input type="text" value={employee.age} disabled />
            </div>
            <div className="inp-grp">
              <h4>Email:</h4>
              <input type="text" value={employee.email} disabled />
            </div>
            <div className="inp-grp">
              <h4>Phone No:</h4>
              <input type="text" value={employee.phone} disabled />
            </div>
            <div className="inp-grp address">
              <h4>Address:</h4>
              <input type="text" value={employee.address} disabled />
            </div>
          </div>
        </div>
      </div>
      <div className="form-container-bottom">
        <h2>Points Information</h2>
        <div
          className="table-container"
          style={{ boxShadow: "0 0 3px 0 black", marginTop: "16px" }}
        >
          <div className="table-header">
            <div className="search-container">
              <FiSearch className="search-icon" size={20} />
              <input
                className="search-input"
                placeholder="Search by Date"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th style={{ color: "blueviolet" }}>VL Bal</th>
                <th style={{ color: "blueviolet" }}>VL Earned</th>
                <th style={{ color: "blueviolet" }}>VL Spent</th>
                <th style={{ color: "darkorange" }}>SL Bal</th>
                <th style={{ color: "darkorange" }}>SL Earned</th>
                <th style={{ color: "darkorange" }}>SL Spent</th>
              </tr>
            </thead>
            <tbody>
              {employee.points.map((e, i) => (
                <tr key={i}>
                  <td>{e.from}</td>
                  <td>{e.to}</td>
                  <td>{e.vlb}</td>
                  <td>{e.vle}</td>
                  <td>{e.vls}</td>
                  <td>{e.slb}</td>
                  <td>{e.sle}</td>
                  <td>{e.sls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="form-container-bottom">
        <h2>Attendance Information</h2>
        <div
          className="table-container"
          style={{ boxShadow: "0 0 3px 0 black", marginTop: "16px" }}
        >
          <div className="table-header">
            <div className="search-container">
              <FiSearch className="search-icon" size={20} />
              <input
                className="search-input"
                placeholder="Search by Date"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table style={{ marginTop: "-30px" }}>
            <thead>
              <tr
                style={{
                  boxShadow: "none",
                  transform: "translateY(20px)",
                }}
              >
                <th width="15%"></th>
                <th width="15%">
                  <i style={{ color: "blue" }}>(AM)</i>
                </th>
                <th width="15%">
                  <i style={{ color: "blue" }}>(AM)</i>
                </th>
                <th width="15%">
                  <i style={{ color: "orange" }}>(PM)</i>
                </th>
                <th width="15%">
                  <i style={{ color: "orange" }}>(PM)</i>
                </th>
              </tr>
              <tr>
                <th width="15%">Date</th>
                <th width="15%">Time in</th>
                <th width="15%">Time out</th>
                <th width="15%">Time in</th>
                <th width="15%">Time out</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((e, i) => (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>
                    {e.timeInAM.hour <= 9
                      ? `0${e.timeInAM.hour}`
                      : e.timeInAM.hour}{" "}
                    :{" "}
                    {e.timeInAM.minute <= 9
                      ? `0${e.timeInAM.minute}`
                      : e.timeInAM.minute}{" "}
                    AM
                  </td>
                  <td>
                    {e.timeOutAM.hour <= 9
                      ? `0${e.timeOutAM.hour}`
                      : e.timeOutAM.hour}{" "}
                    :{" "}
                    {e.timeOutAM.minute <= 9
                      ? `0${e.timeOutAM.minute}`
                      : e.timeOutAM.minute}{" "}
                    AM
                  </td>
                  <td>
                    {e.timeInPM.hour <= 9
                      ? `0${e.timeInPM.hour}`
                      : e.timeInPM.hour}{" "}
                    :{" "}
                    {e.timeInPM.minute <= 9
                      ? `0${e.timeInPM.minute}`
                      : e.timeInPM.minute}{" "}
                    PM
                  </td>
                  <td>
                    {e.timeOutPM.hour <= 9
                      ? `0${e.timeOutPM.hour}`
                      : e.timeOutPM.hour}{" "}
                    :{" "}
                    {e.timeOutPM.minute <= 9
                      ? `0${e.timeOutPM.minute}`
                      : e.timeOutPM.minute}{" "}
                    PM
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Viewemployee;
