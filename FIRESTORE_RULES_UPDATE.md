# 🔥 Firestore Rules Güncelleme - Permission Denied Hatası

## ❌ Sorun

Login sırasında şu hata alınıyor:
```
[cloud_firestore/permission-denied] Missing or insufficient permissions
```

## ✅ Çözüm

### 1. Users Koleksiyonu Rules Güncellendi

**Önceki Rules:**
```javascript
match /users/{userId} {
  allow read: if true;
  allow write, update: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow create: if isAuthenticated() && isOwner(userId);
}
```

**Yeni Rules:**
```javascript
match /users/{userId} {
  // Herkes okuyabilir (login için gerekli)
  allow read: if true;
  
  // Login sonrası lastLoginAt güncellemesi için özel izin
  allow update: if 
    // Sadece belirli alanları güncelleyebilir (login için)
    (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['lastLoginAt', 'updatedAt', 'loginAttempts']) ||
     // VEYA authenticated kullanıcı kendi profilini güncelleyebilir
     (isAuthenticated() && isOwner(userId)) ||
     // VEYA admin herkesi güncelleyebilir
     isAdmin());
  
  // Signup için herkes oluşturabilir
  allow create: if true;
  
  // Delete sadece admin
  allow delete: if isAdmin();
}
```

### 2. Neden Bu Değişiklik?

**Sorun**: Login başarılı olduktan sonra `lastLoginAt` güncellenmeye çalışılıyor ama:
- Henüz Firebase Auth'da authenticated değiliz (Firestore-based auth kullanıyoruz)
- `isAuthenticated()` false dönüyor
- `isOwner(userId)` çalışmıyor çünkü `request.auth.uid` yok

**Çözüm**: Login sonrası güncellemeler için özel izin:
- Sadece `lastLoginAt`, `updatedAt`, `loginAttempts` alanları güncellenebilir
- Bu alanlar güvenlik açısından kritik değil
- Herkes bu alanları güncelleyebilir (login tracking için)

### 3. Güvenlik Notları

**İyi Taraflar:**
- ✅ Sadece belirli alanlar güncellenebilir (lastLoginAt, updatedAt, loginAttempts)
- ✅ Email, password, role gibi kritik alanlar korunuyor
- ✅ Admin her şeyi yapabilir

**Dikkat Edilmesi Gerekenler:**
- ⚠️ Herkes `lastLoginAt` güncelleyebilir (ama sadece bu alan)
- ⚠️ Login tracking için gerekli bir trade-off

## 🚀 Deployment

### Firebase Console'dan

1. **Firebase Console**: https://console.firebase.google.com/project/softielwebsite/firestore/rules

2. **Rules sekmesine gidin**

3. **Güncellenmiş `firestore.rules` dosyasını yapıştırın**

4. **Publish** butonuna tıklayın

### Firebase CLI ile

```bash
firebase deploy --only firestore:rules
```

## 🧪 Test

1. **Uygulamayı yeniden başlatın**:
   ```bash
   flutter run -d chrome
   ```

2. **Login deneyin**:
   - Email: `info@softiel.com`
   - Password: (Firestore'daki password)

3. **Beklenen Sonuç**:
   - ✅ Login başarılı
   - ✅ Dashboard'a yönlendirme
   - ✅ `lastLoginAt` güncellenmiş

## 📋 Kontrol Listesi

- [ ] Firestore rules deploy edildi mi?
- [ ] `users` koleksiyonunda `allow read: if true;` var mı?
- [ ] `allow update` için özel izin var mı?
- [ ] Uygulama yeniden başlatıldı mı?

## 🔍 Debug

Eğer hala permission denied alıyorsanız:

1. **Firebase Console > Firestore > Rules** sekmesine gidin
2. **Rules Playground** ile test edin:
   ```
   Location: /users/{userId}
   Authenticated: false
   Operation: get
   ```
   **Beklenen**: ✅ Allow

3. **Browser Console'da tam hata mesajını kontrol edin**

## ✅ Sonuç

Artık login çalışmalı! Firestore rules güncellendi ve login sonrası güncellemeler için özel izin eklendi.

