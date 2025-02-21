import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/employee.css";
import { getOne } from "../methods/methods";
import { useParams } from "react-router-dom";

const Viewemployee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOne("employee", params.id);
        setEmployee(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview">
            <img id="img" src={employee.avatar} alt="avatar" />
          </div>
        </div>

        <div className="form-right">
          <h2>Personal Information</h2>
          <div className="inps">
            <div className="inp-grp">
              <h4>Rfid:</h4>
              <input type="text" value={employee.rfid} disabled />
            </div>
            <div className="inp-grp">
              <h4>Last Name:</h4>
              <input type="text" value={employee.lastName} disabled />
            </div>
            <div className="inp-grp">
              <h4>First Name:</h4>
              <input type="text" value={employee.firstName} disabled />
            </div>
            <div className="inp-grp">
              <h4>Middle Name:</h4>
              <input type="text" value={employee.middleName} disabled />
            </div>
            <div className="inp-grp">
              <h4>Age:</h4>
              <input type="text" value={employee.age} disabled />
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
        </div>
      </div>

      <div className="form-container-bottom">
        <h2>Points Information</h2>
        {employee.points.map((emp, index) => (
          <div key={index} className="inps">
            <div className="inp-grp-4">
              <h4>From:</h4>
              <input type="date" value={emp.from} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>To:</h4>
              <input type="date" value={emp.to} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>SL Balance:</h4>
              <input type="text" value={emp.slb} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>VL Balance:</h4>
              <input type="text" value={emp.vlb} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>SL Earned:</h4>
              <input type="text" value={emp.sle} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>VL Earned:</h4>
              <input type="text" value={emp.vle} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>SL Spent:</h4>
              <input type="text" value={emp.sls} disabled />
            </div>
            <div className="inp-grp-4">
              <h4>VL Spent:</h4>
              <input type="text" value={emp.vls} disabled />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Viewemployee;
