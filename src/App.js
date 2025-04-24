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
  addToAbsent,
  checkCollection,
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
import ExcelViewer from "./pages/Excelviewer";
import Department from "./pages/Department";

const DataContext = createContext(null);
let tl = 0;

function App() {
  const [navActive, setNavActive] = useState(
    sessionStorage.getItem("navActive") ?? "Dashboard"
  );
  const [isMobile, setIsMobile] = useState(false);
  const [type, setType] = useState(0);
  const [isActionModal, setIsActionModal] = useState(false);
  const [present, setPresent] = useState(0);
  const [todaysLate, setTodaysLate] = useState(0);
  const [todaysAbsent, setTodaysAbsent] = useState(0);
  const [todaysLeave, setTodaysLeave] = useState(0);
  const [isLogin, setIsLogin] = useState(
    JSON.parse(sessionStorage.getItem("isLogin")) ?? false
  );
  const [excelFile, setExcelFile] = useState("");
  const [isAddDepartment, setIsAddDepartment] = useState(false);
  const [isEditDepartment, setIsEditDepartment] = useState(false);
  const [isViewDepartment, setIsViewDepartment] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [dataToView, setDataToView] = useState(null);

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
    const collectionRef = collection(db, "absent");

    const unsubscribe = onSnapshot(
      collectionRef,
      async (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodaysAbsent(items.length);
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

      if (hours === 10 && minutes === 0) {
        processAbsent();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const processAbsent = async () => {
    const isEmpty = await checkCollection("attendance");

    const atts = await getAll("attendance");
    const emps = await getAll("employee");

    let ta = 0;

    if (isEmpty) {
      const today = new Date().getDay();
      const isWeekend = today === 0 || today === 6;

      if (isWeekend) return;

      for (let emp of emps) {
        await addToAbsent("employee", emp.id, {
          date: new Date(),
        });
        ta++;
      }

      await insertOne("allabsent", {
        date: new Date().toISOString().split("T")[0],
        absent: ta,
      });

      setTodaysAbsent(ta);

      return;
    }

    const attendedEmpIds = new Set(atts.map((att) => att.employeeID));

    for (let emp of emps) {
      if (!attendedEmpIds.has(emp.id)) {
        await addToAbsent("employee", emp.id, {
          date: new Date(),
        });
        ta++;
      }
    }

    await insertOne("allabsent", {
      date: new Date().toISOString().split("T")[0],
      absent: ta,
    });

    setTodaysAbsent(ta);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 18 && minutes === 0) {
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
        excelFile,
        setExcelFile,
        isAddDepartment,
        setIsAddDepartment,
        isEditDepartment,
        setIsEditDepartment,
        dataToEdit,
        setDataToEdit,
        isViewDepartment,
        setIsViewDepartment,
        dataToView,
        setDataToView,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/department" element={<Department />} />
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
            <Route
              path="/employee/view/applicationform"
              element={<ExcelViewer />}
            />
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
