import { useEffect, useState } from "react";
import "../css/modal.css";
import "../css/profile.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const docRef = doc(db, "profile", "admin");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setProfile(data);
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="modal" id="profile">
      <div className="modal-content">
        <button
          className="modal-close-btn"
          onClick={() =>
            (document.getElementById("profile").style.display = "none")
          }
        >
          <AiOutlineCloseCircle color="red" />
        </button>
        <div className="content-body">
          <h3>
            <BiUserCircle /> <span>Profile</span>
          </h3>
          <div className="body-content">
            <div className="bc-left">
              <img alt="profile" src={profile.avatar} />
            </div>
            <div className="bc-right">
              <div className="profile-detail">
                <h5>Name :</h5>
                <h3>
                  {profile.firstName} {profile.lastName}
                </h3>
              </div>
              <div className="profile-detail">
                <h5>Position</h5>
                <h3>{profile.position}</h3>
              </div>
              <div className="profile-detail">
                <h5>Email :</h5>
                <h3>{profile.email}</h3>
              </div>
              <div className="profile-detail">
                <h5>Phone No. :</h5>
                <h3>{profile.phone}</h3>
              </div>
              <div className="profile-detail">
                <h5>Address :</h5>
                <h3>{profile.address}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
