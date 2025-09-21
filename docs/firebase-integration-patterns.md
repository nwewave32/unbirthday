# Firebase Integration Patterns

Comprehensive Firebase integration guidelines and patterns for the UnBirthday project using Firebase 12.2.1 with TypeScript.

## Table of Contents

- [Firebase Configuration](#firebase-configuration)
- [Service Architecture](#service-architecture)
- [Authentication Patterns](#authentication-patterns)
- [Firestore Database Patterns](#firestore-database-patterns)
- [File Storage Patterns](#file-storage-patterns)
- [Error Handling](#error-handling)
- [Type Safety](#type-safety)
- [Security Rules](#security-rules)
- [Performance Optimization](#performance-optimization)
- [Testing Strategies](#testing-strategies)

## Firebase Configuration

### Environment Configuration
Set up Firebase configuration with environment variables for security.

```typescript
// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Environment-based configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in production
export const analytics = import.meta.env.PROD ? getAnalytics(app) : null;

export default app;
```

### Environment Variables Template
```bash
# .env.example
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Service Architecture

### Service Organization
Structure Firebase services for maintainability and testability.

```typescript
// src/services/firebase/types.ts
export interface BaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseDocument {
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface Post extends BaseDocument {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: string[];
  likesCount: number;
}

// Generic service interface
export interface FirebaseService<T extends BaseDocument> {
  create(data: Omit<T, keyof BaseDocument>): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(options?: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<Omit<T, keyof BaseDocument>>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface QueryOptions {
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  where?: {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not-in';
    value: any;
  }[];
}
```

### Base Service Implementation
Create a reusable base service for common Firestore operations.

```typescript
// src/services/firebase/BaseFirebaseService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from 'src/firebase/config';
import type { BaseDocument, FirebaseService, QueryOptions } from './types';

export abstract class BaseFirebaseService<T extends BaseDocument>
  implements FirebaseService<T>
{
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async create(data: Omit<T, keyof BaseDocument>): Promise<T> {
    try {
      const now = new Date();
      const docData = {
        ...data,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      };

      const docRef = await addDoc(collection(db, this.collectionName), docData);
      const createdDoc = await this.getById(docRef.id);

      if (!createdDoc) {
        throw new Error('Failed to retrieve created document');
      }

      return createdDoc;
    } catch (error) {
      this.handleError('create', error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.convertDocumentData(docSnap.id, docSnap.data());
    } catch (error) {
      this.handleError('getById', error);
      throw error;
    }
  }

  async getAll(options: QueryOptions = {}): Promise<T[]> {
    try {
      const collectionRef = collection(db, this.collectionName);
      let queryRef = query(collectionRef);

      // Apply where clauses
      if (options.where) {
        for (const condition of options.where) {
          queryRef = query(
            queryRef,
            where(condition.field, condition.operator, condition.value)
          );
        }
      }

      // Apply ordering
      if (options.orderBy) {
        queryRef = query(
          queryRef,
          orderBy(options.orderBy, options.orderDirection || 'asc')
        );
      }

      // Apply limit
      if (options.limit) {
        queryRef = query(queryRef, limit(options.limit));
      }

      const querySnapshot = await getDocs(queryRef);
      return querySnapshot.docs.map(doc =>
        this.convertDocumentData(doc.id, doc.data())
      );
    } catch (error) {
      this.handleError('getAll', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<T, keyof BaseDocument>>): Promise<T> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await updateDoc(docRef, updateData);
      const updatedDoc = await this.getById(id);

      if (!updatedDoc) {
        throw new Error('Failed to retrieve updated document');
      }

      return updatedDoc;
    } catch (error) {
      this.handleError('update', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      this.handleError('delete', error);
      throw error;
    }
  }

  protected convertDocumentData(id: string, data: any): T {
    return {
      id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as T;
  }

  protected handleError(operation: string, error: unknown): void {
    const errorMessage = error instanceof FirestoreError
      ? `Firebase ${operation} error: ${error.code} - ${error.message}`
      : `${operation} error: ${error}`;

    console.error(errorMessage, error);

    // Log to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.analytics) {
      // Log error to analytics
    }
  }
}
```

### Specific Service Implementation
Implement specific services extending the base service.

```typescript
// src/services/firebase/UserService.ts
import { BaseFirebaseService } from './BaseFirebaseService';
import type { User } from './types';

class UserService extends BaseFirebaseService<User> {
  constructor() {
    super('users');
  }

  // User-specific methods
  async getByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAll({
        where: [{ field: 'email', operator: '==', value: email }],
        limit: 1,
      });

      return users.length > 0 ? users[0] : null;
    } catch (error) {
      this.handleError('getByEmail', error);
      throw error;
    }
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<User['preferences']>
  ): Promise<User> {
    try {
      const user = await this.getById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return await this.update(userId, {
        preferences: { ...user.preferences, ...preferences },
      });
    } catch (error) {
      this.handleError('updatePreferences', error);
      throw error;
    }
  }

  async getAdminUsers(): Promise<User[]> {
    return await this.getAll({
      where: [{ field: 'role', operator: '==', value: 'admin' }],
    });
  }
}

export const userService = new UserService();
```

## Authentication Patterns

### Authentication Service
Create a comprehensive authentication service.

```typescript
// src/services/firebase/AuthService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth } from 'src/firebase/config';
import { userService } from './UserService';
import type { User } from './types';

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  private authStateListeners: ((authState: AuthState) => void)[] = [];

  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        let user: User | null = null;

        if (firebaseUser) {
          // Try to get user data from Firestore
          user = await userService.getByEmail(firebaseUser.email!);

          // If user doesn't exist in Firestore, create it
          if (!user) {
            user = await userService.create({
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || 'Unknown',
              photoURL: firebaseUser.photoURL || undefined,
              role: 'user',
              preferences: {
                theme: 'light',
                notifications: true,
              },
            });
          }
        }

        this.notifyAuthStateListeners({
          user,
          firebaseUser,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        this.notifyAuthStateListeners({
          user: null,
          firebaseUser: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication error',
        });
      }
    });
  }

  async signUp({ email, password, displayName }: SignUpData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, { displayName });

      // Create user document in Firestore
      const user = await userService.create({
        email,
        displayName,
        photoURL: userCredential.user.photoURL || undefined,
        role: 'user',
        preferences: {
          theme: 'light',
          notifications: true,
        },
      });

      return user;
    } catch (error) {
      this.handleAuthError('signUp', error);
      throw error;
    }
  }

  async signIn({ email, password }: SignInData): Promise<User> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await userService.getByEmail(email);

      if (!user) {
        throw new Error('User data not found');
      }

      return user;
    } catch (error) {
      this.handleAuthError('signIn', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      this.handleAuthError('signOut', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      this.handleAuthError('resetPassword', error);
      throw error;
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  onAuthStateChange(callback: (authState: AuthState) => void): () => void {
    this.authStateListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthStateListeners(authState: AuthState): void {
    this.authStateListeners.forEach(listener => listener(authState));
  }

  private handleAuthError(operation: string, error: unknown): void {
    let errorMessage = `Authentication ${operation} error`;

    if (error instanceof Error) {
      const authError = error as AuthError;

      switch (authError.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email address is already in use';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = authError.message;
      }
    }

    console.error(`${operation} error:`, error);
    throw new Error(errorMessage);
  }
}

export const authService = new AuthService();
```

### Authentication Hook
Create a React hook for easy authentication state management.

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService, type AuthState } from 'src/services/firebase/AuthService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    signUp: authService.signUp.bind(authService),
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
  };
};
```

## Firestore Database Patterns

### Real-time Data Subscription
Implement real-time data subscriptions with proper cleanup.

```typescript
// src/services/firebase/RealtimeService.ts
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from 'src/firebase/config';
import type { BaseDocument, QueryOptions } from './types';

export class RealtimeService<T extends BaseDocument> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  subscribeToDocument(
    id: string,
    callback: (doc: T | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const docRef = doc(db, this.collectionName, id);

    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = this.convertDocumentData(docSnap.id, docSnap.data());
          callback(data);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Firestore subscription error for ${id}:`, error);
        onError?.(error);
      }
    );
  }

  subscribeToCollection(
    callback: (docs: T[]) => void,
    options: QueryOptions = {},
    onError?: (error: Error) => void
  ): Unsubscribe {
    let queryRef = query(collection(db, this.collectionName));

    // Apply query options
    if (options.where) {
      for (const condition of options.where) {
        queryRef = query(
          queryRef,
          where(condition.field, condition.operator, condition.value)
        );
      }
    }

    if (options.orderBy) {
      queryRef = query(
        queryRef,
        orderBy(options.orderBy, options.orderDirection || 'asc')
      );
    }

    if (options.limit) {
      queryRef = query(queryRef, limit(options.limit));
    }

    return onSnapshot(
      queryRef,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc =>
          this.convertDocumentData(doc.id, doc.data())
        );
        callback(docs);
      },
      (error) => {
        console.error('Firestore collection subscription error:', error);
        onError?.(error);
      }
    );
  }

  private convertDocumentData(id: string, data: any): T {
    return {
      id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as T;
  }
}

// Usage hook
export const useRealtimeDocument = <T extends BaseDocument>(
  collectionName: string,
  id: string | null
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    const service = new RealtimeService<T>(collectionName);

    const unsubscribe = service.subscribeToDocument(
      id,
      (doc) => {
        setData(doc);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, id]);

  return { data, loading, error };
};
```

### Batch Operations
Implement batch operations for better performance.

```typescript
// src/services/firebase/BatchService.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db } from 'src/firebase/config';
import type { BaseDocument } from './types';

export interface BatchOperation<T extends BaseDocument> {
  type: 'create' | 'update' | 'delete';
  collection: string;
  id?: string;
  data?: Partial<T>;
}

export class BatchService {
  private batch = writeBatch(db);
  private operations: BatchOperation<any>[] = [];

  add<T extends BaseDocument>(operation: BatchOperation<T>): this {
    this.operations.push(operation);

    const docRef = operation.id
      ? doc(db, operation.collection, operation.id)
      : doc(collection(db, operation.collection));

    switch (operation.type) {
      case 'create':
        if (!operation.data) {
          throw new Error('Data is required for create operation');
        }
        this.batch.set(docRef, {
          ...operation.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        break;

      case 'update':
        if (!operation.data || !operation.id) {
          throw new Error('Data and ID are required for update operation');
        }
        this.batch.update(docRef, {
          ...operation.data,
          updatedAt: new Date(),
        });
        break;

      case 'delete':
        if (!operation.id) {
          throw new Error('ID is required for delete operation');
        }
        this.batch.delete(docRef);
        break;
    }

    return this;
  }

  async commit(): Promise<void> {
    try {
      await this.batch.commit();
      console.log(`Batch operation completed: ${this.operations.length} operations`);
    } catch (error) {
      console.error('Batch operation failed:', error);
      throw error;
    }
  }

  getOperationCount(): number {
    return this.operations.length;
  }

  clear(): void {
    this.batch = writeBatch(db);
    this.operations = [];
  }
}

// Usage example
export const batchUpdateUsers = async (userUpdates: Array<{ id: string; data: Partial<User> }>) => {
  const batchService = new BatchService();

  userUpdates.forEach(({ id, data }) => {
    batchService.add({
      type: 'update',
      collection: 'users',
      id,
      data,
    });
  });

  await batchService.commit();
};
```

## File Storage Patterns

### Storage Service
Implement a comprehensive file storage service.

```typescript
// src/services/firebase/StorageService.ts
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  StorageError,
  UploadTask,
} from 'firebase/storage';
import { storage } from 'src/firebase/config';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface FileUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  metadata?: Record<string, string>;
}

export interface StorageFile {
  name: string;
  fullPath: string;
  downloadURL: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

class StorageService {
  async uploadFile(
    file: File,
    path: string,
    options: FileUploadOptions = {}
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: file.type,
        customMetadata: options.metadata,
      };

      if (options.onProgress) {
        return await this.uploadWithProgress(storageRef, file, metadata, options.onProgress);
      } else {
        const snapshot = await uploadBytes(storageRef, file, metadata);
        return await getDownloadURL(snapshot.ref);
      }
    } catch (error) {
      this.handleStorageError('uploadFile', error);
      throw error;
    }
  }

  private async uploadWithProgress(
    storageRef: any,
    file: File,
    metadata: any,
    onProgress: (progress: UploadProgress) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          };
          onProgress(progress);
        },
        (error) => {
          this.handleStorageError('uploadWithProgress', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      this.handleStorageError('deleteFile', error);
      throw error;
    }
  }

  async getFileInfo(path: string): Promise<StorageFile> {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        name: metadata.name,
        fullPath: metadata.fullPath,
        downloadURL,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };
    } catch (error) {
      this.handleStorageError('getFileInfo', error);
      throw error;
    }
  }

  async listFiles(path: string): Promise<StorageFile[]> {
    try {
      const storageRef = ref(storage, path);
      const listResult = await listAll(storageRef);

      const files = await Promise.all(
        listResult.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          const downloadURL = await getDownloadURL(itemRef);

          return {
            name: metadata.name,
            fullPath: metadata.fullPath,
            downloadURL,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
          };
        })
      );

      return files;
    } catch (error) {
      this.handleStorageError('listFiles', error);
      throw error;
    }
  }

  generateFilePath(userId: string, category: string, filename: string): string {
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

    return `users/${userId}/${category}/${timestamp}_${cleanFilename}`;
  }

  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}): boolean {
    const { maxSize = 5 * 1024 * 1024, allowedTypes } = options; // Default 5MB

    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    return true;
  }

  private handleStorageError(operation: string, error: unknown): void {
    const errorMessage = error instanceof StorageError
      ? `Storage ${operation} error: ${error.code} - ${error.message}`
      : `${operation} error: ${error}`;

    console.error(errorMessage, error);
  }
}

export const storageService = new StorageService();
```

## Error Handling

### Centralized Error Handling
Implement consistent error handling across Firebase services.

```typescript
// src/services/firebase/ErrorHandler.ts
import { FirestoreError } from 'firebase/firestore';
import { AuthError } from 'firebase/auth';
import { StorageError } from 'firebase/storage';

export interface AppError {
  code: string;
  message: string;
  operation: string;
  timestamp: Date;
  userId?: string;
}

export class FirebaseErrorHandler {
  static handleFirestoreError(operation: string, error: FirestoreError): AppError {
    let message = 'An unexpected error occurred';

    switch (error.code) {
      case 'permission-denied':
        message = 'You do not have permission to perform this action';
        break;
      case 'not-found':
        message = 'The requested document was not found';
        break;
      case 'already-exists':
        message = 'A document with this ID already exists';
        break;
      case 'resource-exhausted':
        message = 'Service is temporarily unavailable. Please try again later';
        break;
      case 'invalid-argument':
        message = 'Invalid data provided';
        break;
      case 'deadline-exceeded':
        message = 'Request timed out. Please try again';
        break;
      case 'unavailable':
        message = 'Service is temporarily unavailable';
        break;
      default:
        message = error.message;
    }

    return {
      code: error.code,
      message,
      operation,
      timestamp: new Date(),
    };
  }

  static handleAuthError(operation: string, error: AuthError): AppError {
    let message = 'Authentication error occurred';

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists';
        break;
      case 'auth/weak-password':
        message = 'Password must be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message;
    }

    return {
      code: error.code,
      message,
      operation,
      timestamp: new Date(),
    };
  }

  static handleStorageError(operation: string, error: StorageError): AppError {
    let message = 'File operation failed';

    switch (error.code) {
      case 'storage/object-not-found':
        message = 'File not found';
        break;
      case 'storage/unauthorized':
        message = 'You do not have permission to access this file';
        break;
      case 'storage/quota-exceeded':
        message = 'Storage quota exceeded';
        break;
      case 'storage/invalid-format':
        message = 'Invalid file format';
        break;
      case 'storage/invalid-event-name':
        message = 'Invalid upload operation';
        break;
      default:
        message = error.message;
    }

    return {
      code: error.code,
      message,
      operation,
      timestamp: new Date(),
    };
  }

  static logError(error: AppError, userId?: string): void {
    const errorLog = {
      ...error,
      userId,
    };

    console.error('Firebase Error:', errorLog);

    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.analytics) {
      // Log to analytics
    }
  }
}
```

## Type Safety

### Typed Firebase Operations
Ensure type safety across all Firebase operations.

```typescript
// src/types/firebase.ts
import type { Timestamp } from 'firebase/firestore';

// Base Firestore document type
export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Converter for Firestore documents
export interface FirestoreConverter<T> {
  toFirestore(modelObject: T): any;
  fromFirestore(snapshot: any): T;
}

// Create a typed converter
export function createFirestoreConverter<T extends FirestoreDocument>(): FirestoreConverter<T> {
  return {
    toFirestore(modelObject: T): any {
      const { id, ...data } = modelObject;
      return data;
    },
    fromFirestore(snapshot: any): T {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as T;
    },
  };
}

// Usage with typed collections
import { collection, CollectionReference } from 'firebase/firestore';

export function getTypedCollection<T extends FirestoreDocument>(
  collectionName: string
): CollectionReference<T> {
  return collection(db, collectionName).withConverter(
    createFirestoreConverter<T>()
  ) as CollectionReference<T>;
}
```

## Security Rules

### Firestore Security Rules
Example security rules for common patterns.

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Posts are publicly readable but only editable by the author
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null &&
        (request.auth.uid == resource.data.authorId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Comments on posts
    match /posts/{postId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.authorId;
      allow update, delete: if request.auth != null &&
        (request.auth.uid == resource.data.authorId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Performance Optimization

### Optimization Strategies
Implement performance best practices.

```typescript
// src/services/firebase/OptimizationService.ts
import { startAfter, endBefore, limitToFirst, limitToLast } from 'firebase/firestore';

export class FirebaseOptimizationService {
  // Implement pagination
  static async getPaginatedData<T>(
    service: BaseFirebaseService<T>,
    pageSize: number = 20,
    lastDocument?: any
  ) {
    const options: QueryOptions = {
      limit: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    };

    if (lastDocument) {
      // Add pagination cursor
      // This would need to be implemented in the base service
    }

    return await service.getAll(options);
  }

  // Implement data caching
  static createCachedService<T extends BaseDocument>(
    service: BaseFirebaseService<T>,
    cacheTimeout: number = 5 * 60 * 1000 // 5 minutes
  ) {
    const cache = new Map<string, { data: T; timestamp: number }>();

    return {
      async getById(id: string): Promise<T | null> {
        const cached = cache.get(id);
        const now = Date.now();

        if (cached && (now - cached.timestamp) < cacheTimeout) {
          return cached.data;
        }

        const data = await service.getById(id);
        if (data) {
          cache.set(id, { data, timestamp: now });
        }

        return data;
      },

      invalidateCache(id: string): void {
        cache.delete(id);
      },

      clearCache(): void {
        cache.clear();
      }
    };
  }

  // Optimize queries with indexes
  static getOptimizedQueryOptions(filters: Record<string, any>): QueryOptions {
    const where = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([field, value]) => ({
        field,
        operator: '==' as const,
        value,
      }));

    return {
      where,
      orderBy: 'updatedAt',
      orderDirection: 'desc',
    };
  }
}
```

## Testing Strategies

### Firebase Testing Setup
Set up comprehensive testing for Firebase services.

```typescript
// src/__tests__/firebase-setup.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Test configuration
const testConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'test-app-id',
};

const app = initializeApp(testConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators
if (!auth.emulatorConfig) {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

if (!db._settings?.host?.includes('localhost')) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

if (!storage._location) {
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { auth, db, storage };
```

```typescript
// src/services/firebase/__tests__/UserService.test.ts
import { userService } from '../UserService';
import { db } from 'src/__tests__/firebase-setup';
import { clearFirestoreData } from '@firebase/rules-unit-testing';

describe('UserService', () => {
  beforeEach(async () => {
    await clearFirestoreData({ projectId: 'test-project' });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user' as const,
        preferences: {
          theme: 'light' as const,
          notifications: true,
        },
      };

      const user = await userService.create(userData);

      expect(user).toMatchObject(userData);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getByEmail', () => {
    it('should find user by email', async () => {
      const userData = {
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user' as const,
        preferences: {
          theme: 'light' as const,
          notifications: true,
        },
      };

      await userService.create(userData);
      const user = await userService.getByEmail('test@example.com');

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await userService.getByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });
});
```

---

## Related Files
- [Main Style Guide](../STYLE_GUIDE.md)
- [TypeScript Standards](./typescript-standards.md)
- [React Component Guidelines](./react-guidelines.md)
- [Firebase Configuration](../src/firebase/config.ts)

## Best Practices Summary

1. **Always use TypeScript** for type safety
2. **Implement proper error handling** with user-friendly messages
3. **Use environment variables** for configuration
4. **Structure services** for maintainability and testability
5. **Implement real-time subscriptions** with proper cleanup
6. **Use batch operations** for better performance
7. **Validate user input** before Firebase operations
8. **Implement caching** for frequently accessed data
9. **Write comprehensive tests** with Firebase emulators
10. **Follow security best practices** with proper rules

Follow these Firebase integration patterns to build a robust, scalable, and maintainable application with Firebase services.