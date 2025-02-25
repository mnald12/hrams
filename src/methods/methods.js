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
    return docSnap.data();
  } catch (e) {
    return e;
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

  // Check if the 'attendance' collection has any documents
  const collectionSnapshot = await getDocs(attendanceRef);
  if (collectionSnapshot.empty) {
    return false; // Return false if 'attendance' collection does not exist or is empty
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

  return false; // Return false if employee is not found in attendance
};

const update = async (table, id, toBeUpdated) => {
  try {
    const docRef = doc(db, table, id);
    await updateDoc(docRef, toBeUpdated);
  } catch (e) {
    return e;
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

const deleteTable = async (table) => {
  try {
  } catch (e) {
    return e;
  }
};

export {
  isNewUser,
  insertOne,
  getOne,
  getAll,
  update,
  addToLate,
  deleteOne,
  deleteTable,
  getOneWithRFID,
  updateTimeInOut,
  checkEmployeeInAttendance,
  checkSession,
};
