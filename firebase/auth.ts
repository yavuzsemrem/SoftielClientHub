import { query, where, getDocs } from 'firebase/firestore';
import { collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { User, ClientUser } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@softiel_client_user';

// Password hash kontrolü için basit karşılaştırma
// NOT: Production'da bcrypt gibi güvenli hash kullanılmalı
const comparePassword = (inputPassword: string, storedPassword: string): boolean => {
  return inputPassword === storedPassword;
};

export const login = async (email: string, password: string) => {
  try {
    // Users koleksiyonundan email ile kullanıcı bul
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { user: null, error: 'Email veya şifre hatalı' };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = { id: userDoc.id, ...userDoc.data() } as User;

    // Role kontrolü - admin veya client olabilir
    if (userData.role !== 'client' && userData.role !== 'admin') {
      return { user: null, error: 'Geçersiz kullanıcı rolü' };
    }

    // Aktif kullanıcı kontrolü
    if (!userData.isActive) {
      return { user: null, error: 'Hesabınız deaktif edilmiş' };
    }

    // Şifre kontrolü
    if (!comparePassword(password, userData.password)) {
      // Login attempts güncelle
      await updateDoc(doc(db, 'users', userDoc.id), {
        loginAttempts: (userData.loginAttempts || 0) + 1,
        updatedAt: Timestamp.now(),
      });
      return { user: null, error: 'Email veya şifre hatalı' };
    }

    // Başarılı giriş - lastLoginAt ve loginAttempts güncelle
    await updateDoc(doc(db, 'users', userDoc.id), {
      lastLoginAt: Timestamp.now(),
      loginAttempts: 0,
      updatedAt: Timestamp.now(),
    });

    // Password'u çıkar ve user'ı kaydet
    const { password: _, ...userWithoutPassword } = userData;
    const clientUser: ClientUser = userWithoutPassword as ClientUser;

    // AsyncStorage'a kaydet
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(clientUser));

    return { user: clientUser, error: null };
  } catch (error: any) {
    console.error('Login error:', error);
    return { user: null, error: error.message || 'Giriş yapılırken bir hata oluştu' };
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = async (): Promise<ClientUser | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      const user = JSON.parse(userJson) as ClientUser;
      // Kullanıcının hala aktif olduğunu kontrol et
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        
        if (userData.isActive && (userData.role === 'client' || userData.role === 'admin')) {
          const { password: _, ...userWithoutPassword } = userData;
          return userWithoutPassword as ClientUser;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const resetPassword = async (email: string) => {
  // Şifre sıfırlama için admin panelinden yapılması gerekiyor
  // Bu fonksiyon sadece bilgilendirme için
  return { error: 'Şifre sıfırlama için lütfen admin ile iletişime geçin' };
};
