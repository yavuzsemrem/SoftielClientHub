# 🚀 Firestore Rules Deployment Adımları

## 📋 Yapılacaklar Listesi

### ✅ 1. Kod Güncellemeleri (Tamamlandı)
- [x] `FirestoreService` - Client Hub projeleri için `clientHubProjectsCollection` kullanıyor
- [x] `AppConstants` - Collection isimleri doğru tanımlı
- [x] `firestore.rules` - Güncellenmiş security rules hazır

### 🔥 2. Firebase Console'a Deploy

#### Seçenek A: Firebase Console'dan Manuel (Önerilen)

1. **Firebase Console'a gidin**:
   - https://console.firebase.google.com/project/softielwebsite/firestore/rules

2. **Rules sekmesine tıklayın**

3. **`firestore.rules` dosyasının içeriğini kopyalayın**:
   ```bash
   cat firestore.rules
   ```

4. **Firebase Console'daki Rules editörüne yapıştırın**

5. **"Publish" butonuna tıklayın**

6. **Onaylayın** (Rules'lar hemen aktif olur)

#### Seçenek B: Firebase CLI ile (Alternatif)

```bash
# Firebase CLI kurulu olmalı
npm install -g firebase-tools

# Firebase'e login olun
firebase login

# Projeyi başlatın (ilk kez)
firebase init firestore

# Rules'ı deploy edin
firebase deploy --only firestore:rules
```

### 🧪 3. Test Etme

#### Test 1: Rules Simulator (Firebase Console)

1. Firebase Console > Firestore > Rules > **Rules Playground**

2. **Test Senaryosu 1 - Client kendi projesini okuma**:
   ```
   Location: /clientHubProjects/project1
   Authenticated: true
   User ID: client123
   Operation: get
   Resource data: { clientId: "client123", name: "Test Project" }
   ```
   **Beklenen**: ✅ Allow

3. **Test Senaryosu 2 - Client başka projeyi okuma**:
   ```
   Location: /clientHubProjects/project2
   Authenticated: true
   User ID: client123
   Operation: get
   Resource data: { clientId: "client456", name: "Other Project" }
   ```
   **Beklenen**: ❌ Deny

4. **Test Senaryosu 3 - Portfolio projesi public okuma**:
   ```
   Location: /projects/portfolio1
   Authenticated: false
   Operation: get
   Resource data: { title: "Portfolio Project", category: "web-design" }
   ```
   **Beklenen**: ✅ Allow (herkes okuyabilir)

#### Test 2: Flutter Uygulamasında

1. **Uygulamayı çalıştırın**:
   ```bash
   flutter run -d chrome
   ```

2. **Login olun** (admin veya client hesabıyla)

3. **Dashboard'ı kontrol edin**:
   - Client ise: Sadece kendi projelerini görmeli
   - Admin ise: Tüm projeleri görmeli

4. **Browser Console'u açın** (F12):
   - Hata mesajlarını kontrol edin
   - Permission denied hataları varsa rules'ı kontrol edin

### ⚠️ 4. Olası Sorunlar ve Çözümleri

#### Sorun: "Permission denied" hatası

**Kontrol listesi**:
- [ ] Kullanıcı authenticated mı? (`request.auth != null`)
- [ ] Kullanıcının `isActive` field'ı `true` mu?
- [ ] Kullanıcının `role` field'ı doğru mu? (`admin`, `client`, `author`, `visitor`)
- [ ] Client Hub projesinde `clientId` field'ı kullanıcının `uid`'si ile eşleşiyor mu?

**Çözüm**:
```javascript
// Firestore'da kullanıcı dokümanını kontrol edin
/users/{userId}
{
  "uid": "client123",
  "email": "client@example.com",
  "role": "client",
  "isActive": true  // ✅ Bu true olmalı
}
```

#### Sorun: Rules deploy edilmedi

**Çözüm**:
1. Firebase Console'da Rules sekmesine gidin
2. "Publish" butonuna tıkladığınızdan emin olun
3. Console'da hata mesajı var mı kontrol edin

#### Sorun: Helper functions çalışmıyor

**Çözüm**:
- Helper functions'lar rules dosyasının en üstünde tanımlı olmalı
- `get()` fonksiyonu kullanırken dokümanın var olduğundan emin olun

### 📊 5. Deployment Sonrası Kontrol

#### Firestore Console'da Kontrol

1. **Firestore Database** > **Data** sekmesine gidin
2. **`clientHubProjects`** koleksiyonunu kontrol edin (henüz boş olabilir)
3. **`projects`** koleksiyonunu kontrol edin (portfolio projeleri burada)

#### Log Kontrolü

1. **Firebase Console** > **Firestore** > **Usage** sekmesine gidin
2. Rules evaluation sayısını kontrol edin
3. Hata sayısını kontrol edin

### 🎯 6. Sonraki Adımlar

Deployment tamamlandıktan sonra:

1. ✅ **Test verisi oluşturun**:
   - Admin panelinden bir Client Hub projesi oluşturun
   - Client hesabıyla login olup projeyi görüntüleyin

2. ✅ **Client Dashboard'ı tamamlayın**:
   - Proje listesi
   - Proje detay sayfası
   - Tasks, Updates, Messages, Files tab'ları

3. ✅ **Admin Dashboard'ı tamamlayın**:
   - Tüm projeleri görüntüleme
   - Proje oluşturma/düzenleme
   - CMS özellikleri

## 📚 Kaynaklar

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Playground Guide](https://firebase.google.com/docs/firestore/security/test-rules)
- [Firebase Console](https://console.firebase.google.com)

