# Genişletilmiş Firebase Firestore Şeması

## Mevcut Koleksiyonlar (Softiel Client Hub)
- `/clients` - Müşteri bilgileri
- `/projects` - Client Hub projeleri (freelance tracking)
- `/projects/{id}/tasks` - Alt görevler
- `/projects/{id}/updates` - İlerleme güncellemeleri
- `/projects/{id}/messages` - Chat mesajları
- `/projects/{id}/files` - Dosyalar
- `/notifications` - Bildirimler

## Yeni Eklenecek Koleksiyonlar (Blog & Portfolio)

### 1. Blog Koleksiyonları

#### `/blogPosts`
```json
{
  "id": "auto",
  "title": "Flutter Best Practices",
  "slug": "flutter-best-practices",
  "content": "Full markdown/html content",
  "excerpt": "Short description",
  "featuredImage": "https://...",
  "authorId": "uid",
  "categoryId": "category_id",
  "tags": ["flutter", "mobile"],
  "published": true,
  "publishedAt": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "views": 0
}
```

#### `/blogCategories`
```json
{
  "id": "auto",
  "name": "Flutter",
  "slug": "flutter",
  "description": "Flutter related posts",
  "icon": "icon_name",
  "color": "#0056b8",
  "createdAt": "timestamp"
}
```

### 2. Portfolio Koleksiyonları

#### `/portfolioProjects`
```json
{
  "id": "auto",
  "title": "E-commerce Website",
  "slug": "ecommerce-website",
  "description": "Full description",
  "shortDescription": "Short description",
  "images": ["url1", "url2"],
  "technologies": ["Flutter", "Firebase"],
  "categoryId": "category_id",
  "featured": true,
  "liveUrl": "https://...",
  "githubUrl": "https://...",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/portfolioCategories`
```json
{
  "id": "auto",
  "name": "Web Development",
  "slug": "web-development",
  "icon": "icon_name",
  "createdAt": "timestamp"
}
```

### 3. Kullanıcı Rolleri

#### `/users` (Firestore'da kullanıcı profilleri)
```json
{
  "id": "uid (Firebase Auth UID)",
  "email": "user@example.com",
  "name": "John Doe",
  "photoUrl": "https://...",
  "role": "admin" | "client" | "visitor",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp"
}
```

**Roller:**
- `admin`: Tüm yetkiler (blog yazma, proje yönetimi, client hub yönetimi)
- `client`: Sadece kendi projelerini görür (Client Hub)
- `visitor`: Sadece blog ve portfolio görüntüleme

## Güvenlik Kuralları (Güncellenmiş)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clients (Client Hub)
    match /clients/{clientId} {
      allow read, write: if request.auth != null && request.auth.uid == clientId;
    }
    
    // Client Hub Projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (resource.data.clientId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      match /{subcollection=**}/{docId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Blog Posts
    match /blogPosts/{postId} {
      allow read: if resource.data.published == true || 
        (request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Blog Categories
    match /blogCategories/{categoryId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Portfolio Projects
    match /portfolioProjects/{projectId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Portfolio Categories
    match /portfolioCategories/{categoryId} {
      allow read: if true; // Herkes okuyabilir
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Notifications
    match /notifications/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

## Storage Rules (Güncellenmiş)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Client Hub dosyaları
    match /projectFiles/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Blog görselleri
    match /blogImages/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Portfolio görselleri
    match /portfolioImages/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Kullanıcı avatarları
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

