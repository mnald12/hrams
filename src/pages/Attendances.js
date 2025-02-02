import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/attendance.css";

const data = [
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
  {
    name: "Jhon espiritu",
    date: "02/03/2025",
    timeInAM: "6:40",
    timeInPM: "12:40",
    timeOutAM: "11:50",
    timeOutPM: "4:56",
  },
];

const datas = [
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
  {
    date: "01-02-2025",
  },
];

const Attendances = () => {
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
        <div className="attendance">
          <div className="attendance-left">
            <div className="table-container">
              <h3>Today's attendance</h3>
              <table>
                <thead>
                  <tr>
                    <th width="25%">Name</th>
                    <th width="15%">Date</th>
                    <th width="15%">
                      Time in <i style={{ color: "blue" }}>(AM)</i>
                    </th>
                    <th width="15%">
                      Time out <i style={{ color: "blue" }}>(AM)</i>
                    </th>
                    <th width="15%">
                      Time in <i style={{ color: "orange" }}>(PM)</i>
                    </th>
                    <th width="15%">
                      Time out <i style={{ color: "orange" }}>(PM)</i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((e) => (
                    <tr>
                      <td>{e.name}</td>
                      <td>{e.date}</td>
                      <td>{e.timeInAM} AM</td>
                      <td>{e.timeOutAM} AM</td>
                      <td>{e.timeInPM} PM</td>
                      <td>{e.timeOutPM} PM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="attendance-right">
            <div className="table-container">
              <div className="table-header">
                <h3>All attendance</h3>
                <input type="text" placeholder="Search here..." />
              </div>
              <div className="atts">
                {datas.map((d) => (
                  <button>{d.date}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Attendances;
