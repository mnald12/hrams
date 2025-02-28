import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import "../css/dashboard.css";
import "../css/scanlog.css";
import Loader from "../components/Loader";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/db";

const parseDateString = (dateString) => {
  try {
    // Remove the day of the week (e.g., "Tuesday, ")
    let cleanedDate = dateString.replace(/^\w+, /, "");

    // Convert to a valid date object
    return new Date(cleanedDate);
  } catch (error) {
    console.error("Error parsing date:", error);
    return new Date(0); // Return epoch time if invalid
  }
};

const Scanlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const collectionRef = collection(db, "scanlog");

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            time: parseDateString(data.time), // Convert string to Date object
          };
        });

        // Sort logs by time (most recent first)
        items.sort((a, b) => b.time - a.time);

        setLogs(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter logs based on RFID search input
  const filteredLogs = logs.filter((log) => log.rfid.includes(search));

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
                placeholder="Search by RFID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <table className="log-table">
              <thead className="log-table-sticky">
                <tr className="bg-gray-200">
                  <th>RFID</th>
                  <th>Date / Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td>{log.rfid}</td>
                    <td>{log.time.toLocaleString()}</td>{" "}
                    {/* Display formatted date */}
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
