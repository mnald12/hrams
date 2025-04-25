import { useContext, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import "../css/attendance.css";
import "react-calendar/dist/Calendar.css";
import { IoMdPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import { Oval } from "react-loader-spinner";
import { DataContext } from "../App";

const Monthlyview = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { monthlyToView } = useContext(DataContext);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
            <h3>{monthlyToView.name}</h3>
            <table>
              <thead>
                <tr>
                  <th width="15%">Date</th>
                  <th width="15%">Time in</th>
                  <th width="15%">Time out</th>
                  <th width="15%">Time in</th>
                  <th width="15%">Time out</th>
                </tr>
              </thead>
              <tbody>
                {monthlyToView.attendance.map((e, i) => (
                  <tr key={i}>
                    <td>{e.date}</td>
                    <td>
                      {e.timeInAM?.hour != null
                        ? `${e.timeInAM.hour
                            .toString()
                            .padStart(2, "0")} : ${e.timeInAM.minute
                            .toString()
                            .padStart(2, "0")} AM`
                        : ""}
                    </td>
                    <td>
                      {e.timeOutAM?.hour != null
                        ? `${e.timeOutAM.hour
                            .toString()
                            .padStart(2, "0")} : ${e.timeOutAM.minute
                            .toString()
                            .padStart(2, "0")} AM`
                        : ""}
                    </td>
                    <td>
                      {e.timeInPM?.hour != null
                        ? `${e.timeInPM.hour
                            .toString()
                            .padStart(2, "0")} : ${e.timeInPM.minute
                            .toString()
                            .padStart(2, "0")} PM`
                        : ""}
                    </td>
                    <td>
                      {e.timeOutPM?.hour != null
                        ? `${e.timeOutPM.hour
                            .toString()
                            .padStart(2, "0")} : ${e.timeOutPM.minute
                            .toString()
                            .padStart(2, "0")} PM`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
};

export default Monthlyview;
