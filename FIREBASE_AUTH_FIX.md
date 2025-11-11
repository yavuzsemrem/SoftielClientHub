# 🔥 Firebase Auth 400 Bad Request - Hızlı Çözüm

## ❌ Hata: `accounts:signInWithPassword` 400 Bad Request

Bu hata **%99 ihtimalle** Firebase Console'da **Email/Password provider'ın etkin olmamasından** kaynaklanıyor.

## ⚡ Hızlı Çözüm (2 dakika)

### Adım 1: Firebase Console'a Gidin

1. **Firebase Console**: https://console.firebase.google.com/project/softielwebsite/authentication/providers

2. **Authentication** > **Sign-in method** sekmesine gidin

3. **Email/Password** satırını bulun ve tıklayın

4. **Enable** toggle'ını **AÇIN** (şu anda kapalı olabilir)

5. **Email link (passwordless sign-in)** isteğe bağlı (açık veya kapalı olabilir)

6. **Save** butonuna tıklayın

### Adım 2: Uygulamayı Yeniden Başlatın

```bash
# Uygulamayı durdurun (Ctrl+C) ve tekrar başlatın
flutter run -d chrome
```

### Adım 3: Tekrar Login Deneyin

Artık login çalışmalı! ✅

## 🔍 Detaylı Kontrol Listesi

Eğer hala çalışmıyorsa, şunları kontrol edin:

### 1. Email/Password Provider Etkin mi?

**Kontrol**: Firebase Console > Authentication > Sign-in method > Email/Password
- ✅ **Enabled** olmalı
- ❌ **Disabled** ise → Enable yapın

### 2. Authorized Domains

**Kontrol**: Firebase Console > Authentication > Settings > Authorized domains

Şu domain'lerin ekli olduğundan emin olun:
- ✅ `localhost` (development için)
- ✅ `softielwebsite.firebaseapp.com`
- ✅ Production domain'iniz (varsa)

**Ekleme**: "Add domain" butonuna tıklayıp domain ekleyin

### 3. API Key Restrictions

**Kontrol**: Google Cloud Console > APIs & Services > Credentials

1. API Key'inizi bulun: `AIzaSyDT23p3KDd3pQf13UiQOuIjmemyBlMYPBg`
2. Edit'e tıklayın
3. **API restrictions** bölümünü kontrol edin:
   - ✅ **Don't restrict key** seçili olmalı (test için)
   - VEYA
   - ✅ **Restrict key** seçiliyse, şunlar eklenmeli:
     - Identity Toolkit API
     - Firebase Authentication API

### 4. Browser Console'da Tam Hata Mesajı

Browser Console'da (F12) tam hata mesajını kontrol edin:

```javascript
// Örnek hata mesajları:
FirebaseError: Firebase: Error (auth/operation-not-allowed)
FirebaseError: Firebase: Error (auth/invalid-api-key)
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

## 🧪 Test Etme

### 1. Firebase Console'da Test

Firebase Console > Authentication > Users sekmesine gidin:
- Eğer hiç kullanıcı yoksa → Signup özelliğini test edin
- Eğer kullanıcı varsa → Email/Password ile login deneyin

### 2. Browser Console'da Test

Browser Console'da (F12) şunu deneyin:

```javascript
// Firebase Auth instance'ı kontrol edin
firebase.auth().signInWithEmailAndPassword('test@example.com', 'password123')
  .then(user => console.log('✅ Login success:', user))
  .catch(error => console.error('❌ Login error:', error.code, error.message));
```

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata: `auth/operation-not-allowed`
**Sebep**: Email/Password provider etkin değil
**Çözüm**: Firebase Console > Authentication > Sign-in method > Email/Password > Enable

### Hata: `auth/invalid-api-key`
**Sebep**: API key geçersiz veya kısıtlanmış
**Çözüm**: Google Cloud Console > APIs & Services > Credentials > API Key restrictions'ı kontrol edin

### Hata: `auth/unauthorized-domain`
**Sebep**: Domain authorized domains listesinde yok
**Çözüm**: Firebase Console > Authentication > Settings > Authorized domains'e domain ekleyin

### Hata: `400 Bad Request` (genel)
**Sebep**: Email/Password provider etkin değil (en yaygın)
**Çözüm**: Firebase Console > Authentication > Sign-in method > Email/Password > Enable

## 📸 Görsel Rehber

### Email/Password Provider'ı Etkinleştirme

1. Firebase Console > Authentication > Sign-in method
2. Email/Password satırına tıklayın
3. **Enable** toggle'ını açın
4. **Save** butonuna tıklayın

```
┌─────────────────────────────────────┐
│ Sign-in providers                   │
├─────────────────────────────────────┤
│ Email/Password        [Enable] ✅    │ ← Bu toggle açık olmalı
│ Google                [Disable]     │
│ Facebook              [Disable]     │
└─────────────────────────────────────┘
```

## ✅ Başarı Kontrolü

Login başarılı olduğunda:
- ✅ Browser Console'da hata yok
- ✅ Dashboard sayfasına yönlendirme yapılıyor
- ✅ Firebase Console > Authentication > Users'da kullanıcı görünüyor

## 📞 Hala Çalışmıyorsa

1. **Browser Console'daki tam hata mesajını** kopyalayın
2. **Firebase Console'da Email/Password provider'ın durumunu** kontrol edin
3. **Screenshot** alın (Firebase Console > Authentication > Sign-in method)
4. Bana gönderin, birlikte çözelim

## 🎯 Sonuç

**En yaygın sebep**: Email/Password provider etkin değil
**Çözüm**: Firebase Console > Authentication > Sign-in method > Email/Password > Enable

Bu adımı yaptıktan sonra uygulamayı yeniden başlatın ve tekrar deneyin!

