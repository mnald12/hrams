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
  const [img, setImg] = useState(null);

  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getOne("profile", "admin");
        if (data) {
          setAddress(data.address || "");
          setAvatar(data.avatar || "");
          setEmail(data.email || "");
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          setPosition(data.position || "");
          setUsername(data.username || "");
          setPassword(data.password || "");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const updateAdmin = async () => {
    setIsLoading(true);
    let avatarUrl = avatar;

    if (img) {
      const imageRef = ref(
        storage,
        `images/${img.name + cryptoRandomString({ length: 10 })}`
      );
      const snapshot = await uploadBytes(imageRef, img);
      avatarUrl = await getDownloadURL(snapshot.ref);
    }

    const updatedEmployee = {
      address,
      avatar: avatarUrl,
      email,
      firstName,
      lastName,
      phone,
      position,
      username,
      password,
    };

    try {
      const updated = await update("profile", "admin", updatedEmployee);
      if (updated) {
        setIsActionModal(true);
        setType(17);
      } else {
        setIsActionModal(true);
        setType(18);
      }
    } catch (error) {
      console.error("Error updating admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="employee">
      <div className="form-container">
        <div className="form-left">
          <div className="preview">
            <img id="img-preview" src={avatar || nopic} alt="avatar" />
          </div>

          <h4>Admin Image:</h4>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImg(file);
                setAvatar(URL.createObjectURL(file));
              }
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>First Name:</h4>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Position:</h4>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Email:</h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Phone No:</h4>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Address:</h4>
              <input
                type="text"
                value={address}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inp-grp">
              <h4>Password:</h4>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="add-row-btn">
        <button onClick={updateAdmin} style={{ background: "orange" }}>
          Update profile
        </button>
      </div>
    </div>
  );
};

export default EditAdmin;
