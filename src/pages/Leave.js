import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/leave.css"; // Import CSS file
import { BiTrash } from "react-icons/bi";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";
import { FaCheck } from "react-icons/fa";
import { approveLeave, insertOne, rejectLeave } from "../methods/methods";
import { DataContext } from "../App";

const Leave = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [onLeave, setOnLeave] = useState([]);

  const { setType, setIsActionModal } = useContext(DataContext);

  const [newLeave, setNewLeave] = useState({
    employeeID: "",
    lastName: "",
    firstName: "",
    type: "",
    from: "",
    to: "",
    status: "Pending",
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

  useEffect(() => {
    const collectionRef = collection(db, "leave");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const pendingRequests = items.filter(
          (item) => item.status === "Pending"
        );
        const approvedRequests = items.filter(
          (item) => item.status === "Approved"
        );
        setLeaveRequests(pendingRequests);
        setOnLeave(approvedRequests);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    const isApproved = await approveLeave(id);
    if (isApproved) {
      setType(8);
      setIsActionModal(true);
    } else {
      setType(9);
      setIsActionModal(true);
    }
  };

  const handleReject = async (id) => {
    const isRejected = await rejectLeave(id);
    if (isRejected) {
      setType(10);
      setIsActionModal(true);
    } else {
      setType(11);
      setIsActionModal(true);
    }
  };

  const handleAddLeave = async () => {
    if (
      !newLeave.employeeID ||
      !newLeave.from ||
      !newLeave.to ||
      !newLeave.type
    ) {
      setType(12);
      setIsActionModal(true);
      return;
    }

    const isInsert = await insertOne("leave", {
      employeeID: newLeave.id,
      firstName: newLeave.firstName,
      lastName: newLeave.lastName,
      type: newLeave.type,
      from: newLeave.from,
      to: newLeave.to,
      status: newLeave.status,
    });
    if (isInsert) {
      setNewLeave({
        id: "",
        lastName: "",
        firstName: "",
        type: "",
        from: "",
        to: "",
        status: "Pending",
      });
      setType(6);
      setIsActionModal(true);
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
                <th>No.</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request, no) => (
                <tr key={request.id}>
                  <td>{no + 1}.</td>
                  <td>
                    {request.firstName} {request.lastName}
                  </td>
                  <td>{request.type}</td>
                  <td>{request.from}</td>
                  <td>{request.to}</td>
                  <td>{request.status}</td>
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
          <h2 style={{ marginLeft: "12px" }}>Approved Leave</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {onLeave.map((onLeave, no) => (
                <tr key={no}>
                  <td>{no + 1}.</td>
                  <td>
                    {onLeave.firstName} {onLeave.lastName}
                  </td>
                  <td>{onLeave.type}</td>
                  <td>{onLeave.from}</td>
                  <td>{onLeave.to}</td>
                  <td>{onLeave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="leave-form">
        <h2>Add Leave Request</h2>
        <select
          value={newLeave.id}
          onChange={(e) => {
            const selectedEmployee = employee.find(
              (emp) => emp.id === e.target.value
            );
            setNewLeave({
              ...newLeave,
              id: selectedEmployee?.id || "",
              lastName: selectedEmployee?.lastName || "",
              firstName: selectedEmployee?.firstName || "",
            });
          }}
          className="leave-input"
        >
          <option value="">Select Employee</option>
          {employee.map((e) => (
            <option key={e.id} value={e.id}>
              {e.lastName}, {e.firstName}
            </option>
          ))}
        </select>

        <select
          value={newLeave.type}
          onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
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
        <h4>From :</h4>
        <input
          type="date"
          value={newLeave.from}
          onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })}
          className="leave-input"
        />
        <h4>To :</h4>
        <input
          type="date"
          value={newLeave.to}
          onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })}
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
