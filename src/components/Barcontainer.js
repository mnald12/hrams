import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed

const startOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);
const endOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
);

const Barcontainer = () => {
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "department");

    const unsubscribe = onSnapshot(
      collectionRef,
      async (querySnapshot) => {
        const departmentPromises = querySnapshot.docs.map(async (doc) => {
          const departmentId = doc.id;
          const departmentData = doc.data();

          const employeesQuery = query(
            collection(db, "employee"),
            where("departmentId", "==", departmentId)
          );
          const employeeSnapshot = await getDocs(employeesQuery);
          const employees = employeeSnapshot.docs.map((empDoc) => ({
            id: empDoc.id,
            ...empDoc.data(),
          }));

          // Count lates, leaves, absents
          let totalLate = 0;
          let totalLeave = 0;
          let totalAbsent = 0;

          const dateRange = [
            where("timestamp", ">=", Timestamp.fromDate(startOfMonth)),
            where("timestamp", "<=", Timestamp.fromDate(endOfMonth)),
          ];

          for (const employee of employees) {
            const lateQuery = query(
              collection(db, "employee", employee.id, "lates"),
              ...dateRange
            );
            const lateSnap = await getDocs(lateQuery);
            totalLate += lateSnap.size;

            const leaveQuery = query(
              collection(db, "employee", employee.id, "leaves"),
              ...dateRange
            );
            const leaveSnap = await getDocs(leaveQuery);
            totalLeave += leaveSnap.size;

            const absentQuery = query(
              collection(db, "employee", employee.id, "absents"),
              ...dateRange
            );
            const absentSnap = await getDocs(absentQuery);
            totalAbsent += absentSnap.size;
          }

          return {
            name: departmentData.name,
            late: totalLate,
            leave: totalLeave,
            absent: totalAbsent,
          };
        });

        const departmentStats = await Promise.all(departmentPromises);
        setDepartment(departmentStats);
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => unsubscribe();
  }, []);
};

export default Barcontainer;
