# Safari'de Build ve Çalıştırma Rehberi

## ✅ Safari Desteği

Flutter web uygulaması Safari'de tam desteklenir. Safari 14+ sürümlerinde sorunsuz çalışır.

## 🚀 Build Komutları

### 1. Web Build (Safari için optimize edilmiş)
```bash
flutter build web --release
```

### 2. Safari'de Test Etme

#### Yerel Test (Development)
```bash
# Chrome'da test
flutter run -d chrome

# Safari'de test için build al ve local server çalıştır
flutter build web --release
cd build/web
python3 -m http.server 8000
# Sonra Safari'de http://localhost:8000 aç
```

#### Production Build
```bash
flutter build web --release --base-href /
```

## 📱 Safari Özellikleri

### PWA (Progressive Web App) Desteği
- ✅ Safari'de "Add to Home Screen" ile PWA olarak yüklenebilir
- ✅ Offline çalışma desteği (Service Worker)
- ✅ App-like deneyim

### Safari-Specific Optimizasyonlar
- ✅ Apple Touch Icon desteği
- ✅ Status bar styling
- ✅ Viewport optimizasyonu
- ✅ Theme color ayarları

## ⚠️ Safari Sınırlamaları

1. **Service Worker**: Safari'de Service Worker desteği var ama bazı özellikler sınırlı olabilir
2. **WebRTC**: Eğer kullanıyorsanız, Safari'de bazı WebRTC özellikleri sınırlı olabilir
3. **File API**: Safari'de file picker davranışı biraz farklı olabilir

## 🔧 Safari Debug

### Safari Developer Tools
1. Safari > Preferences > Advanced > "Show Develop menu"
2. Develop > Show Web Inspector
3. Console'da hataları görebilirsiniz

### Flutter Web Inspector
```bash
flutter run -d chrome --web-renderer canvaskit
# Sonra Safari'de aynı URL'i aç
```

## 📦 Deployment

### Render.com'a Deploy
```bash
flutter build web --release
# build/web klasörünü Render.com'a deploy et
```

### Cloudflare Pages
```bash
flutter build web --release --base-href /
# build/web klasörünü Cloudflare Pages'e deploy et
```

## 🎯 Safari Test Checklist

- [ ] Login/Signup sayfaları çalışıyor mu?
- [ ] Dashboard yükleniyor mu?
- [ ] Firebase Auth çalışıyor mu?
- [ ] Firestore bağlantısı var mı?
- [ ] File upload çalışıyor mu?
- [ ] PWA olarak yüklenebiliyor mu?
- [ ] Offline çalışıyor mu?

## 🐛 Bilinen Safari Sorunları ve Çözümleri

### Sorun: Service Worker çalışmıyor
**Çözüm**: Safari'de Service Worker'ı manuel olarak etkinleştirmek gerekebilir:
- Safari > Preferences > Advanced > "Show Develop menu"
- Develop > Service Workers > Enable

### Sorun: CORS hatası
**Çözüm**: Firebase Storage ve Firestore CORS ayarlarını kontrol edin.

### Sorun: File picker açılmıyor
**Çözüm**: `file_picker` paketi Safari'de çalışır, ancak bazı dosya tipleri sınırlı olabilir.

## 📚 Kaynaklar

- [Flutter Web Documentation](https://docs.flutter.dev/platform-integration/web)
- [Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
