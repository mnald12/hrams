import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import "../css/dashboard.css";
import "../css/scanlog.css";
import Loader from "../components/Loader";
const Scanlog = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Sample scan logs
    const sampleLogs = [
      {
        employee: "John Doe",
        rfid: "1234567890",
        time: "08:00 AM",
        date: "02/12/2025",
      },
      {
        employee: "Jane Smith",
        rfid: "0987654321",
        time: "08:15 AM",
        date: "02/12/2025",
      },
      {
        employee: "Alice Brown",
        rfid: "1122334455",
        time: "08:30 AM",
        date: "02/12/2025",
      },
      {
        employee: "Bob White",
        rfid: "5566778899",
        time: "09:00 AM",
        date: "02/12/2025",
      },
    ];
    setLogs(sampleLogs);
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.employee.toLowerCase().includes(search.toLowerCase()) ||
      log.rfid.includes(search)
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="scanlog">
        <div className="scan-log-container p-4 shadow-lg rounded-2xl">
          <div className="scan-log-header flex justify-between mb-4">
            <div className="search-container relative w-1/2">
              <FiSearch
                className="search-icon absolute left-2 top-2 text-gray-500"
                size={20}
              />
              <input
                className="search-input pl-8 border rounded px-2 py-1"
                placeholder="Search by Employee or RFID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <table>
              <thead>
                <tr className="bg-gray-200">
                  <th>Employee</th>
                  <th>RFID</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td>{log.employee}</td>
                    <td>{log.rfid}</td>
                    <td>{log.date}</td>
                    <td>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    );
  }
};

export default Scanlog;
