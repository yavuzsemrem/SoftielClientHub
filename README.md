# Softiel Client Hub

Softiel müşterilerinin devam eden projelerini takip edebileceği universal mobil + web uygulaması.

## 🚀 Özellikler

- ✅ Proje ilerleme takibi
- 📋 Aşamalar (phases) ve görevler (tasks)
- 📢 Güncellemeler (updates)
- 📁 Dosya paylaşımı
- ✅ Onay/revizyon süreçleri
- 💬 Gerçek zamanlı mesajlaşma
- 📊 Analiz & timeline
- 🔔 Bildirimler
- 📦 Final teslim paketi

## 🛠️ Teknoloji Stack

- **Expo** (React Native) - Universal app framework
- **TypeScript** - Type safety
- **Nativewind** - Tailwind CSS for React Native
- **Firebase** - Backend (Auth, Firestore, Storage)
- **Zustand** - UI state management
- **React Query** - Server state management
- **Expo Router** - File-based routing

## 📋 Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Firebase Konfigürasyonu

**ÖNEMLİ**: Bu proje mevcut Softiel website Firebase database'inizi kullanır. Yeni bir Firebase projesi oluşturmanıza gerek yok!

1. Mevcut Firebase Console'unuza gidin: https://console.firebase.google.com/
2. Authentication'ın etkin olduğundan emin olun (Email/Password)
3. Firestore Database'in aktif olduğundan emin olun
4. Storage'ın aktif olduğundan emin olun
5. `.env.example` dosyasını `.env` olarak kopyalayın
6. Mevcut Firebase projenizin config değerlerini `.env` dosyasına ekleyin

```bash
cp .env.example .env
```

**Detaylı bilgi için**: `FIREBASE_INTEGRATION.md` dosyasını okuyun.

### 3. Firebase Security Rules

**ÖNEMLİ**: Mevcut security rules'larınız korunur, sadece yeni Client Hub rules'ları eklenir.

1. Firebase Console → Firestore Database → Rules
2. `firebase/security.rules.clienthub` dosyasının içeriğini kopyalayın
3. Mevcut rules'larınızın üzerine yapıştırın (mevcut rules korunur, sadece yeni rules eklenir)

**Detaylı bilgi için**: `FIREBASE_INTEGRATION.md` dosyasını okuyun.

### 4. İlk Kullanıcı ve Proje Oluşturma

**ÖNEMLİ**: İlk kullanım için Firebase Console'dan manuel olarak veri oluşturmanız gerekiyor.

**NOT**: Bu uygulama **Firebase Auth kullanmıyor**, custom authentication kullanıyor. Mevcut `users` koleksiyonunu kullanıyoruz.

#### a) İlk Client Kullanıcısını Oluşturun

Firebase Console → Firestore → `users` koleksiyonuna yeni doküman ekleyin:
- **Doküman ID**: Unique bir ID (örneğin: `client-user-1`)
- **Fields**:
  ```json
  {
    "uid": "client-user-1", // Doküman ID ile aynı olabilir
    "email": "client@example.com",
    "name": "Client User",
    "displayName": "Client User",
    "role": "client", // ÖNEMLİ: 'client' olmalı
    "password": "client123", // Production'da hash kullanılmalı
    "isActive": true, // ÖNEMLİ: true olmalı
    "loginAttempts": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "bio": "",
    "lastLoginAt": null
  }
  ```

**ÖNEMLİ**: 
- `role` field'ı `'client'` olmalı (sadece client kullanıcılar giriş yapabilir)
- `isActive` field'ı `true` olmalı
- `uid` field'ı unique olmalı

#### b) İlk Projeyi Oluşturun

Firebase Console → Firestore → `projects` koleksiyonuna yeni doküman ekleyin:
- **ÖNEMLİ**: `clientId` field'ı zorunludur! Bu field olmadan proje Client Hub'da görünmez.
- **Fields**:
  ```json
  {
    "clientId": "client-user-1", // users koleksiyonundaki uid ile eşleşmeli
    "name": "Proje Adı",
    "status": "active",
    "progress": 0,
    "dueDate": "2024-12-31T00:00:00Z",
    "lastUpdate": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

**Detaylı bilgi için**: `FIREBASE_INTEGRATION.md` dosyasını okuyun.

### 5. Uygulamayı Çalıştır

```bash
# Development server
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Proje Yapısı

```
app/
  ├─ _layout.tsx          # Root layout
  ├─ index.tsx            # Entry point
  ├─ login/               # Login screen
  ├─ dashboard/           # Dashboard
  └─ projects/            # Projects
      ├─ index.tsx        # Project list
      └─ [id]/            # Project detail
          ├─ index.tsx    # Overview
          ├─ phases.tsx
          ├─ tasks.tsx
          ├─ updates.tsx
          ├─ chat.tsx
          ├─ files.tsx
          ├─ approvals.tsx
          ├─ analytics.tsx
          └─ deliverables.tsx

components/               # Reusable components
firebase/                 # Firebase config & helpers
hooks/                    # Custom hooks
stores/                   # Zustand stores
lib/                      # Utilities
types/                    # TypeScript types
styles/                   # Global styles
```

## 🎨 Tasarım

- **Primary Color**: #0056b8
- **Secondary Color**: #ff9700
- **Background**: #f8f9fb
- **Surface**: #ffffff
- **Text**: #1f1f1f

## 📱 Build

### Web Build

```bash
npm run build:web
```

### Mobile Build

```bash
npx expo prebuild
# iOS için Xcode'da build alın
# Android için Android Studio'da build alın
```

## ⚠️ Önemli Notlar

- Softiel Client Hub yalnızca proje takibi içindir
- Tüm ödemeler ve sözleşmeler Upwork üzerinden yapılır

## 📄 Lisans

Private - Softiel

