/* eslint-disable no-loop-func */
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
  writeBatch,
} from "@firebase/firestore";

import { db, storage } from "../firebase/db";

import {
  format,
  startOfWeek,
  addDays,
  parseISO,
  eachDayOfInterval,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { getDownloadURL, ref } from "firebase/storage";

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
  try {
    const profile = await getOne("profile", "admin");

    if (!profile) {
      console.error("Admin profile not found.");
      return false;
    }

    return uname === profile.username && pwd === profile.password;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return false;
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
    return true;
  } catch (error) {
    console.error("Error updating user data: ", error);
    return false;
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

const addToAbsent = async (table, id, value) => {
  try {
    const docRef = doc(db, table, id);
    await updateDoc(docRef, {
      absent: arrayUnion(value),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating 'absent' array:", error);
    return { success: false, error };
  }
};

const addToLeave = async (table, id, value) => {
  try {
    const docRef = doc(db, table, id);
    await updateDoc(docRef, {
      leave: arrayUnion(value),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating 'leave' array:", error);
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

const getEmployeeLeaves = async (employeeID) => {
  try {
    const allLeaves = await getAll("leave");
    return allLeaves
      .map((doc) => doc.value)
      .filter((leave) => leave.employeeID === employeeID);
  } catch (error) {
    console.error("Error fetching employee leaves:", error);
    return [];
  }
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
  const l = await getOne("leave", leaveId);
  try {
    await updateDoc(leaveRef, { status: "Approved" });
    return {
      isOk: true,
      leaveData: l,
    };
  } catch (error) {
    console.error("Error updating leave status:", error);
    return false;
  }
};

const rejectLeave = async (leaveId) => {
  const leaveRef = doc(db, "leave", leaveId);
  try {
    await updateDoc(leaveRef, { status: "Rejected" });
    return true;
  } catch (error) {
    console.error("Error updating leave status:", error);
    return false;
  }
};

const updateEmployeesOnLeave = async () => {
  const today = new Date();
  today.setHours(8, 0, 0, 0);

  try {
    const leaveSnapshot = await getDocs(collection(db, "leave"));
    const leaveData = leaveSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const employeesOnLeave = new Set(
      leaveData
        .filter((leave) => {
          if (leave.status !== "Approved") return false;

          const fromDate = new Date(`${leave.from}T00:00:00`);
          const toDate = new Date(`${leave.to}T23:59:59`);

          return fromDate <= today && toDate >= today;
        })
        .map((leave) => leave.employeeID)
    );

    const employeeSnapshot = await getDocs(collection(db, "employee"));
    const employees = employeeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const batch = writeBatch(db);
    let onLeaveCount = 0;

    for (const emp of employees) {
      const shouldBeOnLeave = employeesOnLeave.has(emp.id);

      if (emp.isOnLeave !== shouldBeOnLeave) {
        batch.update(doc(db, "employee", emp.id), {
          isOnLeave: shouldBeOnLeave,
        });
      }

      if (shouldBeOnLeave) onLeaveCount++;
    }

    await batch.commit();
    return onLeaveCount;
  } catch (error) {
    console.error("Error updating leave status:", error);
    return 0;
  }
};

async function getLatesData() {
  const latesRef = collection(db, "alllates");
  const today = new Date();

  const startWeek = format(
    startOfWeek(today, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const endWeek = format(
    addDays(startOfWeek(today, { weekStartsOn: 1 }), 4),
    "yyyy-MM-dd"
  );

  const startYear = format(new Date(today.getFullYear(), 0, 1), "yyyy-MM-dd");
  const endYear = format(new Date(today.getFullYear(), 11, 31), "yyyy-MM-dd");

  const weeklyQuery = query(
    latesRef,
    where("date", ">=", startWeek),
    where("date", "<=", endWeek)
  );
  const monthlyQuery = query(
    latesRef,
    where("date", ">=", startYear),
    where("date", "<=", endYear)
  );

  const weeklySnapshot = await getDocs(weeklyQuery);
  const monthlySnapshot = await getDocs(monthlyQuery);

  let weeklyData = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  };

  let monthlyData = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  weeklySnapshot.forEach((doc) => {
    const data = doc.data();
    const dayName = format(parseISO(data.date), "EEEE");

    if (weeklyData[dayName] !== undefined) {
      weeklyData[dayName] += data.late || 0;
    }
  });

  monthlySnapshot.forEach((doc) => {
    const data = doc.data();
    const monthName = format(parseISO(data.date), "MMMM");

    monthlyData[monthName] += data.late || 0;
  });

  const weeklyArray = Object.keys(weeklyData).map((day) => ({
    name: day,
    late: weeklyData[day],
  }));
  const monthlyArray = Object.keys(monthlyData).map((month) => ({
    name: month,
    late: monthlyData[month],
  }));

  return { weeklyArray, monthlyArray };
}

async function getLeaveData() {
  const leaveRef = collection(db, "leave");

  // Get current date
  const today = new Date();

  // Define start and end of week (Monday–Friday)
  const startWeek = format(
    startOfWeek(today, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const endWeek = format(
    addDays(startOfWeek(today, { weekStartsOn: 1 }), 4),
    "yyyy-MM-dd"
  );
  // Firestore queries (string comparisons)
  const leaveQuery = query(leaveRef, where("status", "==", "Approved"));

  // Fetch data
  const leaveSnapshot = await getDocs(leaveQuery);

  // Initialize weekly data structure
  let weeklyData = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  };

  // Initialize full-year monthly structure with all months set to 0
  let monthlyData = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  // Process leave data
  leaveSnapshot.forEach((doc) => {
    const data = doc.data();
    const leaveDays = eachDayOfInterval({
      start: parseISO(data.from),
      end: parseISO(data.to),
    });

    leaveDays.forEach((day) => {
      const dayString = format(day, "yyyy-MM-dd");
      const dayName = format(day, "EEEE"); // Get day name (Monday, Tuesday, etc.)
      const monthName = format(day, "MMMM"); // Get month name (March, April, etc.)

      // Add to weekly data (only if it's Mon–Fri)
      if (
        weeklyData[dayName] !== undefined &&
        dayString >= startWeek &&
        dayString <= endWeek
      ) {
        weeklyData[dayName] += 1;
      }

      // Add to monthly data
      if (monthlyData[monthName] !== undefined) {
        monthlyData[monthName] += 1;
      }
    });
  });

  // Convert to array format
  const weeklyArray = Object.keys(weeklyData).map((day) => ({
    name: day,
    leave: weeklyData[day],
  }));
  const monthlyArray = Object.keys(monthlyData).map((month) => ({
    name: month,
    leave: monthlyData[month],
  }));

  console.log("Weekly Leave Data (Mon-Fri):", weeklyArray);
  console.log("Monthly Leave Data (Jan-Dec):", monthlyArray);

  return { weeklyArray, monthlyArray };
}

const checkCollection = async (collection) => {
  return (await getDocs(collection(db, collection))).empty;
};

const download = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop(); // default filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed", error);
    alert("Failed to download file.");
  }
};

async function getLates() {
  const departmentSnapshot = await getDocs(collection(db, "department"));
  const today = new Date();
  const results = [];

  for (const dept of departmentSnapshot.docs) {
    const departmentId = dept.id;
    const departmentName = dept.data().name;

    const employeeSnapshot = await getDocs(collection(db, "employee"));

    let lateCount = 0;

    // eslint-disable-next-line no-loop-func
    employeeSnapshot.docs.forEach((empDoc) => {
      const emp = empDoc.data();
      if (emp.departmentId !== departmentId || !Array.isArray(emp.late)) return;

      emp.late.forEach((entry) => {
        if (entry.date?.toDate && isSameMonth(entry.date.toDate(), today)) {
          lateCount++;
        }
      });
    });

    results.push({
      name: departmentName,
      late: lateCount,
    });
  }

  return results;
}

async function getAbsents() {
  const departmentSnapshot = await getDocs(collection(db, "department"));
  const today = new Date();
  const results = [];

  for (const dept of departmentSnapshot.docs) {
    const departmentId = dept.id;
    const departmentName = dept.data().name;

    const employeeSnapshot = await getDocs(collection(db, "employee"));

    let absentCount = 0;

    employeeSnapshot.docs.forEach((empDoc) => {
      const emp = empDoc.data();
      if (emp.departmentId !== departmentId || !Array.isArray(emp.absent))
        return;

      emp.absent.forEach((entry) => {
        if (entry.date?.toDate && isSameMonth(entry.date.toDate(), today)) {
          absentCount++;
        }
      });
    });

    results.push({
      name: departmentName,
      absent: absentCount,
    });
  }

  return results;
}

async function getLeaves() {
  const departmentSnapshot = await getDocs(collection(db, "department"));
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const results = [];

  for (const dept of departmentSnapshot.docs) {
    const departmentId = dept.id;
    const departmentName = dept.data().name;

    const employeeSnapshot = await getDocs(collection(db, "employee"));

    let leaveCount = 0;

    employeeSnapshot.docs.forEach((empDoc) => {
      const emp = empDoc.data();

      if (emp.departmentId !== departmentId || !Array.isArray(emp.leave))
        return;

      emp.leave.forEach((entry) => {
        const from = entry.from ? parseISO(entry.from) : null;
        const to = entry.to ? parseISO(entry.to) : null;

        if (from && to) {
          const overlap =
            isWithinInterval(monthStart, { start: from, end: to }) ||
            isWithinInterval(monthEnd, { start: from, end: to }) ||
            (from <= monthStart && to >= monthEnd);

          if (overlap) leaveCount++;
        }
      });
    });

    results.push({
      name: departmentName,
      leave: leaveCount,
    });
  }

  return results;
}

async function getDepartmentStats() {
  const [lateResults, leaveResults, absentResults] = await Promise.all([
    getLates(),
    getLeaves(),
    getAbsents(),
  ]);

  const merged = {};

  lateResults.forEach((item) => {
    merged[item.name] = {
      name: item.name,
      late: item.late,
      leave: 0,
      absent: 0,
    };
  });

  leaveResults.forEach((item) => {
    if (merged[item.name]) {
      merged[item.name].leave = item.leave;
    } else {
      merged[item.name] = {
        name: item.name,
        late: 0,
        leave: item.leave,
        absent: 0,
      };
    }
  });

  absentResults.forEach((item) => {
    if (merged[item.name]) {
      merged[item.name].absent = item.absent;
    } else {
      merged[item.name] = {
        name: item.name,
        late: 0,
        leave: 0,
        absent: item.absent,
      };
    }
  });

  return Object.values(merged);
}

export {
  insertOne,
  getOne,
  getAll,
  login,
  getEmployeeAttendance,
  getAttendance,
  update,
  addToLate,
  addToAbsent,
  addToLeave,
  deleteOne,
  clearTable,
  getOneWithRFID,
  updateTimeInOut,
  checkEmployeeInAttendance,
  checkSession,
  getEmployeeLeaves,
  getMostLateEmployee,
  getMostLeaveEmployee,
  approveLeave,
  rejectLeave,
  updateEmployeesOnLeave,
  getLatesData,
  getLeaveData,
  checkCollection,
  download,
  getDepartmentStats,
};
