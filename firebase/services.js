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
} from "firebase/firestore";
import { db } from "./config.js";

export const firebaseService = {
  userId: null, // keep track of current user

  // Create a new document
  async create(collectionName, data) {
    if (!this.userId) throw new Error("userId not set on firebaseService");

    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      userId: this.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...data, userId: this.userId };
  },

  // Get all documents (with optional ordering)
  async getAll(collectionName, orderByField = null, direction = "asc") {
    if (!this.userId) throw new Error("userId not set on firebaseService");

    let q = query(
      collection(db, collectionName),
      where("userId", "==", this.userId)
    );

    if (orderByField) {
      q = query(
        collection(db, collectionName),
        where("userId", "==", this.userId),
        orderBy(orderByField, direction)
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get a single document
  async getById(collectionName, id) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Update
  async update(collectionName, id, data) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
    return { id, ...data };
  },

  // Delete
  async delete(collectionName, id) {
    await deleteDoc(doc(db, collectionName, id));
    return id;
  },

  // Query with conditions
  async query(
    collectionName,
    conditions = [],
    orderByField = null,
    direction = "asc"
  ) {
    if (!this.userId) throw new Error("userId not set on firebaseService");

    let q = query(
      collection(db, collectionName),
      where("userId", "==", this.userId)
    );

    conditions.forEach((c) => {
      q = query(q, where(c.field, c.operator, c.value));
    });

    if (orderByField) {
      q = query(q, orderBy(orderByField, direction));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // 🔎 Global Search across collections (dynamic fields)
  async globalSearch(term) {
    if (!this.userId) throw new Error("userId not set on firebaseService");
    if (!term || term.trim() === "") return [];

    const lowerTerm = term.toLowerCase();
    let results = [];

    // Helper: check all fields in a document
    const matches = (doc) =>
      Object.values(doc).join(" ").toLowerCase().includes(lowerTerm);

    // Helper: result formatter
    const makeResult = (type, label, onNavigate) => ({
      type,
      label,
      onNavigate,
    });

    // 1. Cases
    try {
      const cases = await this.getAll("cases");
      results.push(
        ...cases
          .filter((c) => matches(c))
          .map((c) =>
            makeResult(
              "Case",
              `${c.caseNumber || "Case"} - ${c.clientName || "Unknown"}`,
              () => (window.location.href = `/cases/${c.id}`)
            )
          )
      );
    } catch (err) {
      console.error("Error searching cases:", err);
    }

    // 2. Invoices
    try {
      const invoices = await this.getAll("invoices");
      results.push(
        ...invoices
          .filter((i) => matches(i))
          .map((i) =>
            makeResult(
              "Invoice",
              `${i.invoiceNumber || "Invoice"} - ${i.clientName || "Unknown"}`,
              () => (window.location.href = `/billing`)
            )
          )
      );
    } catch (err) {
      console.error("Error searching invoices:", err);
    }

    // 3. Appointments
    try {
      const appointments = await this.getAll("appointments");
      results.push(
        ...appointments
          .filter((a) => matches(a))
          .map((a) =>
            makeResult(
              "Appointment",
              `${a.title || "Appointment"} - ${a.clientName || ""} (${
                a.date || ""
              })`,
              () => (window.location.href = `/calendar`)
            )
          )
      );
    } catch (err) {
      console.error("Error searching appointments:", err);
    }

    return results;
  },

  // Set current user
  setUserId(userId) {
    this.userId = userId;
  },
};
