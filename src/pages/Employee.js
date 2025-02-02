import "../css/employee.css";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { MdDeleteForever } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

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

const Employee = () => {
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
        <div className="table-container">
          <div className="table-header">
            <input type="text" placeholder="Search here..." />
            <button>Add Employee</button>
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
                    <button>
                      <FaEye color="green" />
                    </button>
                    <button>
                      <FaEdit color="orange" />
                    </button>
                    <button>
                      <MdDeleteForever color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Employee;
