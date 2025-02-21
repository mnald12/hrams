import "../css/modal.css";
import "../css/employee.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { insertOne } from "../methods/methods";
import { useState } from "react";

const Addemployee = () => {
  const [rfid, setRfid] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mname, setMname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [employed, setEmployed] = useState("");

  const addEmployee = () => {
    const add = insertOne("employee", {
      rfid: rfid,
      firstName: fname,
      lastName: lname,
      middleName: mname,
      age: age,
      gender: gender,
      email: email,
      phone: phone,
      address: address,
      position: position,
      employed: employed,
      late: [],
      absent: [],
      leave: [],
    });

    if (add) {
      document.getElementById("add-employee").style.display = "none";
    }
  };

  return (
    <div className="modal" id="add-employee">
      <div className="modal-content">
        <button
          className="modal-close-btn"
          onClick={() =>
            (document.getElementById("add-employee").style.display = "none")
          }
        >
          <AiOutlineCloseCircle color="red" />
        </button>
        <div className="content-body">
          <h3>
            <BiUserCircle /> <span>Add Employee</span>
          </h3>
          <div className="form-container">
            <div className="form-left">
              <div className="preview"></div>
              <h4>Employee Image :</h4>
              <input type="file" />
            </div>
            <div className="form-right">
              <div className="inps">
                <div className="inp-grp">
                  <h4>RFID</h4>
                  <input
                    type="text"
                    onChange={(e) => setRfid(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Last Name :</h4>
                  <input
                    type="text"
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>First Name :</h4>
                  <input
                    type="text"
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Middle Name :</h4>
                  <input
                    type="text"
                    onChange={(e) => setMname(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Age :</h4>
                  <input type="text" onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="inp-grp">
                  <h4>Gender :</h4>
                  <select onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Femeale</option>
                  </select>
                </div>
                <div className="inp-grp">
                  <h4>Email :</h4>
                  <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Phone NO :</h4>
                  <input
                    type="text"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Address :</h4>
                  <input
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Position :</h4>
                  <input
                    type="text"
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Points Balance :</h4>
                  <input
                    type="text"
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>Employed :</h4>
                  <input
                    type="date"
                    onChange={(e) => setEmployed(e.target.value)}
                  />
                </div>
                <div className="inp-grp">
                  <h4>PDS :</h4>
                  <input type="file" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="modal-save-btn" onClick={() => addEmployee()}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Addemployee;
