# 🔧 iOS Swift Compiler Hatası - Çözüm

## ❌ Hata

```
Swift Compiler Error (Xcode): Expressions are not allowed at the top level
/ios/Pods/FirebaseSharedSwift/FirebaseSharedSwift/Sources/third_party/FirebaseDataEncoder/FirebaseDataEncoder.swift:2613:0
```

## ✅ Çözüm

Bu hata genellikle CocoaPods cache veya pod versiyonları arasındaki uyumsuzluktan kaynaklanır.

### Adım 1: Pod'ları Temizle

```bash
cd ios
rm -rf Pods Podfile.lock .symlinks
```

### Adım 2: Flutter Clean

```bash
cd ..
flutter clean
```

### Adım 3: Flutter Pub Get

```bash
flutter pub get
```

### Adım 4: Pod Install (UTF-8 Encoding ile)

```bash
cd ios
export LANG=en_US.UTF-8
pod install --repo-update
```

### Adım 5: Xcode Build Cache Temizle (Opsiyonel)

```bash
# Xcode'u kapatın
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Adım 6: Tekrar Deneyin

```bash
cd ..
flutter run -d chrome  # Web'de test için
# veya
flutter run -d "iPhone 15 Pro"  # Simulator için
```

## 🔍 Alternatif Çözümler

### Çözüm 1: Pod Cache Temizle

```bash
pod cache clean --all
cd ios
pod install
```

### Çözüm 2: Xcode'da Clean Build

1. Xcode'u açın: `open ios/Runner.xcworkspace`
2. **Product > Clean Build Folder** (Shift + Cmd + K)
3. Xcode'u kapatın
4. Flutter'da tekrar deneyin

### Çözüm 3: iOS Deployment Target Güncelle

`ios/Podfile` dosyasında minimum iOS versiyonunu kontrol edin:

```ruby
platform :ios, '12.0'  # veya daha yeni
```

## ⚠️ Encoding Sorunu

Eğer CocoaPods encoding hatası alıyorsanız:

```bash
export LANG=en_US.UTF-8
pod install
```

Kalıcı çözüm için `~/.zshrc` veya `~/.bash_profile` dosyasına ekleyin:

```bash
export LANG=en_US.UTF-8
```

## 📋 Hızlı Komutlar

```bash
# Tüm temizleme işlemleri
cd /Users/selim/Desktop/github/SoftielClientHub
flutter clean
cd ios && rm -rf Pods Podfile.lock .symlinks && cd ..
flutter pub get
cd ios && export LANG=en_US.UTF-8 && pod install && cd ..
```

## ✅ Sonuç

Bu adımları uyguladıktan sonra iOS build çalışmalı. Eğer hala sorun varsa, web'de test edebilirsiniz:

```bash
flutter run -d chrome
```

