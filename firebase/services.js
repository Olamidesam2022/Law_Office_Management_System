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

// Generic CRUD operations
export const firebaseService = {
  // Create a new document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        userId: data.userId, // Ensure userId is stored
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...data, userId: data.userId };
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  },

  // Get all documents from a collection
  async getAll(collectionName) {
    try {
      // Require userId to be set on firebaseService before calling getAll
      if (!this.userId) throw new Error("userId not set on firebaseService");
      const q = query(
        collection(db, collectionName),
        where("userId", "==", this.userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  },

  // Get a single document by ID
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  },

  // Update a document
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
      return { id, ...data };
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName, id) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return id;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Query documents with conditions
  async query(collectionName, conditions = [], orderByField = null) {
    try {
      // Always filter by userId
      if (!this.userId) throw new Error("userId not set on firebaseService");
      let q = query(
        collection(db, collectionName),
        where("userId", "==", this.userId)
      );

      // Apply additional where conditions
      conditions.forEach((condition) => {
        q = query(
          q,
          where(condition.field, condition.operator, condition.value)
        );
      });

      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error querying documents:", error);
      throw error;
    }
  },
  // Set the current userId for filtering
  setUserId(userId) {
    this.userId = userId;
  },
};
