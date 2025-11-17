import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'completed' | 'pending' | 'in-progress';
}

interface TimelineChartProps {
  items: TimelineItem[];
}

export default function TimelineChart({ items }: TimelineChartProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in-progress':
        return '#4299e1';
      case 'pending':
        return '#a0aec0';
      default:
        return '#a0aec0';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in-progress':
        return 'time';
      case 'pending':
        return 'ellipse-outline';
      default:
        return 'ellipse-outline';
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.timeline}>
            <View
              style={[
                styles.dot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Ionicons
                name={getStatusIcon(item.status) as any}
                size={16}
                color="#ffffff"
              />
            </View>
            {index < items.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      item.status === 'completed'
                        ? getStatusColor(item.status)
                        : 'rgba(255, 255, 255, 0.1)',
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 40,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#718096',
  },
});

