# 🔍 Firebase Auth Kontrol Komutları

## Hızlı Kontrol

Browser Console'da (F12) şu komutları çalıştırarak Firebase Auth durumunu kontrol edebilirsiniz:

```javascript
// 1. Firebase Auth instance kontrolü
console.log('Firebase Auth:', firebase.auth());

// 2. Mevcut kullanıcı kontrolü
firebase.auth().onAuthStateChanged(user => {
  console.log('Current user:', user);
});

// 3. Email/Password provider durumu (manuel test)
firebase.auth().signInWithEmailAndPassword('test@example.com', 'test123')
  .then(user => {
    console.log('✅ Login başarılı:', user);
  })
  .catch(error => {
    console.error('❌ Login hatası:', error.code, error.message);
    console.error('Tam hata:', error);
  });
```

## Hata Kodları

- `auth/operation-not-allowed` → Email/Password provider etkin değil
- `auth/invalid-api-key` → API key sorunu
- `auth/unauthorized-domain` → Domain authorized değil
- `auth/user-not-found` → Kullanıcı bulunamadı
- `auth/wrong-password` → Yanlış şifre
- `auth/invalid-email` → Geçersiz email formatı

## Firebase Console Kontrolü

1. https://console.firebase.google.com/project/softielwebsite/authentication/providers
2. Email/Password satırına tıklayın
3. Enable toggle'ının açık olduğundan emin olun
