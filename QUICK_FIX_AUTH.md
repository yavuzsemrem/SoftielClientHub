# ⚡ Hızlı Çözüm: 400 Bad Request Hatası

## 🔴 Sorun

Browser Console'da şu hatayı alıyorsunuz:
```
identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=...:1 
Failed to load resource: the server responded with a status of 400
```

## ✅ Çözüm (2 dakika)

### Adım 1: Firebase Console'a Gidin

**Link**: https://console.firebase.google.com/project/softielwebsite/authentication/providers

### Adım 2: Email/Password Provider'ı Etkinleştirin

1. **Authentication** > **Sign-in method** sekmesine gidin
2. **Email/Password** satırını bulun
3. **Email/Password** satırına **tıklayın**
4. **Enable** toggle'ını **AÇIN** (şu anda kapalı olabilir)
5. **Save** butonuna tıklayın

### Adım 3: Uygulamayı Yeniden Başlatın

```bash
# Terminal'de uygulamayı durdurun (Ctrl+C)
# Sonra tekrar başlatın
flutter run -d chrome
```

### Adım 4: Tekrar Login Deneyin

Artık login çalışmalı! ✅

## 📸 Görsel Rehber

```
Firebase Console > Authentication > Sign-in method

┌─────────────────────────────────────────────┐
│ Sign-in providers                            │
├─────────────────────────────────────────────┤
│ Email/Password        [Enable] ✅ ← AÇIK    │
│ Google                [Disable]             │
│ Facebook              [Disable]             │
│ ...                                         │
└─────────────────────────────────────────────┘
```

## 🔍 Hala Çalışmıyorsa

Browser Console'da (F12) şu komutu çalıştırın ve tam hata mesajını görün:

```javascript
// Flutter uygulamasında login denemesi yapın
// Sonra Console'da şu komutu çalıştırın:
console.log('Check Firebase Auth errors above');
```

**Beklenen hata kodları**:
- `auth/operation-not-allowed` → Email/Password provider etkin değil (en yaygın)
- `auth/invalid-api-key` → API key sorunu
- `auth/unauthorized-domain` → Domain authorized değil

## ✅ Başarı Kontrolü

Login başarılı olduğunda:
- ✅ Browser Console'da hata yok
- ✅ Dashboard sayfasına yönlendirme yapılıyor
- ✅ Debug console'da "✅ Login successful" mesajı görünüyor

## 📞 Hala Sorun Varsa

1. Browser Console'daki **tam hata mesajını** kopyalayın
2. Firebase Console'da Email/Password provider'ın **screenshot**'ını alın
3. Bana gönderin, birlikte çözelim

---

**Not**: Bu hata %99 ihtimalle Email/Password provider'ın etkin olmamasından kaynaklanıyor. Yukarıdaki adımları uyguladıktan sonra çalışmalı!

