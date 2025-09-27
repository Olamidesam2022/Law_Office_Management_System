import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config.js";

function buildQuery(
  collectionName,
  userId,
  conditions = [],
  orderByField = null,
  direction = "asc"
) {
  let q = query(collection(db, collectionName), where("userId", "==", userId));
  conditions.forEach((c) => {
    q = query(q, where(c.field, c.operator, c.value));
  });
  if (orderByField) {
    q = query(q, orderBy(orderByField, direction));
  }
  return q;
}

export const firebaseService = {
  userId: null,

  async create(collectionName, data) {
    if (!this.userId) throw new Error("userId not set on firebaseService");
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      userId: this.userId,
      completed: false, // default for dashboard items
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...data, userId: this.userId, completed: false };
  },

  async getAll(collectionName, orderByField = null, direction = "asc") {
    if (!this.userId) throw new Error("userId not set on firebaseService");
    const q = buildQuery(
      collectionName,
      this.userId,
      [{ field: "completed", operator: "==", value: false }], // only active
      orderByField,
      direction
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getById(collectionName, id) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async update(collectionName, id, data) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
    return { id, ...data };
  },

  async delete(collectionName, id) {
    await deleteDoc(doc(db, collectionName, id));
    return id;
  },

  async query(
    collectionName,
    conditions = [],
    orderByField = null,
    direction = "asc"
  ) {
    if (!this.userId) throw new Error("userId not set on firebaseService");
    const q = buildQuery(
      collectionName,
      this.userId,
      conditions,
      orderByField,
      direction
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // ✅ NEW: Real-time listener for active items
  listen(collectionName, callback, orderByField = null, direction = "asc") {
    if (!this.userId) throw new Error("userId not set on firebaseService");

    const q = buildQuery(
      collectionName,
      this.userId,
      [{ field: "completed", operator: "==", value: false }],
      orderByField,
      direction
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  },

  async globalSearch(term) {
    // ... keep your existing global search logic
  },

  setUserId(userId) {
    this.userId = userId;
  },

  async saveUserProfile({ uid, name, email }) {
    await addDoc(collection(db, "users"), {
      uid,
      name,
      email,
      createdAt: new Date(),
    });
  },
};
