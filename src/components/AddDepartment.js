import "../css/addep.css";
import { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../App";
import { insertOne } from "../methods/methods";

const AddDepartment = () => {
  const [dName, setDname] = useState("");
  const { setIsAddDepartment } = useContext(DataContext);

  const saveDep = async () => {
    await insertOne("department", {
      name: dName,
      employees: [],
    });
    setIsAddDepartment(false);
  };
  return (
    <div className="dep-modal-container">
      <div className="dep-modal">
        <button className="dep-close" onClick={() => setIsAddDepartment(false)}>
          <IoClose />
        </button>
        <div className="dep-modal-content">
          <h3>Add Department</h3>
          <div className="dep-inp-grp">
            <h4>Department Name : </h4>
            <input
              value={dName}
              onChange={(e) => setDname(e.target.value)}
              type="text"
              placeholder="Enter department name..."
            />
          </div>
          <div className="btns">
            <button className="save-dep" onClick={() => saveDep()}>
              Save Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
