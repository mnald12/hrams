import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/employee.css";
import {
  getEmployeeAttendance,
  getEmployeeLeaves,
  getOne,
} from "../methods/methods";
import { useParams } from "react-router-dom";
import EmployeeViewer from "../components/Employeeviewer";

const Viewemployee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState({ points: [] });
  const params = useParams();
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOne("employee", params.id);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    const getAtt = async () => {
      try {
        const att = await getEmployeeAttendance(params.id);
        setAttendance(att);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    const getLeaves = async () => {
      try {
        const att = await getEmployeeLeaves(params.id);
        setLeaves(att);
        console.log(att);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    fetchEmployee();
    getAtt();
    getLeaves();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  if (isLoading) return <Loader />;

  return (
    <EmployeeViewer
      employee={employee}
      attendance={attendance}
      leaves={leaves}
    />
  );
};

export default Viewemployee;
