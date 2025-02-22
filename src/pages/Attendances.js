import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/attendance.css";
import Calendar from "react-calendar/dist/cjs/Calendar.js";
import "react-calendar/dist/Calendar.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";

const Attendances = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setCal] = useState(new Date());
  const [attendance, setAttendance] = useState([]);

  const onChange = (v) => {
    setCal(v);
    console.log(v);
  };

  useEffect(() => {
    const collectionRef = collection(db, "attendance");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendance(items);
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
              <h3>Today's attendance</h3>
              <table style={{ marginTop: "-10px" }}>
                <thead>
                  <tr
                    style={{
                      boxShadow: "none",
                      transform: "translateY(20px)",
                    }}
                  >
                    <th width="25%"></th>
                    <th width="15%"></th>
                    <th width="15%">
                      <i style={{ color: "blue" }}>(AM)</i>
                    </th>
                    <th width="15%">
                      <i style={{ color: "blue" }}>(AM)</i>
                    </th>
                    <th width="15%">
                      <i style={{ color: "orange" }}>(PM)</i>
                    </th>
                    <th width="15%">
                      <i style={{ color: "orange" }}>(PM)</i>
                    </th>
                  </tr>
                  <tr>
                    <th width="25%">Name</th>
                    <th width="15%">Date</th>
                    <th width="15%">Time in</th>
                    <th width="15%">Time out</th>
                    <th width="15%">Time in</th>
                    <th width="15%">Time out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((e) => (
                    <tr>
                      <td>
                        {e.firstName} {e.lastName}
                      </td>
                      <td>{e.date}</td>
                      <td>
                        {e.timeInAM.hour} : {e.timeInAM.minute} AM
                      </td>
                      <td>
                        {e.timeOutAM.hour} : {e.timeOutAM.minute} AM
                      </td>
                      <td>
                        {e.timeInPM.hour} : {e.timeInPM.minute} PM
                      </td>
                      <td>
                        {e.timeOutPM.hour} : {e.timeOutPM.minute} PM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-right">
            <div className="table-container">
              <div className="table-header">
                <h3>All attendance</h3>
              </div>
              <Calendar
                calendarType="gregory"
                style={{ Padding: "20px !important" }}
                onChange={onChange}
                value={value}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Attendances;
