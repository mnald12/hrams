import "../css/employee.css";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { MdDeleteForever } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdOutlinePersonOff } from "react-icons/md";
import { TiGroupOutline } from "react-icons/ti";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { BsPersonX } from "react-icons/bs";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";
const Employee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "employee");

    // Real-time listener
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

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="employee">
        <div className="d-flex-3-1">
          <div className="d-left">
            <div className="table-container">
              <div className="table-header">
                <input type="text" placeholder="Search by employee..." />
                <button
                  onClick={() =>
                    (document.getElementById("add-employee").style.display =
                      "flex")
                  }
                >
                  Add Employee
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th width="20%">Last Name</th>
                    <th width="20%">First Name</th>
                    <th width="15%">Late</th>
                    <th width="15%">Absent</th>
                    <th width="15%">Leave</th>
                    <th width="15%">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.map((e) => (
                    <tr key={e.id}>
                      <td>{e.lastName}</td>
                      <td>{e.firstName}</td>
                      <td>{e.late.length}</td>
                      <td>{e.absent.length} days</td>
                      <td>{e.leave.length} days</td>
                      <td className="table-actions">
                        <button title="view">
                          <FaEye color="green" />
                        </button>
                        <button title="edit">
                          <FaEdit color="orange" />
                        </button>
                        <button title="delete">
                          <MdDeleteForever color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-right">
            <div className="ecards">
              <div className="card-4">
                <div className="card-left">
                  <TiGroupOutline className="card-icns" color="blue" />
                </div>
                <div className="card-right">
                  <p className="color-blue">Total Employee</p>
                  <h3 style={{ fontSize: "30px" }}>104</h3>
                </div>
              </div>
              <div className="card-4">
                <div className="card-left">
                  <MdOutlinePersonOff className="card-icns" color="red" />
                </div>
                <div className="card-right">
                  <p className="color-red">Most Absent</p>
                  <h3>Jhon</h3>
                </div>
              </div>
              <div className="card-4">
                <div className="card-left">
                  <IoPersonRemoveOutline className="card-icns" color="orange" />
                </div>
                <div className="card-right">
                  <p className="color-red">Most Late</p>
                  <h3>Carmen</h3>
                </div>
              </div>
              <div className="card-4">
                <div className="card-left">
                  <BsPersonX className="card-icns" color="darkred" />
                </div>
                <div className="card-right">
                  <p className="color-red">Most Leave</p>
                  <h3>Jerome</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Employee;
