import React, { useState, useCallback } from 'react';
import { Text, View, Platform, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps {
  colors: string[];
  style?: any;
  children: React.ReactNode;
}

export default function GradientText({ colors, style, children }: GradientTextProps) {
  const [textLayout, setTextLayout] = useState({ width: 0, height: 0 });
  const [isMeasured, setIsMeasured] = useState(false);

  if (Platform.OS === 'web') {
    // Web için CSS gradient kullan
    return (
      <Text
        style={[
          style,
          {
            background: `linear-gradient(to right, ${colors.join(', ')})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          },
        ]}
      >
        {children}
      </Text>
    );
  }

  // Native için MaskedView kullan - Text boyutunu ölçerek
  const baseLineHeight = (style?.fontSize || 16) < 20 ? (style?.fontSize || 16) * 1.8 : (style?.fontSize || 16) * 1.5;
  const lineHeight = style?.lineHeight || baseLineHeight;
  
  // Minimum height garantisi
  const minHeight = Math.max(lineHeight, (style?.fontSize || 16) * 1.5, 28);
  const containerHeight = textLayout.height > 0 ? Math.max(textLayout.height, minHeight) : minHeight;
  const containerWidth = textLayout.width > 0 ? textLayout.width : undefined;
  
  const handleTextLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setTextLayout({ width, height });
      setIsMeasured(true);
    }
  }, []);

  // Text style'ını hazırla - Style'ı direkt kullan, sadece gerekli özellikleri override et
  const baseTextStyle = [
    style,
    {
      backgroundColor: 'transparent',
      includeFontPadding: false,
      ...(Platform.OS === 'android' && { textAlignVertical: 'center' }),
    },
  ];

  return (
    <View 
      style={{ 
        position: 'relative',
        height: textLayout.height > 0 ? textLayout.height : containerHeight,
        width: containerWidth || 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Text'i ölçmek için görünmez render et - her zaman render et */}
      <Text
        onLayout={handleTextLayout}
        style={[
          style,
          {
            opacity: 0,
            position: 'absolute',
            zIndex: -1,
            includeFontPadding: false,
          },
        ]}
      >
        {children}
      </Text>
      
      {/* Gradient text - Text boyutu ölçüldükten sonra render et */}
      {isMeasured && textLayout.width > 0 && textLayout.height > 0 ? (
        <MaskedView
          style={{ 
            flexDirection: 'row',
            height: textLayout.height,
            width: containerWidth,
            alignItems: 'center',
          }}
          maskElement={
            <Text 
              style={[
                style,
                {
                  backgroundColor: 'transparent',
                  includeFontPadding: false,
                  ...(Platform.OS === 'android' && { textAlignVertical: 'center' }),
                },
              ]}
            >
              {children}
            </Text>
          }
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: containerWidth,
              height: textLayout.height,
            }}
          />
        </MaskedView>
      ) : (
        // İlk render'da fallback - gradient'in ilk rengini göster
        <Text
          style={[
            style,
            {
              color: colors[0] || '#06b6d4',
              includeFontPadding: false,
            },
          ]}
        >
          {children}
        </Text>
      )}
    </View>
  );
}

