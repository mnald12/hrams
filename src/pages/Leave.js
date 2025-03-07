import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/leave.css";
import { BiTrash } from "react-icons/bi";
import { collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase/db";
import { FaCheck } from "react-icons/fa";
import { approveLeave, insertOne, rejectLeave } from "../methods/methods";
import { DataContext } from "../App";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import cryptoRandomString from "crypto-random-string";

const Leave = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [onLeave, setOnLeave] = useState([]);
  const [rejects, setRejects] = useState([]);

  const { setType, setIsActionModal } = useContext(DataContext);

  const [alfFile, setAlfFile] = useState("");
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
        const rejectedRequests = items.filter(
          (item) => item.status === "Rejected"
        );
        setLeaveRequests(pendingRequests);
        setOnLeave(approvedRequests);
        setRejects(rejectedRequests);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    setIsLoading(true);
    const isApproved = await approveLeave(id);
    if (isApproved) {
      setType(8);
      setIsActionModal(true);
    } else {
      setType(9);
      setIsActionModal(true);
    }
    setIsLoading(false);
  };

  const handleReject = async (id) => {
    setIsLoading(true);
    const isRejected = await rejectLeave(id);
    if (isRejected) {
      setType(10);
      setIsActionModal(true);
    } else {
      setType(11);
      setIsActionModal(true);
    }
    setIsLoading(false);
  };

  const handleAddLeave = async () => {
    setIsLoading(true);
    if (newLeave.from && newLeave.to && newLeave.type) {
      const laf = ref(
        storage,
        `forms/${alfFile.name + cryptoRandomString({ length: 10 })}`
      );
      const lafSnapshot = await uploadBytes(laf, alfFile);
      const lafUrl = await getDownloadURL(lafSnapshot.ref);

      const isInsert = await insertOne("leave", {
        employeeID: newLeave.id,
        firstName: newLeave.firstName,
        lastName: newLeave.lastName,
        type: newLeave.type,
        from: newLeave.from,
        to: newLeave.to,
        status: newLeave.status,
        applicationForm: lafUrl,
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
    } else {
      setType(12);
      setIsActionModal(true);
      setIsLoading(false);
      return;
    }
  };

  const [active, setActive] = useState("request");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="leave-container">
      <div className="leaves">
        <div className="navbars">
          <button
            className={active === "request" ? "active" : ""}
            onClick={() => {
              setActive("request");
            }}
          >
            Requests
          </button>
          <button
            className={active === "approve" ? "active" : ""}
            onClick={() => {
              setActive("approve");
            }}
          >
            Approved
          </button>
          <button
            className={active === "rejected" ? "active" : ""}
            onClick={() => {
              setActive("rejected");
            }}
          >
            Rejected
          </button>
        </div>

        {active === "request" ? (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : active === "approve" ? (
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
                  <th>Action</th>
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
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        title="reject"
                        className="reject-button"
                        onClick={() => handleReject(onLeave.id)}
                      >
                        <BiTrash color="red" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="leave-history">
            <h2 style={{ marginLeft: "12px" }}>Rejected Leave</h2>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rejects.map((onLeave, no) => (
                  <tr key={no}>
                    <td>{no + 1}.</td>
                    <td>
                      {onLeave.firstName} {onLeave.lastName}
                    </td>
                    <td>{onLeave.type}</td>
                    <td>{onLeave.from}</td>
                    <td>{onLeave.to}</td>
                    <td>{onLeave.status}</td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        title="approve"
                        className="approve-button"
                        onClick={() => handleApprove(onLeave.id)}
                      >
                        <FaCheck color="green" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        <h4>Leave Application Form :</h4>
        <input
          type="file"
          className="leave-input"
          onChange={(e) => setAlfFile(e.target.files[0])}
        />
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
        <button
          className="leave-button"
          style={{ marginTop: "12px" }}
          onClick={handleAddLeave}
        >
          Add Leave
        </button>
      </div>
    </div>
  );
};

export default Leave;
