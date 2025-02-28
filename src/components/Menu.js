import "../css/menu.css";
import usr from "../user.png";
import { AiOutlineMenu, AiOutlinePoweroff } from "react-icons/ai";
import { ddClose, ddOpen } from "../methods/navMethods";
import { GrClose } from "react-icons/gr";
import { BiUserCircle } from "react-icons/bi";
import { update } from "../methods/methods";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";

const Menu = () => {
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
    <>
      <div className="header-profiles">
        <div className="profile">
          <div className="profile-info">
            <h3>{profile.firstName}</h3>
            <small>{profile.position}</small>
          </div>
          <img src={usr} alt="profile" />
          <button id="ddOpen" onClick={() => ddOpen()}>
            <AiOutlineMenu className="ddIcn" />
          </button>
          <button id="ddClose" onClick={() => ddClose()}>
            <GrClose className="ddIcn" />
          </button>
        </div>
      </div>
      <div className="header-content" id="header-content">
        <h3>Menu</h3>
        <div>
          <button
            onClick={() =>
              (document.getElementById("profile").style.display = "flex")
            }
          >
            <BiUserCircle className="icn" /> Profile
          </button>
          <button
            onClick={() => {
              update("profile", "admin", { isLogin: false });
            }}
          >
            <AiOutlinePoweroff color="red" className="icn" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Menu;
