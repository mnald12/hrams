import { IoClose } from "react-icons/io5";
import { DataContext } from "../App";
import { useContext } from "react";

const ViewDepartment = () => {
  const { setIsViewDepartment, dataToView } = useContext(DataContext);
  return (
    <div className="dep-modal-container">
      <div className="dep-modal">
        <button
          className="dep-close"
          onClick={() => setIsViewDepartment(false)}
        >
          <IoClose />
        </button>
        <div className="dep-modal-content">
          <h3 style={{ color: "royalblue" }}>{dataToView.name}</h3>
          <hr />
          <br />
          {dataToView.employees.length > 0 ? (
            <>
              {dataToView.employees.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </>
          ) : (
            <p>No employees...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDepartment;
