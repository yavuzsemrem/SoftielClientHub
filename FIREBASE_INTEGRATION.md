# Firebase Database Entegrasyonu

Bu dokümantasyon, mevcut Softiel website Firebase database'iniz ile Client Hub uygulamasının nasıl entegre edildiğini açıklar.

## 🔄 Mevcut Database Yapısı

Mevcut Firebase database'inizde şu koleksiyonlar bulunuyor:
- `otp_codes` - OTP kodları
- `admin_users` - Admin kullanıcıları
- `users` - Kullanıcılar (login için) ✅ **Client Hub bu koleksiyonu kullanıyor**
- `blogs` - Blog yazıları
- `comments` - Yorumlar
- `categories` - Kategoriler
- `tags` - Etiketler
- `notifications` - Bildirimler
- `stats` - İstatistikler
- `activities` - Aktiviteler
- `projects` - Projeler (admin paneli için) ✅ **Client Hub bu koleksiyonu kullanıyor**
- `admin_replies` - Admin yanıtları

## ✅ Client Hub için Kullanılan Koleksiyonlar

Client Hub uygulaması mevcut database'inizi kullanır, ancak yeni koleksiyonlar ekler:

### 1. `users` (MEVCUT - Custom Authentication ile Kullanılıyor)
Client Hub kullanıcı bilgileri için mevcut `users` koleksiyonu kullanılır.
- **Yapı**: Mevcut yapı + `role` field'ı (`'admin'` veya `'client'`)
- **Client Hub Kullanımı**: Sadece `role === 'client'` olan kullanıcılar giriş yapabilir
- **Authentication**: Custom authentication (Firebase Auth kullanılmıyor)
- **Password**: `users` koleksiyonundaki `password` field'ı ile kontrol ediliyor
- **Örnek Kullanıcı**:
  ```json
  {
    "uid": "soJ40YI7qoUvQcBcOFYefDfKDHj2",
    "email": "client@example.com",
    "name": "Client User",
    "displayName": "Client User",
    "role": "client",
    "password": "client123",
    "isActive": true,
    "loginAttempts": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

### 2. `projects` (MEVCUT - Filtreleme ile Kullanılıyor)
Mevcut `projects` koleksiyonunu kullanır, ancak Client Hub projeleri `clientId` field'ı ile işaretlenir.
- **Yapı**: Mevcut yapı + `clientId` field'ı (Client Hub projeleri için)
- **Filtreleme**: `where('clientId', '==', user.uid)` ile Client Hub projeleri çekilir
- **Not**: Admin paneli projeleri `clientId` field'ı olmadan saklanabilir
- **Örnek Proje**:
  ```json
  {
    "clientId": "soJ40YI7qoUvQcBcOFYefDfKDHj2", // users koleksiyonundaki uid
    "name": "Proje Adı",
    "status": "active",
    "progress": 0,
    "dueDate": "2024-12-31T00:00:00Z",
    "lastUpdate": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```

### 3. `phases` (YENİ)
Proje aşamaları için kullanılır.
- **Yapı**: `{ id, projectId, title, percent, startDate, endDate, status, createdAt }`

### 4. `tasks` (YENİ)
Görevler için kullanılır.
- **Yapı**: `{ id, phaseId, projectId, title, description, percent, completed, dueDate, createdAt, updatedAt }`

### 5. `updates` (YENİ)
Proje güncellemeleri için kullanılır.
- **Yapı**: `{ id, projectId, title, body, progressChange, createdAt, createdBy }`

### 6. `messages` (YENİ)
Gerçek zamanlı mesajlaşma için kullanılır.
- **Yapı**: `{ id, projectId, senderId, senderName, message, attachments, replyToId, createdAt, updatedAt }`
- **Not**: Mevcut database'de yok, yeni eklendi

### 7. `files` (YENİ)
Dosya paylaşımı için kullanılır.
- **Yapı**: `{ id, projectId, fileName, url, category, version, size, uploadedBy, uploadedAt, description }`

### 8. `approvals` (YENİ)
Onay süreçleri için kullanılır.
- **Yapı**: `{ id, projectId, title, status, notes, requestedAt, respondedAt, requestedBy }`

### 9. `notifications` (MEVCUT - Filtreleme ile Kullanılabilir)
Mevcut `notifications` koleksiyonunu kullanabilir.
- **Filtreleme**: `where('userId', '==', user.uid)` ile kullanıcı bildirimleri çekilir

## 🔐 Authentication Sistemi

**ÖNEMLİ**: Client Hub **Firebase Auth kullanmıyor**, custom authentication kullanıyor.

### Custom Authentication Akışı:
1. Kullanıcı email ve password girer
2. `users` koleksiyonundan email ile kullanıcı bulunur
3. `role === 'client'` kontrolü yapılır
4. `isActive === true` kontrolü yapılır
5. Password karşılaştırması yapılır
6. Başarılı girişte `lastLoginAt` ve `loginAttempts` güncellenir
7. Kullanıcı bilgileri AsyncStorage'a kaydedilir

### Güvenlik Notları:
- Password'lar şu an plain text olarak saklanıyor (production'da bcrypt gibi hash kullanılmalı)
- Güvenlik kontrolü kod tarafında yapılıyor (`role === 'client'` kontrolü)
- Security rules esnek tutulmuş (custom auth nedeniyle)

## 🔒 Security Rules

Mevcut security rules'larınız **değiştirilmedi**. Sadece yeni Client Hub koleksiyonları için rules eklendi.

### Rules Dosyası Konumu
`firebase/security.rules.clienthub` dosyasında mevcut rules'larınız + yeni Client Hub rules'ları bulunur.

### Firebase Console'da Uygulama

1. Firebase Console → Firestore Database → Rules
2. `firebase/security.rules.clienthub` dosyasının içeriğini kopyalayın
3. Mevcut rules'larınızın üzerine yapıştırın (mevcut rules korunur, sadece yeni rules eklenir)

### Önemli Not:
Custom authentication kullanıldığı için `request.auth` kullanılamaz. Security rules esnek tutulmuş (`allow read: if true`), güvenlik kontrolü kod tarafında yapılıyor.

## 📝 Önemli Notlar

### 1. `users` Koleksiyonu
- Mevcut `users` koleksiyonunu kullanıyoruz
- Client Hub için `role: 'client'` field'ı zorunludur
- `isActive: true` olmalıdır
- `uid` field'ı unique olmalıdır
- Password plain text olarak saklanıyor (production'da hash kullanılmalı)

### 2. `projects` Koleksiyonu
- Mevcut admin paneli projeleriniz `clientId` field'ı olmadan saklanabilir
- Client Hub projeleri için `clientId` field'ı zorunludur
- `clientId` değeri `users` koleksiyonundaki `uid` ile eşleşmeli
- Filtreleme: `where('clientId', '==', user.uid)` ile sadece Client Hub projeleri çekilir

### 3. Authentication
- Firebase Auth kullanılmıyor
- Custom authentication ile `users` koleksiyonundan login yapılıyor
- Sadece `role === 'client'` olan kullanıcılar giriş yapabilir

## 🚀 İlk Kurulum

### 1. Security Rules'u Güncelleyin
```bash
# firebase/security.rules.clienthub dosyasını Firebase Console'a yapıştırın
```

### 2. İlk Client Kullanıcısını Oluşturun
Firebase Console → Firestore → `users` koleksiyonuna yeni doküman ekleyin:
```json
{
  "uid": "unique-user-id",
  "email": "client@example.com",
  "name": "Client User",
  "displayName": "Client User",
  "role": "client",
  "password": "client123",
  "isActive": true,
  "loginAttempts": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "bio": "",
  "lastLoginAt": null
}
```

**ÖNEMLİ**: 
- `uid` field'ı unique olmalı (doküman ID olarak da kullanılabilir)
- `role` field'ı `'client'` olmalı
- `isActive` field'ı `true` olmalı

### 3. İlk Projeyi Oluşturun
Firebase Console → Firestore → `projects` koleksiyonuna yeni doküman ekleyin:
```json
{
  "clientId": "unique-user-id", // users koleksiyonundaki uid ile eşleşmeli
  "name": "Proje Adı",
  "status": "active",
  "progress": 0,
  "dueDate": "2024-12-31T00:00:00Z",
  "lastUpdate": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**ÖNEMLİ**: `clientId` field'ı zorunludur! Bu field olmadan proje Client Hub'da görünmez.

## 🔍 Veri Kontrolü

Mevcut database'inizdeki veriler **etkilenmez**:
- ✅ Mevcut `users` koleksiyonundaki admin kullanıcıları korunur
- ✅ Mevcut `projects` koleksiyonundaki admin paneli projeleri korunur
- ✅ Mevcut `notifications` koleksiyonu korunur
- ✅ Tüm diğer koleksiyonlar korunur
- ✅ Sadece yeni Client Hub koleksiyonları eklenir

## ⚠️ Dikkat Edilmesi Gerekenler

1. **`users` Koleksiyonu**: Client Hub kullanıcıları için `role: 'client'` field'ı zorunludur
2. **`projects` Koleksiyonu**: Client Hub projeleri için mutlaka `clientId` field'ı ekleyin
3. **`clientId` Field'ı**: `users` koleksiyonundaki `uid` ile eşleşmeli
4. **Security Rules**: Mevcut rules'larınızı değiştirmeyin, sadece yeni rules ekleyin
5. **Password Güvenliği**: Production'da password'ları hash'leyin (bcrypt gibi)
6. **Test**: Önce test ortamında deneyin, production'a geçmeden önce

## 📞 Sorun Giderme

### Projeler görünmüyor
- `projects` koleksiyonunda `clientId` field'ı var mı kontrol edin
- `clientId` değeri `users` koleksiyonundaki `uid` ile eşleşiyor mu kontrol edin

### Login hatası
- `users` koleksiyonunda kullanıcı var mı kontrol edin
- `role` field'ı `'client'` mi kontrol edin
- `isActive` field'ı `true` mu kontrol edin
- Password doğru mu kontrol edin

### Authentication hatası
- Email büyük/küçük harf duyarlı mı kontrol edin (kod lowercase yapıyor)
- `users` koleksiyonunda `uid` field'ı var mı kontrol edin
