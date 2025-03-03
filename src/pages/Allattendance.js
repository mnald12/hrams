import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/attendance.css";
import "react-calendar/dist/Calendar.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { DataContext } from "../App";

const Allattendances = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");

  const { setNavActive } = useContext(DataContext);

  const filteredEmployees = attendance.filter((emp) =>
    emp.date.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const collectionRef = collection(db, "allattendance");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        items.sort((a, b) => new Date(b.date) - new Date(a.date));

        const newAtt = items.map((i) => ({
          ...i,
          date: formatDate(i.date),
        }));

        setAttendance(newAtt);
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
        <div className="table-container">
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
                <th>No.</th>
                <th>Date</th>
                <th>In Attendance</th>
                <th>Late</th>
                <th>On Leave</th>
                <th>Absent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}.</td>
                    <td>{e.date}</td>
                    <td>{e.attendance.length}</td>
                    <td>{e.totalLates}</td>
                    <td>{e.totalLeaves}</td>
                    <td>{e.totalAbsents}</td>
                    <td className="table-actions">
                      <Link
                        title="view"
                        className="add-btn-icn"
                        to={`/allattendance/view/${e.id}`}
                        onClick={() => setNavActive("View Attendance")}
                      >
                        <FaEye color="green" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Allattendances;
