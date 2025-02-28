import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
} from "@firebase/firestore";
import { db } from "../firebase/db";

const isNewUser = async (id) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", id));
    const data = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        value: doc.data(),
      });
    });
    if (data.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

const insertOne = async (table, data) => {
  try {
    const docRef = await addDoc(collection(db, table), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

const getOne = async (table, id) => {
  try {
    const docRef = doc(db, table, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error fetching document:", e);
    return null;
  }
};

const login = async (uname, pwd) => {
  const profile = await getOne("profile", "admin");
  if (uname === profile.username && pwd === profile.password) {
    await update("profile", "admin", {
      isLogin: true,
    });
  }
};

const getOneWithRFID = (table, rfid, callback) => {
  const employeesRef = collection(db, table);
  const q = query(employeesRef, where("rfid", "==", rfid));

  getDocs(q)
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        callback({ id: doc.id, ...doc.data() }, true);
      } else {
        callback({}, false);
      }
    })
    .catch((error) => {
      console.error("Error fetching employee data:", error);
      callback(null, error);
    });
};

const getAll = async (table) => {
  try {
    const data = [];
    const querySnapshot = await getDocs(collection(db, table));
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        value: doc.data(),
      });
    });
    return data;
  } catch (e) {
    return e;
  }
};

const getEmployeeAttendance = async (employeeID) => {
  try {
    const allAttendance = await getAll("allattendance");
    return allAttendance
      .flatMap((doc) => doc.value.attendance)
      .filter((record) => record.employeeID === employeeID);
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    return [];
  }
};

const getAttendance = async (attendanceID) => {
  try {
    const attendanceDoc = await getDoc(doc(db, "allattendance", attendanceID));

    if (attendanceDoc.exists()) {
      const data = attendanceDoc.data();
      return data.attendance || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    return [];
  }
};

const checkEmployeeInAttendance = async (employeeId) => {
  const employeesRef = collection(db, "attendance");

  const collectionSnapshot = await getDocs(employeesRef);
  if (collectionSnapshot.empty) {
    return false;
  }

  const q = query(employeesRef, where("employeeID", "==", employeeId));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

const checkSession = async (employeeId, session) => {
  const attendanceRef = collection(db, "attendance");

  const collectionSnapshot = await getDocs(attendanceRef);
  if (collectionSnapshot.empty) {
    return false;
  }

  const q = query(attendanceRef, where("employeeID", "==", employeeId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data();
    const sessions = docData.sessions || {};

    switch (session) {
      case "TIME_IN_AM":
        return sessions.timeInAmDone || false;
      case "TIME_IN_PM":
        return sessions.timeInPmDone || false;
      case "TIME_OUT_AM":
        return sessions.timeOutAmDone || false;
      case "TIME_OUT_PM":
        return sessions.timeOutPmDone || false;
      default:
        throw new Error("Invalid session type.");
    }
  }

  return false;
};

const update = async (table, id, toBeUpdated) => {
  try {
    const userRef = doc(db, table, id);
    await updateDoc(userRef, toBeUpdated);
  } catch (error) {
    console.error("Error updating user data: ", error);
  }
};

const updateTimeInOut = async (employeeID, val) => {
  try {
    const attref = collection(db, "attendance");
    const q = query(attref, where("employeeID", "==", employeeID));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No employee found with this id.");
      return;
    }

    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "attendance", document.id);
      await updateDoc(docRef, val);
      console.log(`Updated employee ${employeeID}`);
    });
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

const addToLate = async (table, id, value) => {
  try {
    const docRef = doc(db, table, id);
    await updateDoc(docRef, {
      late: arrayUnion(value),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating 'late' array:", error);
    return { success: false, error };
  }
};

const deleteOne = async (table, id) => {
  try {
    await deleteDoc(doc(db, table, id));
    return "deleted";
  } catch (e) {
    return e;
  }
};

const clearTable = async (table) => {
  try {
    const querySnapshot = await getDocs(collection(db, table));
    const batchSize = 500;
    let batch = [];
    querySnapshot.forEach((document) => {
      batch.push(deleteDoc(doc(db, table, document.id)));
      if (batch.length === batchSize) {
        Promise.all(batch);
        batch = [];
      }
    });
    if (batch.length > 0) await Promise.all(batch);
  } catch (error) {
    console.error(`Error clearing collection '${table}':`, error);
  }
};

const getMostLateEmployee = (employees) => {
  if (!employees || employees.length === 0) return null;

  const arrs = employees.map((employee) => {
    let totalHours = employee.late.reduce(
      (sum, obj) => sum + (obj.lateTime?.hour || 0),
      0
    );
    let totalMinutes = employee.late.reduce(
      (sum, obj) => sum + (obj.lateTime?.minute || 0),
      0
    );

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return {
      name: `${employee.firstName} ${employee.lastName[0]}.`,
      hour: totalHours,
      minutes: totalMinutes,
    };
  });

  return arrs.reduce(
    (max, obj) =>
      obj.hour > max.hour ||
      (obj.hour === max.hour && obj.minutes > max.minutes)
        ? obj
        : max,
    arrs[0]
  );
};

const getMostLeaveEmployee = async () => {
  const leaveCollection = collection(db, "leave");
  const leaveSnapshot = await getDocs(leaveCollection);
  const leaveData = leaveSnapshot.docs.map((doc) => doc.data());

  if (!leaveData || leaveData.length === 0) return null;

  const leaveMap = {};

  leaveData.forEach((leave) => {
    if (leave.status === "Approved") {
      const fromDate = new Date(Date.parse(leave.from));
      const toDate = new Date(Date.parse(leave.to));
      const days = (toDate - fromDate) / (1000 * 60 * 60 * 24) + 1;

      if (!leaveMap[leave.employeeID]) {
        leaveMap[leave.employeeID] = {
          firstName: leave.firstName,
          lastName: leave.lastName,
          leaveDays: 0,
        };
      }
      leaveMap[leave.employeeID].leaveDays += days;
    }
  });

  const leaveArray = Object.values(leaveMap);

  return leaveArray.reduce(
    (max, obj) => (obj.leaveDays > max.leaveDays ? obj : max),
    leaveArray[0]
  );
};

const approveLeave = async (leaveId) => {
  const leaveRef = doc(db, "leave", leaveId);
  try {
    await updateDoc(leaveRef, { status: "Approved" });
    return true;
  } catch (error) {
    console.error("Error updating leave status:", error);
    return false;
  }
};

const rejectLeave = async (leaveId) => {
  const leaveRef = doc(db, "leave", leaveId);
  try {
    await deleteDoc(leaveRef);
    return true;
  } catch (error) {
    console.error("Error rejecting leave request:", error);
    return false;
  }
};

const updateEmployeesOnLeave = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const leaveSnapshot = await getDocs(collection(db, "leave"));
    const leaveData = leaveSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const employeesOnLeave = leaveData
      .filter((leave) => {
        if (leave.status !== "Approved") return false;

        const fromDate = new Date(leave.from + "T00:00:00");
        const toDate = new Date(leave.to + "T23:59:59");

        return fromDate <= today && toDate >= today;
      })
      .map((leave) => leave.employeeID);

    const employeeSnapshot = await getDocs(collection(db, "employee"));
    const employees = employeeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (const emp of employees) {
      const shouldBeOnLeave = employeesOnLeave.includes(emp.id);

      if (emp.isOnLeave !== shouldBeOnLeave) {
        await updateDoc(doc(db, "employee", emp.id), {
          isOnLeave: shouldBeOnLeave,
        });
        console.log(
          `Updated ${emp.firstName} ${emp.lastName}: isOnLeave = ${shouldBeOnLeave}`
        );
      }
    }
  } catch (error) {
    console.error("Error updating leave status:", error);
  }
};

export {
  isNewUser,
  insertOne,
  getOne,
  getAll,
  login,
  getEmployeeAttendance,
  getAttendance,
  update,
  addToLate,
  deleteOne,
  clearTable,
  getOneWithRFID,
  updateTimeInOut,
  checkEmployeeInAttendance,
  checkSession,
  getMostLateEmployee,
  getMostLeaveEmployee,
  approveLeave,
  rejectLeave,
  updateEmployeesOnLeave,
};
