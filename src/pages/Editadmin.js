import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import "../css/employee.css";
import { getOne, update } from "../methods/methods";
import nopic from "../mopic.jpg";
import cryptoRandomString from "crypto-random-string";
import { storage } from "../firebase/db";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { DataContext } from "../App";

const EditAdmin = () => {
  const { setType, setIsActionModal } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState({});
  const [address, setAddress] = useState(employee.address || "");
  const [avatar, setAvatar] = useState(employee.avatar || "");
  const [email, setEmail] = useState(employee.email || "");
  const [firstName, setFirstName] = useState(employee.firstName || "");
  const [lastName, setLastName] = useState(employee.lastName || "");
  const [phone, setPhone] = useState(employee.phone || "");
  const [position, setPosition] = useState(employee.position || "");
  const [username, setUsername] = useState(employee.username || "");
  const [password, setPassword] = useState(employee.password || "");
  const [img, setImg] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOne("profile", "admin");
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const updateAdmin = async () => {
    setIsLoading(true);

    if (avatar instanceof File) {
      const imageRef = ref(
        storage,
        `images/${img.name + (await cryptoRandomString({ length: 10 }))}`
      );
      const snapshot = await uploadBytes(imageRef, img);
      const avatarUrl = await getDownloadURL(snapshot.ref);
      setAvatar(avatarUrl);
    }

    const updatedEmployee = {
      address: address,
      avatar: avatar,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      phone: phone,
      position: position,
      username: username,
    };

    const updated = await update("profile", "admin", updatedEmployee);
    console.log(updated);

    if (updated) {
      setIsActionModal(true);
      setType(17);
    } else {
      setIsActionModal(true);
      setType(18);
    }

    setIsLoading(false);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview">
            <img id="img" src={employee.avatar || nopic} alt="avatar" />
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
        </div>

        <div className="form-right">
          <h2>Personal Information</h2>
          <div className="inps">
            <div className="inp-grp">
              <h4>Last Name:</h4>
              <input
                type="text"
                value={lastName || employee.lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>First Name:</h4>
              <input
                type="text"
                value={firstName || employee.firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Position:</h4>
              <input
                type="text"
                value={position || employee.position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Email:</h4>
              <input
                type="text"
                value={email || employee.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Phone No:</h4>
              <input
                type="text"
                value={phone || employee.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Address:</h4>
              <input
                type="text"
                value={address || employee.address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <h2 style={{ marginTop: "20px" }}>Login Information</h2>
          <div className="inps">
            <div className="inp-grp">
              <h4>Username:</h4>
              <input
                type="text"
                value={username || employee.username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Password:</h4>
              <input
                type="password"
                value={password || employee.password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="add-row-btn">
        <button
          onClick={() => updateAdmin()}
          style={{ marginLeft: "20px !important", background: "orange" }}
        >
          Update profile
        </button>
      </div>
    </div>
  );
};

export default EditAdmin;
