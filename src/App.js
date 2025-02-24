import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Employee from "./pages/Employee";
import Perfomance from "./pages/Performance";
import Scanlog from "./pages/Scanlog";
import Attendances from "./pages/Attendances";
import { createContext, useState } from "react";
import Scanner from "./pages/Scanner";
import Leave from "./pages/Leave";
import Addemployee from "./pages/Addemployee";
import Viewemployee from "./pages/Viewemployee";
import Event from "./pages/Event";
import Allattendances from "./pages/Allattendance";

const DataContext = createContext(null);

function App() {
  const [navActive, setNavActive] = useState("Dashboard");

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
            <Route path="/scanner" element={<Scanner />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;

export { DataContext };
