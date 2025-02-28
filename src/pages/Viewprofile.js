import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/employee.css";
import { getOne } from "../methods/methods";
import nopic from "../mopic.jpg";

const Viewprofile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState({ attendance: [] });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOne("profile", "admin");
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview">
            <img id="img" src={employee.avatar || nopic} alt="avatar" />
          </div>
        </div>

        <div className="form-right">
          <h2>Personal Information</h2>
          <div className="inps">
            <div className="inp-grp">
              <h4>Last Name:</h4>
              <input type="text" value={employee.lastName} disabled />
            </div>
            <div className="inp-grp">
              <h4>First Name:</h4>
              <input type="text" value={employee.firstName} disabled />
            </div>
            <div className="inp-grp">
              <h4>Email:</h4>
              <input type="text" value={employee.email} disabled />
            </div>
            <div className="inp-grp">
              <h4>Phone No:</h4>
              <input type="text" value={employee.phone} disabled />
            </div>
            <div className="inp-grp address">
              <h4>Address:</h4>
              <input type="text" value={employee.address} disabled />
            </div>
          </div>
          <h2 style={{ marginTop: "20px" }}>Login Information</h2>
          <div className="inps">
            <div className="inp-grp">
              <h4>Username:</h4>
              <input type="text" value={employee.username} disabled />
            </div>
            <div className="inp-grp">
              <h4>Password:</h4>
              <input type="password" value={employee.password} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewprofile;
