import { useEffect, useState } from "react";
import "../css/dashboard.css";
import Loader from "../components/Loader";
import { MdOutlinePersonOff } from "react-icons/md";
import { TiGroupOutline } from "react-icons/ti";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { BsPersonX } from "react-icons/bs";
import Lines from "../components/Lines";
import Pies from "../components/Pie";
import Line2 from "../components/Line2";
import Pie2 from "../components/Pie2";
const Dashboard = () => {
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
      <div className="dashboard">
        <h3>Live Status Report</h3>
        <div className="cards">
          <div className="card-4">
            <div className="card-left">
              <MdOutlinePersonOff className="card-icn" color="red" />
            </div>
            <div className="card-right">
              <p>Today's Absent</p>
              <h3>24</h3>
            </div>
          </div>
          <div className="card-4">
            <div className="card-left">
              <IoPersonRemoveOutline className="card-icn" color="orange" />
            </div>
            <div className="card-right">
              <p>Today's Late</p>
              <h3>18</h3>
            </div>
          </div>
          <div className="card-4">
            <div className="card-left">
              <BsPersonX className="card-icn" color="darkred" />
            </div>
            <div className="card-right">
              <p>On Leave</p>
              <h3>14</h3>
            </div>
          </div>
          <div className="card-4">
            <div className="card-left">
              <TiGroupOutline className="card-icn" color="blue" />
            </div>
            <div className="card-right">
              <p>Total Employee</p>
              <h3>104</h3>
            </div>
          </div>
        </div>
        <div className="weekly">
          <h3 style={{ paddingBottom: "10px" }}>Weekly Status Report</h3>
          <p className="late">
            Late : <b>100</b>
          </p>
          <p className="absent">
            Absent : <b>40</b>
          </p>
          <p className="leave">
            Leave : <b>32</b>
          </p>
        </div>
        <div className="chart">
          <div className="chart-left">
            <Lines />
          </div>
          <div className="chart-right">
            <Pies />
          </div>
        </div>
        <br />
        <div className="weekly">
          <h3 style={{ paddingBottom: "10px" }}>
            Monthly Status Report (2025)
          </h3>
          <p className="late">
            Late : <b>1200</b>
          </p>
          <p className="absent">
            Absent : <b>800</b>
          </p>
          <p className="leave">
            Leave : <b>300</b>
          </p>
        </div>
        <div className="chart">
          <div className="chart-left">
            <Line2 />
          </div>
          <div className="chart-right">
            <Pie2 />
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
