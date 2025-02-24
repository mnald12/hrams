import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/leave.css"; // Import CSS file
import { BiTrash } from "react-icons/bi";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";
import { FaCheck } from "react-icons/fa";

const Leave = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: "John Doe",
      type: "Sick Leave",
      date: "2025-02-20",
      duration: "1 day",
      status: "Pending",
    },
    {
      id: 2,
      employee: "Jane Smith",
      type: "Vacation Leave",
      date: "2025-02-22",
      duration: "3 days",
      status: "Pending",
    },
  ]);

  const [approvedRequests, setapprovedRequests] = useState([
    {
      id: 1,
      employee: "James Dang",
      type: "Sick Leave",
      date: "2025-02-20",
      duration: "1 day",
      status: "Approved",
    },
    {
      id: 2,
      employee: "Josheeep meeee",
      type: "Vacation Leave",
      date: "2025-02-22",
      duration: "5 days",
      status: "Approved",
    },
  ]);

  const [newLeave, setNewLeave] = useState({
    employee: "",
    type: "",
    date: "",
    duration: "",
  });

  useEffect(() => {
    const collectionRef = collection(db, "employee");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployee(items);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => unsubscribe();
  }, []);

  const handleApprove = (id) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: "Approved" } : request
      )
    );
  };

  const handleReject = (id) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: "Rejected" } : request
      )
    );
  };

  const handleAddLeave = () => {
    if (
      newLeave.employee &&
      newLeave.type &&
      newLeave.date &&
      newLeave.duration
    ) {
      const newEntry = {
        id: leaveRequests.length + 1,
        ...newLeave,
        status: "Pending",
      };
      setLeaveRequests([...leaveRequests, newEntry]);
      setNewLeave({ employee: "", type: "", date: "", duration: "" });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="leave-container">
      <div className="leaves">
        <div className="leave-history">
          <h2 style={{ marginLeft: "12px" }}>Leave Requests</h2>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employee}</td>
                  <td>{request.type}</td>
                  <td>{request.date}</td>
                  <td>{request.duration}</td>
                  <td className={request.status.toLowerCase()}>
                    {request.status}
                  </td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    {request.status === "Pending" && (
                      <>
                        <button
                          title="approve"
                          className="approve-button"
                          onClick={() => handleApprove(request.id)}
                        >
                          <FaCheck color="green" />
                        </button>
                        <button
                          title="reject"
                          className="reject-button"
                          onClick={() => handleReject(request.id)}
                        >
                          <BiTrash color="red" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="leave-history">
          <h2 style={{ marginLeft: "12px" }}>On Leave</h2>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employee}</td>
                  <td>{request.type}</td>
                  <td>{request.date}</td>
                  <td>{request.duration}</td>
                  <td className={request.status.toLowerCase()}>
                    {request.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="leave-form">
        <h2>Add Leave Request</h2>
        <select
          value={newLeave.type}
          onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
          className="leave-input"
        >
          <option value="">Select Employee</option>
          {employee.map((e) => (
            <option>
              {e.firstName} {e.lastName}
            </option>
          ))}
        </select>
        <select
          value={newLeave.type}
          onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
          className="leave-input"
        >
          <option value="">Select Leave Type</option>
          <option value="Vacation Leave">Vacation Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Emergency Leave">Emergency Leave</option>
        </select>
        <input
          type="date"
          value={newLeave.date}
          onChange={(e) => setNewLeave({ ...newLeave, date: e.target.value })}
          className="leave-input"
        />
        <input
          type="text"
          placeholder="Duration (e.g., 2 days)"
          value={newLeave.duration}
          onChange={(e) =>
            setNewLeave({ ...newLeave, duration: e.target.value })
          }
          className="leave-input"
        />
        <button className="leave-button" onClick={handleAddLeave}>
          Add Leave
        </button>
      </div>
    </div>
  );
};

export default Leave;
