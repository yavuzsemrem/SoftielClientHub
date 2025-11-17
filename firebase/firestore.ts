import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

// Generic CRUD helpers
export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${docId}:`, error);
    return null;
  }
};

export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    return [];
  }
};

export const createDocument = async <T>(
  collectionName: string,
  data: Omit<T, 'id'>,
  docId?: string
): Promise<string | null> => {
  try {
    const docRef = docId ? doc(db, collectionName, docId) : doc(collection(db, collectionName));
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return null;
  }
};

export const updateDocument = async <T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating document ${docId}:`, error);
    return false;
  }
};

export const deleteDocument = async (collectionName: string, docId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId}:`, error);
    return false;
  }
};

// Real-time subscription
export const subscribeToCollection = <T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): (() => void) => {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    callback(data);
  });
};

// Project-specific helpers
// NOT: Mevcut 'projects' koleksiyonunu kullanıyoruz
// Client Hub projeleri için 'clientId' field'ı ile filtreleme yapıyoruz
// 'clientId' field'ı users koleksiyonundaki 'uid' değeri ile eşleşmeli
// Mevcut admin paneli projeleri 'clientId' field'ı olmadan saklanabilir
export const getProjectsByClientId = async (uid: string) => {
  // Önce clientId ile filtreleme yap
  const projects = await getDocuments('projects', [
    where('clientId', '==', uid)
  ]);
  
  // Eğer hiç proje yoksa, tüm projeleri çek ve client field'ı ile eşleştir (opsiyonel)
  // Şimdilik sadece clientId olan projeleri döndürüyoruz
  // Mevcut portfolio projelerini Client Hub formatına dönüştürmek için adapter kullanılabilir
  
  // lastUpdate field'ına göre sırala (yoksa createdAt veya updatedAt kullan)
  return projects.sort((a, b) => {
    const aDate = a.lastUpdate || a.updatedAt || a.createdAt || '';
    const bDate = b.lastUpdate || b.updatedAt || b.createdAt || '';
    return bDate.localeCompare(aDate); // Descending order
  });
};

export const subscribeToProjects = (uid: string, callback: (projects: any[]) => void) => {
  return subscribeToCollection(
    'projects', 
    [
      where('clientId', '==', uid), 
      orderBy('lastUpdate', 'desc')
    ], 
    callback
  );
};

export const subscribeToMessages = (projectId: string, callback: (messages: any[]) => void) => {
  return subscribeToCollection('messages', [where('projectId', '==', projectId), orderBy('createdAt', 'desc'), limit(50)], callback);
};

