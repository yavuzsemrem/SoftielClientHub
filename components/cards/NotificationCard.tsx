import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '@/types';

interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'update':
      return 'megaphone-outline';
    case 'approval':
      return 'checkmark-circle-outline';
    case 'message':
      return 'chatbubble-outline';
    case 'task':
      return 'checkbox-outline';
    case 'file':
      return 'document-outline';
    default:
      return 'notifications-outline';
  }
};

const getNotificationIconColor = (type: string) => {
  switch (type) {
    case 'update':
      return '#4299e1';
    case 'approval':
      return '#22c55e';
    case 'message':
      return '#ff9700';
    case 'task':
      return '#667eea';
    case 'file':
      return '#3b82f6';
    default:
      return '#a0aec0';
  }
};

export default function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const iconColor = getNotificationIconColor(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !notification.read && styles.cardUnread,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={[`${iconColor}33`, `${iconColor}11`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.icon}
        >
          <Ionicons
            name={getNotificationIcon(notification.type) as any}
            size={24}
            color={iconColor}
          />
        </LinearGradient>
        <View style={styles.content}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
          <Text style={styles.type}>
            {notification.type === 'update' ? 'Update' :
             notification.type === 'approval' ? 'Approval' :
             notification.type === 'message' ? 'Message' :
             notification.type === 'task' ? 'Task' :
             notification.type === 'file' ? 'File' : 'Notification'}
          </Text>
        </View>
        {!notification.read && (
          <View style={styles.unreadDot} />
        )}
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
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#4299e1',
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    color: '#4299e1',
    fontWeight: '600',
    marginTop: 4,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4299e1',
    marginLeft: 12,
    marginTop: 4,
  },
});

