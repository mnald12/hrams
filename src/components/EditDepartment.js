import "../css/addep.css";
import { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../App";
import { update } from "../methods/methods";

const EditDepartment = () => {
  const { setIsEditDepartment, dataToEdit } = useContext(DataContext);
  const [dName, setDname] = useState(dataToEdit.name);

  const saveDep = async (id) => {
    await update("department", dataToEdit.id, {
      name: dName,
    });
    setIsEditDepartment(false);
  };

  return (
    <div className="dep-modal-container">
      <div className="dep-modal">
        <button
          className="dep-close"
          onClick={() => setIsEditDepartment(false)}
        >
          <IoClose />
        </button>
        <div className="dep-modal-content">
          <h3 style={{ color: "orange" }}>Edit Department</h3>
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
            <button
              className="save-dep"
              style={{ background: "darkorange" }}
              onClick={() => saveDep()}
            >
              Update Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
