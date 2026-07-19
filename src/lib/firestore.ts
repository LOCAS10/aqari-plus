import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Property, Client, Request } from "./types";

// ============================================
// 🏠 عمليات العقارات (Properties)
// ============================================

export const propertiesCollection = collection(db, "properties");

// جلب كل العقارات
export async function getAllProperties(): Promise<Property[]> {
  const snapshot = await getDocs(query(propertiesCollection, orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Property[];
}

// إضافة عقار
export async function addProperty(property: Omit<Property, "id">): Promise<string> {
  const docRef = await addDoc(propertiesCollection, {
    ...property,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// تحديث عقار
export async function updateProperty(id: string, property: Partial<Property>): Promise<void> {
  await updateDoc(doc(db, "properties", id), {
    ...property,
    updatedAt: Timestamp.now(),
  });
}

// حذف عقار
export async function deleteProperty(id: string): Promise<void> {
  await deleteDoc(doc(db, "properties", id));
}

// ============================================
// 👤 عمليات العملاء (Clients)
// ============================================

export const clientsCollection = collection(db, "clients");

export async function getAllClients(): Promise<Client[]> {
  const snapshot = await getDocs(query(clientsCollection, orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Client[];
}

export async function addClient(client: Omit<Client, "id">): Promise<string> {
  const docRef = await addDoc(clientsCollection, {
    ...client,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateClient(id: string, client: Partial<Client>): Promise<void> {
  await updateDoc(doc(db, "clients", id), client);
}

export async function deleteClient(id: string): Promise<void> {
  await deleteDoc(doc(db, "clients", id));
}

// ============================================
// 📋 عمليات الطلبات (Requests)
// ============================================

export const requestsCollection = collection(db, "requests");

export async function getAllRequests(): Promise<Request[]> {
  const snapshot = await getDocs(query(requestsCollection, orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Request[];
}

export async function addRequest(request: Omit<Request, "id">): Promise<string> {
  const docRef = await addDoc(requestsCollection, {
    ...request,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateRequest(id: string, request: Partial<Request>): Promise<void> {
  await updateDoc(doc(db, "requests", id), request);
}

export async function deleteRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, "requests", id));
}
