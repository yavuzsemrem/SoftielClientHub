import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, updateDocument, deleteDocument } from '@/firebase/firestore';
import { useState } from 'react';

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState<'admin' | 'client'>('client');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      // users koleksiyonunda uid veya id ile arama yap
      const userDoc = await getDocument<any>('users', id);
      if (!userDoc) {
        // uid ile arama yap
        const { getDocuments, where } = await import('@/firebase/firestore');
        const users = await getDocuments<any>('users', [where('uid', '==', id)]);
        return users[0] || null;
      }
      return userDoc;
    },
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setName(data.name || data.displayName || '');
        setEmail(data.email || '');
        setIsActive(data.isActive !== false);
        setRole(data.role || 'client');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id && !user?.uid) return false;
      const userId = user.id || user.uid;
      return await updateDocument('users', userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setIsEditing(false);
      Alert.alert('Başarılı', 'Kullanıcı güncellendi');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id && !user?.uid) return false;
      const userId = user.id || user.uid;
      return await deleteDocument('users', userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      router.back();
      Alert.alert('Başarılı', 'Kullanıcı silindi');
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      name,
      email,
      isActive,
      role,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Kullanıcıyı Sil',
      'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Yükleniyor...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">Kullanıcı bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text">Kullanıcı Detayı</Text>
          <View className="flex-row gap-2">
            {isEditing ? (
              <TouchableOpacity
                className="bg-primary rounded-lg px-4 py-2"
                onPress={handleSave}
              >
                <Text className="text-white font-semibold">Kaydet</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-primary rounded-lg px-4 py-2"
                onPress={() => setIsEditing(true)}
              >
                <Text className="text-white font-semibold">Düzenle</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-red-500 rounded-lg px-4 py-2"
              onPress={handleDelete}
            >
              <Text className="text-white font-semibold">Sil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-sm text-gray-500 mb-2">Ad</Text>
          {isEditing ? (
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-text"
              value={name}
              onChangeText={setName}
              placeholder="Kullanıcı adı"
            />
          ) : (
            <Text className="text-lg font-semibold text-text">
              {user.name || user.displayName || 'Kullanıcı'}
            </Text>
          )}
        </View>

        <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-sm text-gray-500 mb-2">Email</Text>
          {isEditing ? (
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-text"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text className="text-lg font-semibold text-text">{user.email}</Text>
          )}
        </View>

        <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-sm text-gray-500 mb-2">Rol</Text>
          {isEditing ? (
            <View className="flex-row gap-4">
              <TouchableOpacity
                className={`flex-1 rounded-lg px-4 py-3 ${
                  role === 'admin' ? 'bg-primary' : 'bg-gray-200'
                }`}
                onPress={() => setRole('admin')}
              >
                <Text
                  className={`text-center font-semibold ${
                    role === 'admin' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  Admin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-lg px-4 py-3 ${
                  role === 'client' ? 'bg-primary' : 'bg-gray-200'
                }`}
                onPress={() => setRole('client')}
              >
                <Text
                  className={`text-center font-semibold ${
                    role === 'client' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  Client
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="text-lg font-semibold text-text">
              {user.role === 'admin' ? 'Admin' : 'Müşteri'}
            </Text>
          )}
        </View>

        <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-500">Aktif</Text>
            {isEditing ? (
              <Switch value={isActive} onValueChange={setIsActive} />
            ) : (
              <View className={`px-3 py-1 rounded-full ${
                user.isActive ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Text className={`text-xs font-semibold ${
                  user.isActive ? 'text-green-700' : 'text-red-700'
                }`}>
                  {user.isActive ? 'Aktif' : 'Pasif'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {user.company && (
          <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">Şirket</Text>
            <Text className="text-lg font-semibold text-text">{user.company}</Text>
          </View>
        )}

        {user.uid && (
          <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">UID</Text>
            <Text className="text-xs font-mono text-text">{user.uid}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

