import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Employee from "./pages/Employee";
import Perfomance from "./pages/Performance";
import Scanlog from "./pages/Scanlog";
import Attendances from "./pages/Attendances";
import { createContext, useEffect, useState } from "react";
import Scanner from "./pages/Scanner";
import Leave from "./pages/Leave";
import Addemployee from "./pages/Addemployee";
import Viewemployee from "./pages/Viewemployee";
import Event from "./pages/Event";
import Allattendances from "./pages/Allattendance";
import {
  clearTable,
  getAll,
  insertOne,
  updateEmployeesOnLeave,
} from "./methods/methods";
import LoginPage from "./pages/Loginpage";
import ViewAlllAttendances from "./pages/Viewallattendance";
import EditEmployee from "./pages/Editemployee";
import Viewprofile from "./pages/Viewprofile";
import EmployeeProfile from "./pages/Employeeprofile";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase/db";
import EditAdmin from "./pages/Editadmin";

const DataContext = createContext(null);
let tl = 0;

function App() {
  const [navActive, setNavActive] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [type, setType] = useState(0);
  const [isActionModal, setIsActionModal] = useState(false);
  const [present, setPresent] = useState(0);
  const [todaysLate, setTodaysLate] = useState(0);
  const [todaysAbsent, setTodaysAbsent] = useState(0);
  const [todaysLeave, setTodaysLeave] = useState(0);
  const [isLogin, setIsLogin] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchs = async () => {
      const olc = await updateEmployeesOnLeave();
      setTodaysLeave(olc);
    };

    fetchs();
  }, []);

  useEffect(() => {
    const collectionRef = collection(db, "lates");

    const unsubscribe = onSnapshot(
      collectionRef,
      async (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodaysLate(items.length);
        tl = items.length;
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const collectionRef = collection(db, "attendance");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPresent(items.length);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 18 && minutes === 0) {
        console.log("It's 6 PM! Running function...");
        processAttendance();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const processAttendance = async () => {
    try {
      const attendance = await getAll("attendance");
      if (!attendance.length) {
        console.log("No attendance records to process.");
        return;
      }

      const requiredTimeAM = "08:00";
      const requiredTimePM = "13:00";

      let totalLates = 0;
      let totalAbsents = 0;
      let totalLeaves = 0;

      const newAttendance = attendance.map((i) => {
        console.log(i);
        const timeInAM = i.value?.timeInAM ?? null;
        const timeInPM = i.value?.timeInPM ?? null;
        let isLate = false;

        if (
          (timeInAM && timeInAM > requiredTimeAM) ||
          (timeInPM && timeInPM > requiredTimePM)
        ) {
          isLate = true;
          totalLates++;
        }

        if (!timeInAM && !timeInPM) {
          totalAbsents++;
        }

        return {
          avatar: i.value?.avatar ?? "",
          firstName: i.value?.firstName ?? "",
          lastName: i.value?.lastName ?? "",
          date: i.value?.date ?? new Date().toISOString().split("T")[0],
          employeeID: i.value?.employeeID ?? "",
          timeInAM,
          timeInPM,
          timeOutAM: i.value?.timeOutAM ?? null,
          timeOutPM: i.value?.timeOutPM ?? null,
          isLate,
        };
      });

      const isInserted = await insertOne("allattendance", {
        attendance: newAttendance,
        date: new Date().toISOString().split("T")[0],
        totalLates,
        totalAbsents,
        totalLeaves,
      });

      const isLatesInserted = await insertOne("alllates", {
        date: new Date().toISOString().split("T")[0],
        late: tl,
      });

      if (isInserted && isLatesInserted) {
        await clearTable("attendance");
        await clearTable("lates");
        setType(19);
        setIsActionModal(true);
      } else {
        setType(20);
        setIsActionModal(true);
      }
    } catch (error) {
      console.error("Error processing attendance:", error);
    }
  };

  if (isMobile) {
    return (
      <div className="warning-container">
        <p className="warning-text">
          This system is best viewed on a larger device. Please switch to a
          bigger screen for the best experience.
        </p>
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        navActive,
        setNavActive,
        type,
        setType,
        isActionModal,
        setIsActionModal,
        present,
        todaysLate,
        todaysAbsent,
        setTodaysAbsent,
        todaysLeave,
        setTodaysLeave,
        isLogin,
        setIsLogin,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/attendance" element={<Attendances />} />
            <Route path="/allattendance" element={<Allattendances />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/performance" element={<Perfomance />} />
            <Route path="/scanlog" element={<Scanlog />} />
            <Route path="/events" element={<Event />} />
            <Route path="/employee/add" element={<Addemployee />} />
            <Route path="/employee/view/:id" element={<Viewemployee />} />
            <Route path="/employee/edit/:id" element={<EditEmployee />} />
            <Route
              path="/allattendance/view/:id"
              element={<ViewAlllAttendances />}
            />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/profile/view" element={<Viewprofile />} />
            <Route path="/profile/edit" element={<EditAdmin />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;

export { DataContext };
