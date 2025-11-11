# Firebase Yapılandırma Rehberi

## Adım 1: FlutterFire CLI Kontrolü ✅
FlutterFire CLI zaten kurulu (v1.3.1)

## Adım 2: Firebase Projesini Bağla

### Komut:
```bash
flutterfire configure
```

Bu komut çalıştığında:
1. Firebase projelerini listeler
2. Mevcut web projeni seçersin
3. Platformları seçersin (Android, iOS, Web)
4. Otomatik olarak yapılandırma dosyalarını oluşturur

### Oluşturulacak Dosyalar:
- `lib/firebase_options.dart` - Tüm platformlar için yapılandırma
- `android/app/google-services.json` - Android yapılandırması
- `ios/Runner/GoogleService-Info.plist` - iOS yapılandırması

## Adım 3: main.dart'ı Güncelle

`firebase_options.dart` oluşturulduktan sonra main.dart otomatik güncellenecek.

## Adım 4: Firebase Console'da Servisleri Etkinleştir

1. **Authentication:**
   - Firebase Console > Authentication > Sign-in method
   - Email/Password'ü etkinleştir
   - Email link (passwordless) etkinleştir (opsiyonel)

2. **Firestore Database:**
   - Firebase Console > Firestore Database
   - Test modunda başlat (güvenlik kuralları sonra eklenecek)

3. **Storage:**
   - Firebase Console > Storage
   - Test modunda başlat

4. **Cloud Messaging (FCM):**
   - Firebase Console > Cloud Messaging
   - Otomatik etkinleştirilir

## Adım 5: Security Rules Ekle

`COMPLETE_SCHEMA.md` dosyasındaki güvenlik kurallarını Firebase Console'a ekle.

