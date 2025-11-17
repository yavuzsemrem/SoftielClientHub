import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Tab {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  projectId: string;
}

export default function TabNavigation({ tabs, projectId }: TabNavigationProps) {
  const router = useRouter();
  const segments = useSegments();
  const pathname = segments.length > 0 ? '/' + segments.join('/') : '/';

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const fullPath = `/projects/${projectId}${tab.path}`;
          const isActive = pathname === fullPath || pathname?.startsWith(fullPath + '/');

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => router.push(fullPath)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={isActive ? '#4299e1' : '#a0aec0'}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a0aec0',
  },
  tabLabelActive: {
    color: '#4299e1',
    fontWeight: '700',
  },
});

