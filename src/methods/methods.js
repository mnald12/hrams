import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "@firebase/firestore"
import { db } from "../firebase/db"

const isNewUser = async (id) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('userId', "==", id));
        const data = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                value: doc.data()
            })
        })
        if (data.length === 0) {
            return true
        }
        else {
            return false
        }
    }
    catch (e) {
        return e
    }

}

const insertOne = async (table, data) => {

    try {
        await addDoc(collection(db, table), data)
        return true
    }
    catch (e) {
        return false
    }

}

const getOne = async (table, id) => {
    try {
        const docRef = doc(db, table, id);
        const docSnap = await getDoc(docRef);
        return docSnap.data()
    }
    catch (e) {
        return e
    }
}

const getAll = async (table) => {
    try {
        const data = []
        const querySnapshot = await getDocs(collection(db, table));
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                value: doc.data()
            })
        })
        return data
    }
    catch (e) {
        return e
    }
}

const update = async (table, id, toBeUpdated) => {
    try {
        const docRef = doc(db, table, id);
        await updateDoc(docRef, toBeUpdated);
    }
    catch (e) {
        return e
    }
}

const deleteOne = async (table, id) => {
    try {
        await deleteDoc(doc(db, table, id));
        return 'deleted'
    }
    catch (e) {
        return e
    }
}

const deleteTable = async (table) => {
    try {

    }
    catch (e) {
        return e
    }
}

export { isNewUser, insertOne, getOne, getAll, update, deleteOne, deleteTable }