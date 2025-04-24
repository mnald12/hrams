import { useContext, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { DataContext } from "../App";
import { FaEdit, FaEye } from "react-icons/fa";
import Loader from "../components/Loader";
import { TiGroupOutline } from "react-icons/ti";
import { FcDepartment } from "react-icons/fc";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/db";

const Department = () => {
  const [search, setSearch] = useState("");
  const {
    setIsAddDepartment,
    setIsEditDepartment,
    setDataToEdit,
    setIsViewDepartment,
    setDataToView,
  } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "department");

    const unsubscribe = onSnapshot(
      collectionRef,
      async (querySnapshot) => {
        const departmentPromises = querySnapshot.docs.map(async (doc) => {
          const departmentId = doc.id;
          const departmentData = doc.data();

          const employeesQuery = query(
            collection(db, "employee"),
            where("departmentId", "==", departmentId)
          );
          const employeeSnapshot = await getDocs(employeesQuery);
          const employees = employeeSnapshot.docs.map((empDoc) => {
            const empData = empDoc.data();
            return `${empData.firstName} ${empData.middleName} ${empData.lastName}`;
          });

          return {
            id: departmentId,
            name: departmentData.name,
            employees,
          };
        });

        const departmentsWithEmployees = await Promise.all(departmentPromises);
        setDepartment(departmentsWithEmployees);
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

  const filteredDepartment = department.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const getMostDep = () => {
    return department.reduce((maxDept, currentDept) => {
      return currentDept.employees.length > maxDept.employees.length
        ? currentDept
        : maxDept;
    });
  };

  if (isLoading) return <Loader />;

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
                  placeholder="Search by Department Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="add-btn"
                onClick={() => setIsAddDepartment(true)}
              >
                Add Department
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th width="5%">No.</th>
                  <th>Department Name</th>
                  <th>Employees</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartment.map((d, i) => (
                  <tr key={i}>
                    <td>{i + 1}.</td>
                    <td>{d.name}</td>
                    <td>{d.employees.length}</td>
                    <td className="table-actions">
                      <button
                        title="view"
                        onClick={() => {
                          setDataToView(d);
                          setIsViewDepartment(true);
                        }}
                      >
                        <FaEye color="green" />
                      </button>
                      <button
                        title="edit"
                        onClick={() => {
                          setDataToEdit(d);
                          setIsEditDepartment(true);
                        }}
                      >
                        <FaEdit color="orange" />
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
                <FcDepartment className="card-icns" />
              </div>
              <div className="card-right">
                <p className="color-green">Total Department</p>
                <h3 style={{ fontSize: "30px" }}>{department.length}</h3>
              </div>
            </div>
            <div className="card-4">
              <div className="card-left">
                <TiGroupOutline className="card-icns" color="blue" />
              </div>
              <div className="card-right">
                <p className="color-blue">Most Employee</p>
                <h3 style={{ fontSize: "20px", top: "-14px" }}>
                  {getMostDep().name}
                </h3>
                <h6 className="h6b">
                  {getMostDep().employees.length} Total Employees
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
