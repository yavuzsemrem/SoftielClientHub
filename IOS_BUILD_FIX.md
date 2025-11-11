# 🔧 iOS Build Hatası - Code Signing Çözümü

## ❌ Hata

```
No valid code signing certificates were found
Error: No development certificates available to code sign app for device deployment
```

## ✅ Çözüm Seçenekleri

### Seçenek 1: iOS Simulator Kullan (Önerilen - Code Signing Gerektirmez)

iOS Simulator code signing gerektirmez, hemen test edebilirsiniz.

#### Adımlar:

1. **iOS Simulator'ı açın**:
   ```bash
   open -a Simulator
   ```

2. **Mevcut simulator'ları kontrol edin**:
   ```bash
   flutter devices
   ```

3. **Simulator'da çalıştırın**:
   ```bash
   flutter run -d "iPhone 15 Pro"  # veya başka bir simulator
   ```

**Avantajlar:**
- ✅ Code signing gerekmez
- ✅ Hemen test edebilirsiniz
- ✅ Ücretsiz

### Seçenek 2: Gerçek iOS Cihazda Çalıştırma (Code Signing Gerekli)

Gerçek iPhone/iPad'de test etmek için Apple Developer hesabı gerekir.

#### Adımlar:

1. **Xcode'u açın**:
   ```bash
   open ios/Runner.xcworkspace
   ```

2. **Xcode'da ayarlar**:
   - Sol tarafta **Runner** projesini seçin
   - **Runner** target'ını seçin
   - **Signing & Capabilities** sekmesine gidin
   - **Team** dropdown'ından Apple ID'nizi seçin
     - Eğer yoksa: **Add Account** → Apple ID ile giriş yapın
   - **Automatically manage signing** checkbox'ını işaretleyin
   - Xcode otomatik olarak certificate ve provisioning profile oluşturacak

3. **Bundle ID kontrolü**:
   - Bundle ID benzersiz olmalı
   - Mevcut: `com.softiel.softielClientHub`
   - Eğer çakışma varsa değiştirin

4. **Cihazı bağlayın**:
   - iPhone/iPad'i USB ile Mac'e bağlayın
   - Cihazda **Settings > General > Device Management** > Sertifikayı trust edin

5. **Flutter'da çalıştırın**:
   ```bash
   flutter run -d <device-id>
   ```

#### Apple Developer Account Gereksinimleri:

- **Ücretsiz Apple ID**: Geliştirme için yeterli (7 günlük sertifika)
- **Paid Developer Account** ($99/yıl): Production için gerekli

### Seçenek 3: Web'de Test Et (En Kolay)

iOS'a ihtiyacınız yoksa, web'de test edebilirsiniz:

```bash
flutter run -d chrome
# veya
flutter run -d safari
```

## 🎯 Öneri

**Şu an için**: Web'de test edin (Chrome veya Safari)
```bash
flutter run -d chrome
```

**iOS test için**: iOS Simulator kullanın (code signing gerektirmez)
```bash
open -a Simulator
flutter run -d "iPhone 15 Pro"
```

**Production için**: Gerçek cihazda test etmek istiyorsanız Xcode'da team ayarlayın.

## 📋 Hızlı Kontrol

### Mevcut cihazları görmek:
```bash
flutter devices
```

### iOS Simulator'ı açmak:
```bash
open -a Simulator
```

### Web'de çalıştırmak:
```bash
flutter run -d chrome
```

## ⚠️ Önemli Notlar

1. **iOS Simulator**: Code signing gerektirmez, hemen kullanabilirsiniz
2. **Gerçek Cihaz**: Apple Developer hesabı gerekir (ücretsiz Apple ID yeterli)
3. **Web**: Hiçbir sertifika gerektirmez, en kolay test yöntemi

## 🔍 Sorun Giderme

### Sorun: "No devices found"
**Çözüm**: 
- iOS Simulator'ı açın: `open -a Simulator`
- Cihazı kontrol edin: `flutter devices`

### Sorun: "Team not found"
**Çözüm**: 
- Xcode > Preferences > Accounts > Apple ID ekleyin
- Runner target > Signing & Capabilities > Team seçin

### Sorun: "Bundle ID already exists"
**Çözüm**: 
- `ios/Runner.xcodeproj/project.pbxproj` dosyasında Bundle ID'yi değiştirin
- Veya Xcode'da Signing & Capabilities'den değiştirin

## 📚 Kaynaklar

- [Flutter iOS Setup](https://docs.flutter.dev/get-started/install/macos#ios-setup)
- [Xcode Signing Guide](https://developer.apple.com/documentation/xcode/managing-your-team-signing-assets)

