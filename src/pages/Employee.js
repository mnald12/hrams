import "../css/employee.css";
import { useState, useEffect, useContext } from "react";
import Loader from "../components/Loader";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { TiGroupOutline } from "react-icons/ti";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { BsPersonX } from "react-icons/bs";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";
import { Link } from "react-router-dom";
import { DataContext } from "../App";
import { FiSearch } from "react-icons/fi";
import avapic from "../mopic.jpg";
import { getMostLateEmployee, getMostLeaveEmployee } from "../methods/methods";

const Employee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  const [mostLate, setMostLate] = useState("");
  const [mostLeave, setMostLeave] = useState("");

  const { setNavActive } = useContext(DataContext);

  const filteredEmployees = employee.filter(
    (emp) =>
      emp.rfid.includes(search) ||
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const collectionRef = collection(db, "employee");

    const unsubscribe = onSnapshot(
      collectionRef,
      async (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployee(items);
        const ml = getMostLateEmployee(items);
        setMostLate(ml);
        const mlv = await getMostLeaveEmployee();
        setMostLeave(mlv);
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
                <div className="search-container">
                  <FiSearch className="search-icon" size={20} />
                  <input
                    className="search-input"
                    placeholder="Search by Employee or RFID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Link
                  className="add-btn"
                  to="/employee/add"
                  onClick={() => setNavActive("Add Employee")}
                >
                  Add Employee
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th width="5%">No.</th>
                    <th>Img</th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>RFID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((e, i) => (
                    <tr key={e.id}>
                      <td>{i + 1}.</td>
                      <td>
                        <img src={e.avatar || avapic} alt="avatar" />
                      </td>
                      <td>{e.lastName}</td>
                      <td>{e.firstName}</td>
                      <td>{e.rfid}</td>
                      <td className="table-actions">
                        <Link
                          title="view"
                          className="add-btn-icn"
                          to={`/employee/view/${e.id}`}
                          onClick={() => setNavActive("View Employee")}
                        >
                          <FaEye color="green" />
                        </Link>
                        <Link
                          title="view"
                          className="add-btn-icn"
                          to={`/employee/edit/${e.id}`}
                          onClick={() => setNavActive("Edit Employee")}
                        >
                          <FaEdit color="orange" />
                        </Link>
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
                  <h3 style={{ fontSize: "30px" }}>{employee.length}</h3>
                </div>
              </div>
              <div className="card-4">
                <div className="card-left">
                  <IoPersonRemoveOutline className="card-icns" color="orange" />
                </div>
                <div className="card-right">
                  <p className="color-red">Most Late</p>
                  <h3>{mostLate.name}</h3>
                  <h6 className="h6b">
                    {mostLate.hour} Hrs {mostLate.minutes} Mins
                  </h6>
                </div>
              </div>
              <div className="card-4">
                <div className="card-left">
                  <BsPersonX className="card-icns" color="darkred" />
                </div>
                <div className="card-right">
                  <p className="color-red">Most Leave</p>
                  <h3>
                    {mostLeave.firstName} {mostLeave.lastName[0]}.
                  </h3>
                  <h6 className="h6b">{mostLeave.leaveDays} Days</h6>
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
