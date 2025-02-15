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

const employees = [
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
  {
    firstName: "Jason",
    lastName: "Macaroni",
    Age: 22,
    Address: "San juan makatol city",
    late: "90 hours",
    absent: 5,
    leave: 52,
  },
];

const Performance = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
                <input type="text" placeholder="Search employee..." />
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
                  {employees.map((e) => (
                    <tr>
                      <td>{e.lastName}</td>
                      <td>{e.firstName}</td>
                      <td>{e.late}</td>
                      <td>{e.absent} days</td>
                      <td>{e.leave} days</td>
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

export default Performance;
