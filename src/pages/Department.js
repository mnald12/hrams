import { useContext, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { DataContext } from "../App";
import { FaEdit, FaEye } from "react-icons/fa";
import Loader from "../components/Loader";
import { TiGroupOutline } from "react-icons/ti";
import { FcDepartment } from "react-icons/fc";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";

const Department = () => {
  const { setIsAddDepartment } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const { setIsEditDepartment, setDataToEdit } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState([]);

  // const highestDepartment = department.reduce((max, dept) =>
  //   dept.employees.length > max.employees.length ? dept : max
  // );

  useEffect(() => {
    const collectionRef = collection(db, "department");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDepartment(items);
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
                      <button>
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
                <h3 style={{ fontSize: "22px" }}>Office of The Major Tanod</h3>
                <h6 className="h6b">22 Total Employees</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
