import { useContext, useEffect, useState } from "react";
import "../css/dashboard.css";
import Loader from "../components/Loader";
import { MdOutlinePersonOff } from "react-icons/md";
import { BsPersonCheckFill } from "react-icons/bs";
import { TiGroupOutline } from "react-icons/ti";
import { IoPersonRemoveOutline } from "react-icons/io5";
import Lines from "../components/Lines";
import Line2 from "../components/Line2";
import { getAll } from "../methods/methods";
import { DataContext } from "../App";
import EventDashboard from "../components/Events";
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalEmployee, setTotalEmployee] = useState(0);
  const { todaysLate, todaysLeave } = useContext(DataContext);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const te = await getAll("employee");
      setTotalEmployee(te.length);
      const evs = await getAll("events");
      setEvents(evs);
    };

    fetch();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="dashboard">
        <h3>Live Status Report</h3>
        <div className="cards">
          <div className="card-4">
            <div className="card-left">
              <BsPersonCheckFill className="card-icn" color="greeb" />
            </div>
            <div className="card-right">
              <p>Present Today</p>
              <h3>{"0"}</h3>
            </div>
          </div>
          <div className="card-4">
            <div className="card-left">
              <IoPersonRemoveOutline className="card-icn" color="orange" />
            </div>
            <div className="card-right">
              <p>Today's Late</p>
              <h3>{todaysLate}</h3>
            </div>
          </div>
          <div className="card-4">
            <div className="card-left">
              <MdOutlinePersonOff className="card-icn" color="darkred" />
            </div>
            <div className="card-right">
              <p>On Leave</p>
              <h3>{todaysLeave}</h3>
            </div>
          </div>
          <div className="card-4">
            <div className="card-left">
              <TiGroupOutline className="card-icn" color="blue" />
            </div>
            <div className="card-right">
              <p>Total Employee</p>
              <h3>{totalEmployee}</h3>
            </div>
          </div>
        </div>

        <div className="chart">
          <div className="chart-left">
            <h3>Weekly & Monthly Status Report</h3>
            <div className="lines">
              <Lines />
            </div>
            <div className="lines">
              <Line2 />
            </div>
          </div>
          <div className="chart-right">
            <h3>Events</h3>
            <EventDashboard events={events} />
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
