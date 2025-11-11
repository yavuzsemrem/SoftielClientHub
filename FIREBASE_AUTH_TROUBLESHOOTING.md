# Firebase Authentication 400 Bad Request Hatası - Çözüm Rehberi

## 🔴 Hata: `accounts:signInWithPassword` 400 Bad Request

Bu hata genellikle Firebase Console yapılandırmasından kaynaklanır.

## ✅ Kontrol Listesi

### 1. Firebase Console - Authentication Ayarları

1. **Firebase Console'a gidin**: https://console.firebase.google.com
2. **Projenizi seçin**: `softielwebsite`
3. **Authentication** > **Sign-in method** sayfasına gidin
4. **Email/Password** provider'ını kontrol edin:
   - ✅ **Enabled** olmalı
   - ✅ **Email link (passwordless sign-in)** isteğe bağlı
   - ✅ **Save** butonuna tıklayın

### 2. Firebase Console - API Restrictions

1. **Google Cloud Console**'a gidin: https://console.cloud.google.com
2. **APIs & Services** > **Credentials** sayfasına gidin
3. **API Key**'inizi bulun (firebase_options.dart'taki `apiKey`)
4. **API restrictions** kontrol edin:
   - ✅ **Don't restrict key** seçili olmalı (test için)
   - VEYA
   - ✅ **Restrict key** seçiliyse, şunlar eklenmeli:
     - Identity Toolkit API
     - Firebase Authentication API

### 3. Firebase Console - Authorized Domains

1. **Firebase Console** > **Authentication** > **Settings**
2. **Authorized domains** bölümüne gidin
3. Şu domain'lerin ekli olduğundan emin olun:
   - `localhost` (development için)
   - `softielwebsite.firebaseapp.com`
   - Production domain'iniz (örn: `client.softiel.com`)

### 4. Firebase Options Kontrolü

`lib/firebase_options.dart` dosyasındaki değerlerin doğru olduğundan emin olun:

```dart
static const FirebaseOptions web = FirebaseOptions(
  apiKey: 'AIzaSyDT23p3KDd3pQf13UiQOuIjmemyBlMYPBg', // ✅ Doğru mu?
  appId: '1:876968672828:web:37fa076850a25b10044d39', // ✅ Doğru mu?
  projectId: 'softielwebsite', // ✅ Doğru mu?
  authDomain: 'softielwebsite.firebaseapp.com', // ✅ Doğru mu?
  // ...
);
```

### 5. Browser Console Kontrolü

1. **Chrome DevTools** açın (F12)
2. **Console** sekmesine gidin
3. Login denemesi yapın
4. Tam hata mesajını kopyalayın

Örnek hata mesajları:
- `FirebaseError: Firebase: Error (auth/invalid-api-key)`
- `FirebaseError: Firebase: Error (auth/operation-not-allowed)`
- `FirebaseError: Firebase: Error (auth/unauthorized-domain)`

## 🔧 Adım Adım Çözüm

### Adım 1: Email/Password Provider'ı Etkinleştir

```bash
# Firebase Console'da:
1. Authentication > Sign-in method
2. Email/Password satırına tıkla
3. Enable toggle'ını aç
4. Save
```

### Adım 2: API Key Restrictions Kontrolü

```bash
# Google Cloud Console'da:
1. APIs & Services > Credentials
2. API Key'inizi bulun
3. Edit'e tıklayın
4. API restrictions:
   - "Don't restrict key" seçin (test için)
   - VEYA "Restrict key" + Identity Toolkit API ekleyin
5. Save
```

### Adım 3: Authorized Domains Ekle

```bash
# Firebase Console'da:
1. Authentication > Settings > Authorized domains
2. "Add domain" butonuna tıklayın
3. Domain'inizi ekleyin (örn: localhost, client.softiel.com)
4. Save
```

### Adım 4: Firebase Options'ı Yeniden Oluştur

```bash
# Terminal'de:
flutterfire configure
```

## 🧪 Test Etme

### 1. Console'da Test

```dart
// main.dart'a geçici olarak ekleyin:
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    print('✅ Firebase initialized successfully');
    
    // Test login
    final auth = FirebaseAuth.instance;
    print('✅ Firebase Auth instance created');
  } catch (e) {
    print('❌ Firebase initialization error: $e');
  }
  
  // ...
}
```

### 2. Browser Console'da Test

```javascript
// Browser Console'da (F12):
firebase.auth().signInWithEmailAndPassword('test@example.com', 'password123')
  .then(user => console.log('✅ Login success:', user))
  .catch(error => console.error('❌ Login error:', error));
```

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata: `auth/operation-not-allowed`
**Çözüm**: Firebase Console > Authentication > Sign-in method > Email/Password > Enable

### Hata: `auth/invalid-api-key`
**Çözüm**: firebase_options.dart'taki apiKey'i kontrol edin, Google Cloud Console'da API restrictions'ı kontrol edin

### Hata: `auth/unauthorized-domain`
**Çözüm**: Firebase Console > Authentication > Settings > Authorized domains'e domain ekleyin

### Hata: `400 Bad Request`
**Çözüm**: 
1. Email/Password provider etkin mi?
2. API key restrictions doğru mu?
3. Authorized domains ekli mi?
4. firebase_options.dart doğru mu?

## 📞 Daha Fazla Yardım

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [FlutterFire Auth Guide](https://firebase.flutter.dev/docs/auth/overview)
- [Firebase Console](https://console.firebase.google.com)
