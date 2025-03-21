import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import "../css/attendance.css";
import "react-calendar/dist/Calendar.css";
import { FiSearch } from "react-icons/fi";
import nopic from "../mopic.jpg";
import { useParams } from "react-router-dom";
import { getAttendance } from "../methods/methods";
import { IoMdPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import { Oval } from "react-loader-spinner";

const ViewAlllAttendances = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const params = useParams();

  const filteredEmployees = attendance.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getAtt = async () => {
      try {
        const att = await getAttendance(params.id);
        setAttendance(att);
      } catch (error) {
        console.error("Error fetching employee attendance:", error);
      }
    };

    getAtt();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [isBtnLoading, setIsBtnLoading] = useState(false);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="employee">
        <div className="table-container">
          <div className="table-header">
            <div className="search-container">
              <FiSearch className="search-icon" size={20} />
              <input
                className="search-input"
                placeholder="Search by Employee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              style={{ background: "limegreen", display: "flex", gap: "10px" }}
              onClick={() => {
                reactToPrintFn();
                setIsBtnLoading(true);
                setTimeout(() => {
                  setIsBtnLoading(false);
                }, 2500);
              }}
              disabled={isBtnLoading ? true : false}
            >
              {isBtnLoading ? (
                <>
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="aliceblue"
                    ariaLabel="oval-loading"
                  />
                </>
              ) : (
                <>
                  Print <IoMdPrint />
                </>
              )}
            </button>
          </div>
          <div ref={contentRef} className="printable">
            <table className="table-printable" style={{ marginTop: "-20px" }}>
              <thead>
                <tr
                  style={{
                    boxShadow: "none",
                    transform: "translateY(20px)",
                  }}
                >
                  <th></th>
                  <th width="10%"></th>
                  <th width="20%"></th>
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
                  <th>No.</th>
                  <th width="10%">Img</th>
                  <th width="20%">Name</th>
                  <th width="15%">Date</th>
                  <th width="15%">Time in</th>
                  <th width="15%">Time out</th>
                  <th width="15%">Time in</th>
                  <th width="15%">Time out</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees
                  .sort((a, b) => {
                    const getLastScanTime = (e) => {
                      return (
                        (e.timeOutPM?.hour ?? 0) * 60 +
                          (e.timeOutPM?.minute ?? 0) ||
                        (e.timeInPM?.hour ?? 0) * 60 +
                          (e.timeInPM?.minute ?? 0) ||
                        (e.timeOutAM?.hour ?? 0) * 60 +
                          (e.timeOutAM?.minute ?? 0) ||
                        (e.timeInAM?.hour ?? 0) * 60 + (e.timeInAM?.minute ?? 0)
                      );
                    };

                    return getLastScanTime(b) - getLastScanTime(a);
                  })
                  .map((e, i) => {
                    const formatTime = ({ hour, minute, period }) => {
                      if (hour === 0) return "";
                      return `${hour >= 13 ? hour - 12 : hour}:${minute
                        .toString()
                        .padStart(2, "0")} ${period}`;
                    };

                    return (
                      <tr key={i}>
                        <td>{i + 1}.</td>
                        <td>
                          <img alt="avatar" src={e.avatar || nopic} />
                        </td>
                        <td>
                          {e.firstName} {e.lastName}
                        </td>
                        <td>{e.date}</td>
                        <td>{formatTime({ ...e.timeInAM, period: "AM" })}</td>
                        <td>{formatTime({ ...e.timeOutAM, period: "AM" })}</td>
                        <td>{formatTime({ ...e.timeInPM, period: "PM" })}</td>
                        <td>{formatTime({ ...e.timeOutPM, period: "PM" })}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};

export default ViewAlllAttendances;
