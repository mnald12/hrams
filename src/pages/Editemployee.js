import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import "../css/employee.css";
import { getOne, update } from "../methods/methods";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/db";
import { cryptoRandomStringAsync } from "crypto-random-string";
import { DataContext } from "../App";

const EditEmployee = () => {
  const { setType, setIsActionModal } = useContext(DataContext);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
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
  const [img, setImg] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      const employee = await getOne("employee", id);
      if (employee) {
        setRfid(employee.rfid);
        setFname(employee.firstName);
        setLname(employee.lastName);
        setMname(employee.middleName);
        setAge(employee.age);
        setGender(employee.gender);
        setEmail(employee.email);
        setPhone(employee.phone);
        setAddress(employee.address);
        setPosition(employee.position);
        setEmployed(employee.employed);
        setImg(employee.avatar);
      }
    };
    fetchEmployee();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const updateEmployee = async () => {
    setIsLoading(true);
    let avatarUrl = img;

    if (img instanceof File) {
      const imageRef = ref(
        storage,
        `images/${img.name + (await cryptoRandomStringAsync({ length: 10 }))}`
      );
      const snapshot = await uploadBytes(imageRef, img);
      avatarUrl = await getDownloadURL(snapshot.ref);
    }

    const updatedEmployee = {
      rfid,
      firstName: fname,
      lastName: lname,
      middleName: mname,
      age,
      gender,
      email,
      phone,
      address,
      position,
      employed,
      avatar: avatarUrl,
    };

    const updated = await update("employee", id, updatedEmployee);

    if (updated) {
      setIsActionModal(true);
      setType(2);
    } else {
      setIsActionModal(true);
      setType(3);
    }

    setIsLoading(false);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview" style={{ minHeight: "180px" }}>
            <img
              id="img"
              src={img}
              alt="avatar"
              style={{ display: img ? "block" : "none" }}
            />
          </div>
          <h4>Employee Image:</h4>
          <input
            type="file"
            id="imgs"
            onChange={(e) => {
              setImg(URL.createObjectURL(e.target.files[0]) + "#toolbar=0");
              document.getElementById("img").style.display = "block";
            }}
          />
        </div>

        <div className="form-right">
          <h2>Personal Information</h2>
          <div className="inps">
            {[
              { label: "RFID", state: setRfid, value: rfid },
              { label: "Last Name", state: setLname, value: lname },
              { label: "First Name", state: setFname, value: fname },
              { label: "Middle Name", state: setMname, value: mname },
              { label: "Age", state: setAge, value: age },
              { label: "Email", state: setEmail, value: email },
              { label: "Phone No", state: setPhone, value: phone },
              { label: "Address", state: setAddress, value: address },
              { label: "Position", state: setPosition, value: position },
            ].map(({ label, state, value }, idx) => (
              <div className="inp-grp" key={idx}>
                <h4>{label}:</h4>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => state(e.target.value)}
                />
              </div>
            ))}

            <div className="inp-grp">
              <h4>Gender:</h4>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="inp-grp">
              <h4>Employed:</h4>
              <input
                type="date"
                value={employed}
                onChange={(e) => setEmployed(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="add-row-btn">
        <button
          style={{ marginLeft: "20px !important", background: "orange" }}
          onClick={updateEmployee}
        >
          Update Employee
        </button>
      </div>
    </div>
  );
};

export default EditEmployee;
