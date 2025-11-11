# Firebase Yapılandırma Adımları

## ✅ Tamamlananlar
- ✅ FlutterFire CLI kuruldu
- ✅ Firebase CLI kuruldu

## 🔧 Şimdi Yapman Gerekenler

### Adım 1: Firebase'e Giriş Yap

Terminal'de şu komutu çalıştır:
```bash
firebase login
```

Bu komut:
- Tarayıcını açacak
- Google hesabınla giriş yapmanı isteyecek
- Firebase CLI'ye yetki verecek

### Adım 2: FlutterFire ile Yapılandır

Terminal'de şu komutu çalıştır:
```bash
cd /Users/selim/Desktop/github/SoftielClientHub
export PATH="$PATH:$HOME/.pub-cache/bin"
flutterfire configure
```

Bu komut çalıştığında:
1. **Firebase projelerini listeler** - Mevcut web projeni seç
2. **Platformları seç** - Android, iOS, Web'i seç
3. **Otomatik yapılandırma yapar:**
   - `lib/firebase_options.dart` oluşturur
   - `android/app/google-services.json` ekler
   - `ios/Runner/GoogleService-Info.plist` ekler

### Adım 3: main.dart Otomatik Güncellenecek

`firebase_options.dart` oluşturulduktan sonra main.dart'ı güncelleyeceğim.

### Adım 4: Firebase Console'da Servisleri Kontrol Et

1. **Authentication:**
   - https://console.firebase.google.com
   - Projeni seç
   - Authentication > Sign-in method
   - Email/Password'ü etkinleştir (varsa zaten açıktır)

2. **Firestore Database:**
   - Firestore Database > Veritabanı oluştur (yoksa)
   - Test modunda başlat

3. **Storage:**
   - Storage > Başlat (yoksa)
   - Test modunda başlat

4. **Cloud Messaging:**
   - Otomatik etkinleştirilir

### Adım 5: Security Rules Ekle

Firebase Console > Firestore Database > Rules

`COMPLETE_SCHEMA.md` dosyasındaki güvenlik kurallarını kopyala-yapıştır.

## ⚠️ Önemli Notlar

- Mevcut web projeni seçtiğinde, web yapılandırması değişmez
- Sadece Android ve iOS için yeni yapılandırma dosyaları eklenir
- Tüm platformlar aynı Firebase projesini kullanır

## 🚀 Hızlı Başlangıç

```bash
# 1. Firebase'e giriş yap
firebase login

# 2. FlutterFire yapılandırması
cd /Users/selim/Desktop/github/SoftielClientHub
export PATH="$PATH:$HOME/.pub-cache/bin"
flutterfire configure
```

Bu adımları tamamladıktan sonra bana haber ver, main.dart'ı güncelleyip test edelim!

