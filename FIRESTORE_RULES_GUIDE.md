# Firestore Security Rules Rehberi

## 📋 Genel Bakış

Bu Firestore security rules dosyası hem mevcut web uygulamanızı hem de Flutter Client Hub uygulamasını destekler.

## 🔐 Güvenlik Prensipleri

### 1. Role-Based Access Control (RBAC)
- **Admin**: Tüm verilere erişim
- **Author**: Blog, Portfolio, Categories, Tags yönetimi
- **Client**: Sadece kendi projelerine erişim
- **Visitor**: Sadece public içerikleri görüntüleme

### 2. Authentication Gereksinimleri
- Çoğu write işlemi için authentication zorunlu
- Kullanıcılar sadece aktif hesaplarla işlem yapabilir

### 3. Data Ownership
- Kullanıcılar sadece kendi verilerine erişebilir
- Admin tüm verilere erişebilir

## 📁 Koleksiyon Bazlı Kurallar

### Users (`/users/{userId}`)
- ✅ **Read**: Herkes (login için gerekli)
- ✅ **Write**: Kullanıcı kendi profilini güncelleyebilir (lastLoginAt, updatedAt)
- ✅ **Admin**: Tüm kullanıcıları yönetebilir

### Client Hub Projects (`/clientHubProjects/{projectId}`)
- ✅ **Read**: 
  - Client: Sadece kendi projeleri
  - Admin: Tüm projeler
- ✅ **Write**: Sadece Admin
- ✅ **Subcollections**:
  - `/tasks`: Client kendi projesinin task'larını görebilir
  - `/updates`: Client kendi projesinin güncellemelerini görebilir
  - `/messages`: Client ve Admin mesajlaşabilir
  - `/files`: Client kendi projesinin dosyalarını görebilir

### Portfolio Projects (`/projects/{projectId}`)
- ✅ **Read**: Herkes (public portfolio)
- ✅ **Write**: Sadece Admin/Author

### Blog Posts (`/blogs/{blogId}`)
- ✅ **Read**: Herkes (public blog)
- ✅ **Write**: Sadece Admin/Author

### Categories (`/categories/{categoryId}`)
- ✅ **Read**: Herkes
- ✅ **Write**: Sadece Admin/Author

### Tags (`/tags/{tagId}`)
- ✅ **Read**: Herkes
- ✅ **Write**: Sadece Admin/Author

### Comments (`/comments/{commentId}`)
- ✅ **Read**: Herkes
- ✅ **Create**: Authenticated kullanıcılar
- ✅ **Update/Delete**: 
  - Kullanıcı kendi yorumunu silebilir
  - Admin/Author moderasyon yapabilir

### Notifications (`/notifications/{notificationId}`)
- ✅ **Read**: 
  - Kullanıcı: Sadece kendi bildirimleri
  - Admin: Tüm bildirimler
- ✅ **Create**: Sadece Admin
- ✅ **Update**: Kullanıcı kendi bildirimlerini güncelleyebilir (isRead)

### Activities (`/activities/{activityId}`)
- ✅ **Read**: 
  - Kullanıcı: Sadece kendi aktiviteleri
  - Admin: Tüm aktiviteler
- ✅ **Write**: Sadece Admin

### Sessions (`/sessions/{sessionId}`)
- ✅ **Read**: 
  - Kullanıcı: Sadece kendi session'ları
  - Admin: Tüm session'lar
- ✅ **Write**: Kullanıcı kendi session'ını oluşturabilir/güncelleyebilir

### Media (`/media/{mediaId}`)
- ✅ **Read**: Herkes (public media)
- ✅ **Write**: Sadece Admin/Author

## 🚀 Deployment

### 1. Firebase Console'dan Deploy

```bash
# Firebase CLI ile
firebase deploy --only firestore:rules
```

### 2. Firebase Console'dan Manuel

1. Firebase Console > Firestore Database > Rules
2. `firestore.rules` dosyasının içeriğini yapıştırın
3. **Publish** butonuna tıklayın

## ⚠️ Önemli Notlar

### Development vs Production

- **Development**: Test koleksiyonları (`/test`, `/manual_test`) kapalı
- **Production**: Tüm güvenlik kuralları aktif

### Backward Compatibility

- Eski `/admin_users` koleksiyonu hala destekleniyor
- Mevcut web uygulamanız etkilenmeyecek

### Client Hub vs Portfolio Projects

- **Client Hub Projects** (`/clientHubProjects`): Proje takip sistemi için
- **Portfolio Projects** (`/projects`): Web sitesi portfolio için
- İki farklı koleksiyon, farklı erişim kuralları

## 🧪 Test Etme

### Rules Simulator

Firebase Console > Firestore > Rules > Rules Playground

Örnek test senaryoları:

1. **Client kendi projesini okuma**:
   - User: `client123`
   - Path: `/clientHubProjects/project1`
   - Operation: `get`
   - Expected: ✅ Allow (eğer `clientId == client123`)

2. **Client başka projeyi okuma**:
   - User: `client123`
   - Path: `/clientHubProjects/project2`
   - Operation: `get`
   - Expected: ❌ Deny (eğer `clientId != client123`)

3. **Admin tüm projeleri okuma**:
   - User: `admin123` (role: admin)
   - Path: `/clientHubProjects/project1`
   - Operation: `get`
   - Expected: ✅ Allow

## 🔧 Troubleshooting

### Sorun: "Permission denied" hatası

**Kontrol listesi**:
- [ ] Kullanıcı authenticated mı?
- [ ] Kullanıcı aktif mi? (`isActive == true`)
- [ ] Kullanıcının role'ü doğru mu?
- [ ] Kullanıcı kendi verisine mi erişiyor?

### Sorun: Client projelerini göremiyor

**Çözüm**:
1. Firestore'da projenin `clientId` field'ı doğru mu?
2. Kullanıcının `uid`'si `clientId` ile eşleşiyor mu?
3. Kullanıcının `isActive` field'ı `true` mu?

## 📚 Kaynaklar

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com)

