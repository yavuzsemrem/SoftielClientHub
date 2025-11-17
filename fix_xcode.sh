#!/bin/bash

echo "🔧 Xcode build sorunlarını düzeltiyorum..."

cd /Users/selim/Desktop/github/SoftielClientHub

# Flutter temizliği
echo "📦 Flutter clean yapılıyor..."
flutter clean

# Bağımlılıkları güncelle
echo "📥 Bağımlılıklar güncelleniyor..."
flutter pub get

# iOS pod'larını yeniden yükle
echo "🍎 iOS pod'ları yükleniyor..."
cd ios
export LANG=en_US.UTF-8
pod deintegrate
pod install

# Xcode derived data'yı temizle
echo "🧹 Xcode cache temizleniyor..."
rm -rf ~/Library/Developer/Xcode/DerivedData/Runner-*

echo "✅ Tamamlandı! Şimdi Xcode'da Runner.xcworkspace dosyasını açın ve build edin."






