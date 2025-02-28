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

const DataContext = createContext(null);

function App() {
  const [navActive, setNavActive] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [type, setType] = useState(0);
  const [isActionModal, setIsActionModal] = useState(false);
  const [todaysLate, setTodaysLate] = useState(0);
  const [todaysAbsent, setTodaysAbsent] = useState(0);
  const [todaysLeave, setTodaysLeave] = useState(0);

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
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 20 && minutes === 49) {
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

      if (isInserted) {
        await clearTable("attendance");
      }
    } catch (error) {
      console.error("Error processing attendance:", error);
    }
  };

  if (isMobile) {
    return <></>;
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
        todaysLate,
        setTodaysLate,
        todaysAbsent,
        setTodaysAbsent,
        todaysLeave,
        setTodaysLeave,
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
            <Route path="/employee/profile/:id" element={<EditEmployee />} />
            <Route path="/profile/view" element={<Viewprofile />} />
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
