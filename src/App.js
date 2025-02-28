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

const DataContext = createContext(null);

function App() {
  const [navActive, setNavActive] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    updateEmployeesOnLeave();
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
        const timeInAM = i.value?.timeInAM || null;
        const timeInPM = i.value?.timeInPM || null;
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
          avatar: i.value?.avatar || "",
          firsName: i.firsName,
          lastName: i.lastName,
          date: i.value?.date || new Date().toISOString().split("T")[0],
          employeeID: i.value?.employeeID || "",
          timeInAM,
          timeInPM,
          timeOutAM: i.value?.timeOutAM || null,
          timeOutPM: i.value?.timeOutPM || null,
          isLate,
        };
      });

      insertOne("allattendance", {
        attendance: newAttendance,
        date: new Date().toISOString().split("T")[0],
        totalLates,
        totalAbsents,
        totalLeaves,
      });

      await clearTable("attendance");
    } catch (error) {
      console.error("Error processing attendance:", error);
    }
  };

  if (isMobile) {
    return <></>;
  }

  return (
    <DataContext.Provider value={{ navActive, setNavActive }}>
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
            <Route
              path="/allattendance/view/:id"
              element={<ViewAlllAttendances />}
            />
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
