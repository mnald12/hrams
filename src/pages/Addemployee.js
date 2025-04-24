import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/employee.css";
import { insertOne } from "../methods/methods";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/db";
import cryptoRandomString from "crypto-random-string";
import { DataContext } from "../App";
import { collection, onSnapshot } from "firebase/firestore";

const Addemployee = () => {
  const { setType, setIsActionModal } = useContext(DataContext);

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
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [img, setImg] = useState("");
  const [pdsFile, setPdsFile] = useState("");

  const [departments, setDepartments] = useState([]);

  const [inputsValues, setInputsValues] = useState([
    {
      from: "",
      to: "",
      slb: 0,
      vlb: 0,
      sle: 0,
      vle: 0,
      sls: 0,
      vls: 0,
    },
  ]);

  const addEmployee = async () => {
    setIsLoading(true);
    if (
      rfid !== "" ||
      fname !== "" ||
      lname !== "" ||
      mname !== "" ||
      age !== "" ||
      gender !== "" ||
      email !== "" ||
      phone !== "" ||
      address !== "" ||
      position !== "" ||
      employed !== ""
    ) {
      const imageRef = ref(
        storage,
        `images/${img.name + cryptoRandomString({ length: 10 })}`
      );
      const imageSnapshot = await uploadBytes(imageRef, img);
      const avatarUrl = await getDownloadURL(imageSnapshot.ref);

      const fileExtension = pdsFile.name.split(".").pop();
      const fileNameWithoutExt = pdsFile.name.replace(/\.[^/.]+$/, "");
      const newFileName = `${fileNameWithoutExt}_${cryptoRandomString({
        length: 10,
      })}.${fileExtension}`;

      const pdsRef = ref(storage, `pds/${newFileName}`);

      const pdsSnapshot = await uploadBytes(pdsRef, pdsFile);
      const pdsUrl = await getDownloadURL(pdsSnapshot.ref);

      const add = await insertOne("employee", {
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
        department,
        departmentId,
        isOnLeave: false,
        late: [],
        absent: [],
        leave: [],
        pds: pdsUrl,
        avatar: avatarUrl,
        points: inputsValues,
        thisYearPoints: {
          from: "",
          to: "",
          slb: 0,
          vlb: 0,
          sle: 0,
          vle: 0,
          sls: 0,
          vls: 0,
        },
      });

      if (add) {
        setInputsValues([
          {
            from: "",
            to: "",
            slb: 0,
            vlb: 0,
            sle: 0,
            vle: 0,
            sls: 0,
            vls: 0,
          },
        ]);
        setRfid("");
        setFname("");
        setLname("");
        setMname("");
        setAge("");
        setGender("");
        setEmail("");
        setPhone("");
        setAddress("");
        setPosition("");
        setEmployed("");
        setDepartment("");
        setImg("");
        setPdsFile("");
        setIsLoading(false);

        setType(0);
        setIsActionModal(true);
      } else {
        setType(1);
        setIsActionModal(true);
        return;
      }
    } else {
      setIsLoading(false);
      setType(12);
      setIsActionModal(true);
      return;
    }
  };

  const addRow = () => {
    setInputsValues((prev) => [
      ...prev,
      {
        from: "",
        to: "",
        slb: 0,
        vlb: 0,
        sle: 0,
        vle: 0,
        sls: 0,
        vls: 0,
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    setInputsValues((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  useEffect(() => {
    const collectionRef = collection(db, "department");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDepartments(items);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => unsubscribe();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview" style={{ minHeight: "180px" }}>
            <img id="img" alt="avatar" style={{ display: "none" }} />
          </div>
          <h4>Employee Image:</h4>
          <input
            type="file"
            id="imgs"
            onChange={(e) => {
              document.getElementById("img").src =
                URL.createObjectURL(e.target.files[0]) + "#toolbar=0";
              setImg(e.target.files[0]);
              document.getElementById("img").style.display = "block";
            }}
          />
          <h4 style={{ marginTop: "12px" }}>PDS:</h4>
          <input type="file" onChange={(e) => setPdsFile(e.target.files[0])} />
        </div>

        <div className="form-right">
          <h2>Personal Information</h2>
          <div className="inps">
            {[
              { label: "RFID", state: setRfid },
              { label: "Last Name", state: setLname },
              { label: "First Name", state: setFname },
              { label: "Middle Name", state: setMname },
              { label: "Age", state: setAge },
              { label: "Email", state: setEmail },
              { label: "Phone No", state: setPhone },
              { label: "Address", state: setAddress },
              { label: "Position", state: setPosition },
            ].map(({ label, state }, idx) => (
              <div className="inp-grp" key={idx}>
                <h4>{label}:</h4>
                <input type="text" onChange={(e) => state(e.target.value)} />
              </div>
            ))}

            <div className="inp-grp">
              <h4>Gender:</h4>
              <select onChange={(e) => setGender(e.target.value)}>
                <option value="Male" selected>
                  Male
                </option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="inp-grp">
              <h4>Employed:</h4>
              <input
                type="date"
                onChange={(e) => setEmployed(e.target.value)}
              />
            </div>

            <div className="inp-grp">
              <h4>Department:</h4>
              <select
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedDept = departments.find(
                    (d) => d.id === selectedId
                  );
                  setDepartment(selectedDept?.name || "");
                  setDepartmentId(selectedId);
                }}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container-bottom">
        <h2>Points Information</h2>
        {inputsValues.map((input, index) => (
          <div key={index} className="inps pts">
            <h5>{index === 0 ? "Current Points" : "Past Points"}</h5>
            <div className="inp-grp-4">
              <h4>From:</h4>
              <input
                type="date"
                value={input.from}
                onChange={(e) =>
                  handleInputChange(index, "from", e.target.value)
                }
              />
            </div>
            <div className="inp-grp-4">
              <h4>To:</h4>
              <input
                type="date"
                value={input.to}
                onChange={(e) => handleInputChange(index, "to", e.target.value)}
              />
            </div>
            <div className="inp-grp-4">
              <h4>SL Balance:</h4>
              <input
                type="number"
                value={input.slb}
                onChange={(e) =>
                  handleInputChange(index, "slb", e.target.value)
                }
              />
            </div>
            <div className="inp-grp-4">
              <h4>VL Balance:</h4>
              <input
                type="number"
                value={input.vlb}
                onChange={(e) =>
                  handleInputChange(index, "vlb", e.target.value)
                }
              />
            </div>
            <div className="inp-grp-4">
              <h4>SL Earned:</h4>
              <input
                type="number"
                value={input.sle}
                onChange={(e) =>
                  handleInputChange(index, "sle", e.target.value)
                }
              />
            </div>
            <div className="inp-grp-4">
              <h4>VL Earned:</h4>
              <input
                type="number"
                value={input.vle}
                onChange={(e) =>
                  handleInputChange(index, "vle", e.target.value)
                }
              />
            </div>
            <div className="inp-grp-4">
              <h4>SL Spent:</h4>
              <input
                type="number"
                value={input.sls}
                onChange={(e) =>
                  handleInputChange(index, "sls", e.target.value)
                }
              />
            </div>
            <div className="inp-grp-4">
              <h4>VL Spent:</h4>
              <input
                type="number"
                value={input.vls}
                onChange={(e) =>
                  handleInputChange(index, "vls", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className="add-row-btn">
          <button className="arbtn" onClick={addRow}>
            Add Past Points Row
          </button>
          <button onClick={addEmployee}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Addemployee;
