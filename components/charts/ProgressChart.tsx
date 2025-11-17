import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressChartProps {
  progress: number;
  height?: number;
  showLabel?: boolean;
  colors?: string[];
}

export default function ProgressChart({
  progress,
  height = 10,
  showLabel = false,
  colors = ['#4299e1', '#667eea'],
}: ProgressChartProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Progress</Text>
          <Text style={styles.value}>{clampedProgress}%</Text>
        </View>
      )}
      <View style={[styles.progressBar, { height }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${clampedProgress}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#4299e1',
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});

