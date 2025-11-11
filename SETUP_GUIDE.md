# Softiel Client Hub - Kurulum Rehberi

## ✅ Tamamlanan İşler
- ✅ Flutter projesi oluşturuldu
- ✅ Tüm bağımlılıklar eklendi
- ✅ Klasör yapısı hazır
- ✅ Core dosyalar oluşturuldu
- ✅ Model sınıfları hazır
- ✅ Firebase servisleri hazır

## 🔧 Şimdi Yapmanız Gerekenler

### 1. Firebase Projesi Oluşturma ve Yapılandırma

#### Adım 1: Firebase Console'da Proje Oluştur
1. https://console.firebase.google.com adresine git
2. "Add project" ile yeni proje oluştur
3. Proje adı: `softiel-client-hub` (veya istediğin isim)
4. Google Analytics'i isteğe bağlı olarak ekle

#### Adım 2: Firebase CLI Kurulumu
```bash
# Firebase CLI'yi kur (eğer yoksa)
npm install -g firebase-tools

# Firebase'e giriş yap
firebase login
```

#### Adım 3: FlutterFire CLI ile Yapılandırma
```bash
# FlutterFire CLI'yi kur
dart pub global activate flutterfire_cli

# Firebase projesini yapılandır
flutterfire configure
```

Bu komut:
- Firebase projenizi seçmenizi isteyecek
- `lib/firebase_options.dart` dosyasını oluşturacak
- Android ve iOS için gerekli dosyaları ekleyecek

#### Adım 4: Firebase Servislerini Etkinleştir
Firebase Console'da şu servisleri etkinleştir:
- ✅ Authentication (Email/Password + Email Link)
- ✅ Firestore Database
- ✅ Storage
- ✅ Cloud Messaging (FCM)

### 2. Translation Dosyalarını Oluştur

`assets/translations/` klasörüne şu dosyaları ekle:

**en.json:**
```json
{
  "app_name": "Softiel Client Hub",
  "login": "Login",
  "email": "Email",
  "password": "Password",
  "dashboard": "Dashboard",
  "projects": "Projects"
}
```

**tr.json:**
```json
{
  "app_name": "Softiel Client Hub",
  "login": "Giriş",
  "email": "E-posta",
  "password": "Şifre",
  "dashboard": "Kontrol Paneli",
  "projects": "Projeler"
}
```

### 3. Firestore Security Rules'ı Ayarla

Firebase Console > Firestore Database > Rules bölümüne şu kuralları ekle:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      allow read, write: if request.auth != null && request.auth.uid == clientId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null && resource.data.clientId == request.auth.uid;
      match /{subcollection=**}/{docId} {
        allow read, write: if request.auth != null;
      }
    }
    match /notifications/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
  }
}
```

### 4. Firebase Storage Rules'ı Ayarla

Firebase Console > Storage > Rules bölümüne şu kuralları ekle:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projectFiles/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Projeyi Test Et

```bash
# Bağımlılıkları kontrol et
flutter pub get

# Web'de çalıştır (Firebase yapılandırmasından sonra)
flutter run -d chrome
```

## 📝 Sonraki Adımlar (Benim Yapacağım)

Firebase yapılandırması tamamlandıktan sonra:
1. Authentication feature'ını implement edeceğim
2. Dashboard sayfasını oluşturacağım
3. Projects feature'ını tamamlayacağım
4. Diğer feature'ları sırayla ekleyeceğim

## ⚠️ Önemli Notlar

- Firebase yapılandırması olmadan proje çalışmayacak
- `firebase_options.dart` dosyası Firebase CLI ile otomatik oluşturulmalı
- Translation dosyalarını manuel oluşturman gerekiyor
- Firestore ve Storage rules'ları güvenlik için mutlaka ayarlanmalı

