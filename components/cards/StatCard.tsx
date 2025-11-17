import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function StatCard({
  label,
  value,
  icon,
  iconColor = '#4299e1',
  onPress,
  variant = 'primary',
}: StatCardProps) {
  const valueColor = variant === 'primary' ? '#4299e1' : '#ff9700';

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <LinearGradient
        colors={[`${iconColor}33`, `${iconColor}11`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </LinearGradient>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    minWidth: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#a0aec0',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

