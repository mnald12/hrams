import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/employeeprofile.css";
import {
  getOne,
  getEmployeeAttendance,
  getEmployeeLeaves,
  getAll,
} from "../methods";
import Loader from "../components/Loader";

const EmployeeProfile = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const employee = await getOne("employee", id);
      const attendance = await getEmployeeAttendance(id);
      const leaves = await getEmployeeLeaves(id); // Fetch leaves for the current employee
      const upcomingEvents = await getAll("events");

      setEmployeeData(employee || {});
      setAttendanceData(attendance || []);
      setLeaveData(leaves || []); // Store fetched leave data
      setEvents(upcomingEvents.map((event) => event.value));
    };

    fetchData();
  }, [id]);

  if (!employeeData) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="profile-header">
          <img
            className="avatar"
            src={employeeData.avatar}
            alt={employeeData.firstName}
          />
          <div>
            <h2>
              {employeeData.firstName} {employeeData.lastName}
            </h2>
            <p>{employeeData.position}</p>
            <p>Joined: {employeeData.employed}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          onClick={() => setSelectedTab("profile")}
          className={selectedTab === "profile" ? "active" : ""}
        >
          Profile
        </button>
        <button
          onClick={() => setSelectedTab("performance")}
          className={selectedTab === "performance" ? "active" : ""}
        >
          Performance
        </button>
        <button
          onClick={() => setSelectedTab("leaves")}
          className={selectedTab === "leaves" ? "active" : ""}
        >
          Leaves
        </button>
        <button
          onClick={() => setSelectedTab("events")}
          className={selectedTab === "events" ? "active" : ""}
        >
          Upcoming Events
        </button>
      </div>

      {selectedTab === "profile" && (
        <div className="tab-content">
          <p>
            <strong>Email:</strong> {employeeData.email}
          </p>
          <p>
            <strong>Phone:</strong> {employeeData.phone}
          </p>
          <p>
            <strong>Address:</strong> {employeeData.address}
          </p>
        </div>
      )}

      {selectedTab === "performance" && (
        <div className="tab-content">
          <h3>Attendance Records</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In AM</th>
                <th>Time Out AM</th>
                <th>Time In PM</th>
                <th>Time Out PM</th>
                <th>Late</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>
                    {entry.timeInAM?.hour}:{entry.timeInAM?.minute}
                  </td>
                  <td>
                    {entry.timeOutAM?.hour}:{entry.timeOutAM?.minute}
                  </td>
                  <td>
                    {entry.timeInPM?.hour}:{entry.timeInPM?.minute}
                  </td>
                  <td>
                    {entry.timeOutPM?.hour}:{entry.timeOutPM?.minute}
                  </td>
                  <td>{entry.isLate ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTab === "leaves" && (
        <div className="tab-content">
          <h3>Leave History</h3>
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
              {leaveData.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.type}</td>
                  <td>{leave.from}</td>
                  <td>{leave.to}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="apply-leave">Apply for Leave</button>
        </div>
      )}

      {selectedTab === "events" && (
        <div className="tab-content">
          <h3>Upcoming Events</h3>
          {events.length > 0 ? (
            <ul>
              {events.map((event, index) => (
                <li key={index}>{event.name}</li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
