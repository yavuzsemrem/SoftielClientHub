import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ProjectCardProps {
  project: {
    id: string;
    name?: string;
    title?: string;
    progress?: number;
    status?: string;
  };
  onPress: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.name}>{project.name || project.title || 'Project'}</Text>
        <Text style={styles.progress}>{project.progress || 0}%</Text>
      </View>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={['#4299e1', '#667eea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${project.progress || 0}%` }]}
        />
      </View>
      <View style={styles.footer}>
        <Ionicons name="time-outline" size={16} color="#a0aec0" style={styles.icon} />
        <Text style={styles.status}>
          Status: {project.status === 'active' ? 'Active' : project.status || 'Unknown'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  progress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  status: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '500',
  },
});

