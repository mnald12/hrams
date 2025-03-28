import { useContext, useEffect, useState } from "react";
import "../css/dashboard.css";
import Loader from "../components/Loader";
import { MdOutlinePersonOff } from "react-icons/md";
import { BsPersonCheckFill, BsPersonX } from "react-icons/bs";
import { IoPersonRemoveOutline } from "react-icons/io5";
import Lines from "../components/Lines";
import Line2 from "../components/Line2";
import { getAll } from "../methods/methods";
import { DataContext } from "../App";
import EventDashboard from "../components/Events";
import Barchart from "../components/Barchart";
import NoUpcomingEvents from "../components/Noupcomingevents";
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { present, todaysLate, todaysLeave, todaysAbsent } =
    useContext(DataContext);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const evs = await getAll("events");
      const today = new Date().toISOString().split("T")[0];
      let upcomingEvents = [];

      for (let e of evs) {
        if (e.value.start >= today) {
          upcomingEvents.push(e);
        }
      }
      setEvents(upcomingEvents);
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
              <h3>{present}</h3>
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
              <BsPersonX className="card-icn" color="red" />
            </div>
            <div className="card-right">
              <p>Today's Absent</p>
              <h3>{todaysAbsent}</h3>
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
        </div>

        <div className="chart">
          <div className="charts" style={{ width: "100%" }}>
            <h3>Department Monthly Status Report</h3>
            <div className="lines" style={{ height: "220px" }}>
              <Barchart />
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
            <h3>Upcoming Events</h3>
            {events.length > 0 ? (
              <EventDashboard events={events} />
            ) : (
              <NoUpcomingEvents />
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
