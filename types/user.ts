export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  displayName?: string;
  bio?: string;
  role: 'admin' | 'client';
  password: string; // Sadece server-side kullanılacak, client'a gönderilmeyecek
  isActive: boolean;
  loginAttempts: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  company?: string;
  photoUrl?: string;
}

// Client tarafında kullanılacak user tipi (password olmadan)
export interface ClientUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  displayName?: string;
  bio?: string;
  role: 'admin' | 'client';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  company?: string;
  photoUrl?: string;
}

