#!/bin/bash

echo "🔧 Flutter module sorununu düzeltiyorum..."

cd /Users/selim/Desktop/github/SoftielClientHub

# Xcode'u kapat
echo "📱 Xcode'u kapatıyorum..."
killall Xcode 2>/dev/null || true

# Flutter temizliği
echo "🧹 Flutter clean..."
flutter clean

# Bağımlılıkları güncelle
echo "📥 Flutter pub get..."
flutter pub get

# iOS pod'larını yeniden yükle
echo "🍎 Pod install..."
cd ios
export LANG=en_US.UTF-8
pod install

# Xcode derived data'yı temizle
echo "🗑️  Xcode cache temizleniyor..."
rm -rf ~/Library/Developer/Xcode/DerivedData/Runner-*

# Flutter framework'ü kontrol et
echo "✅ Flutter framework kontrolü..."
if [ -d "/Users/selim/development/flutter/bin/cache/artifacts/engine/ios/Flutter.xcframework" ]; then
    echo "✅ Flutter framework bulundu"
else
    echo "⚠️  Flutter framework bulunamadı, precache yapılıyor..."
    flutter precache --ios
fi

echo ""
echo "✅ Tamamlandı!"
echo ""
echo "Şimdi:"
echo "1. Xcode'da Runner.xcworkspace dosyasını açın"
echo "2. Product > Clean Build Folder (⇧⌘K)"
echo "3. Product > Build (⌘B)"






