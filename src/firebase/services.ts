import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';

// Types
export interface BirthdayPage {
  id?: string;
  uuid: string;
  title: string;
  description?: string;
  theme: string;
  backgroundImage?: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  creatorToken: string;
  uploadLimit: number; // MB
  currentUploadSize: number; // MB
}

export interface Message {
  id?: string;
  pageId: string;
  authorName: string;
  content: string;
  createdAt: Timestamp;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaFileName?: string;
}

// Birthday Page Services
export const createBirthdayPage = async (pageData: Omit<BirthdayPage, 'id' | 'createdAt' | 'currentUploadSize'>) => {
  const docRef = await addDoc(collection(db, 'birthdayPages'), {
    ...pageData,
    createdAt: Timestamp.now(),
    currentUploadSize: 0,
  });
  return docRef.id;
};

export const getBirthdayPage = async (uuid: string) => {
  const q = query(collection(db, 'birthdayPages'), where('uuid', '==', uuid));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BirthdayPage;
};

export const updateBirthdayPage = async (id: string, updates: Partial<BirthdayPage>) => {
  const docRef = doc(db, 'birthdayPages', id);
  await updateDoc(docRef, updates);
};

export const deleteBirthdayPage = async (id: string) => {
  const docRef = doc(db, 'birthdayPages', id);
  await deleteDoc(docRef);
};

// Message Services
export const addMessage = async (messageData: Omit<Message, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...messageData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getMessages = async (pageId: string) => {
  const q = query(
    collection(db, 'messages'),
    where('pageId', '==', pageId),
    orderBy('createdAt', 'asc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Message[];
};

export const deleteMessage = async (id: string) => {
  const docRef = doc(db, 'messages', id);
  await deleteDoc(docRef);
};

// Storage Services
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Utility function to check if page is expired
export const isPageExpired = (expiresAt: Timestamp) => {
  return Timestamp.now().toMillis() > expiresAt.toMillis();
};