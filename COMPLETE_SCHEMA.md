# Tam Firebase Firestore Şeması (Web + Mobil)

## Mevcut Koleksiyonlar (Softiel Client Hub)
- `/clients` - Müşteri bilgileri
- `/projects` - Client Hub projeleri (freelance tracking)
- `/projects/{id}/tasks` - Alt görevler
- `/projects/{id}/updates` - İlerleme güncellemeleri
- `/projects/{id}/messages` - Chat mesajları
- `/projects/{id}/files` - Dosyalar
- `/notifications` - Bildirimler

## Blog & Portfolio Koleksiyonları

### `/blogPosts`
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
  "tags": ["tag_id1", "tag_id2"],
  "published": true,
  "publishedAt": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "views": 0
}
```

### `/blogCategories`
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

### `/portfolioProjects`
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

### `/portfolioCategories`
```json
{
  "id": "auto",
  "name": "Web Development",
  "slug": "web-development",
  "icon": "icon_name",
  "createdAt": "timestamp"
}
```

## Yeni Eklenecek Koleksiyonlar (CMS Özellikleri)

### 1. Tag Management

#### `/tags`
```json
{
  "id": "auto",
  "name": "Flutter",
  "slug": "flutter",
  "description": "Flutter framework related content",
  "color": "#0056b8",
  "usageCount": 5,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2. Comment Management

#### `/comments`
```json
{
  "id": "auto",
  "postId": "blog_post_id",
  "postType": "blog" | "portfolio",
  "authorId": "uid",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "authorAvatar": "https://...",
  "content": "Great article!",
  "parentId": null | "comment_id", // For nested comments
  "status": "pending" | "approved" | "rejected" | "spam",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "approvedAt": "timestamp",
  "approvedBy": "admin_uid"
}
```

### 3. Media Library

#### `/media`
```json
{
  "id": "auto",
  "fileName": "image.jpg",
  "originalName": "my-image.jpg",
  "fileType": "image/jpeg",
  "fileSize": 1024000,
  "fileUrl": "https://firebasestorage...",
  "thumbnailUrl": "https://firebasestorage...",
  "width": 1920,
  "height": 1080,
  "alt": "Image description",
  "caption": "Image caption",
  "uploadedBy": "uid",
  "usedIn": [
    {
      "type": "blog",
      "id": "post_id"
    }
  ],
  "tags": ["tag_id1", "tag_id2"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 4. User Management

#### `/users` (Genişletilmiş)
```json
{
  "id": "uid (Firebase Auth UID)",
  "email": "user@example.com",
  "name": "John Doe",
  "photoUrl": "https://...",
  "role": "admin" | "client" | "visitor" | "author",
  "bio": "User bio",
  "website": "https://...",
  "socialLinks": {
    "twitter": "https://...",
    "linkedin": "https://...",
    "github": "https://..."
  },
  "permissions": {
    "canPublish": true,
    "canModerate": true,
    "canManageUsers": false
  },
  "stats": {
    "postsCount": 10,
    "commentsCount": 5
  },
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp",
  "isActive": true
}
```

## Güvenlik Kuralları (Güncellenmiş)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check admin role
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check author role
    function isAuthor() {
      return request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'author');
    }
    
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || isAdmin());
    }
    
    // Clients (Client Hub)
    match /clients/{clientId} {
      allow read, write: if request.auth != null && request.auth.uid == clientId;
    }
    
    // Client Hub Projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (resource.data.clientId == request.auth.uid || isAdmin());
      match /{subcollection=**}/{docId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Blog Posts
    match /blogPosts/{postId} {
      allow read: if resource.data.published == true || isAdmin();
      allow create: if isAuthor();
      allow update, delete: if isAuthor() && 
        (resource.data.authorId == request.auth.uid || isAdmin());
    }
    
    // Blog Categories
    match /blogCategories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Portfolio Projects
    match /portfolioProjects/{projectId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Portfolio Categories
    match /portfolioCategories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Tags
    match /tags/{tagId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Comments
    match /comments/{commentId} {
      allow read: if true; // Herkes okuyabilir (approved olanlar gösterilir)
      allow create: if request.auth != null; // Giriş yapmış herkes yorum yazabilir
      allow update, delete: if request.auth != null && 
        (resource.data.authorId == request.auth.uid || isAdmin());
    }
    
    // Media Library
    match /media/{mediaId} {
      allow read: if request.auth != null;
      allow write: if isAuthor();
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
    
    // Media Library
    match /media/{allPaths=**} {
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

## Kullanıcı Rolleri

- **admin**: Tüm yetkiler (blog, portfolio, yorum moderasyonu, kullanıcı yönetimi, media library)
- **author**: Blog yazabilir, media yükleyebilir, kendi yorumlarını yönetebilir
- **client**: Sadece kendi projelerini görür (Client Hub)
- **visitor**: Sadece blog ve portfolio görüntüleme, yorum yazabilir

