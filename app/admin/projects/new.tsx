import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocument } from '@/firebase/firestore';
import { useState } from 'react';

export default function NewProjectScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'on-hold' | 'cancelled'>('active');
  const [progress, setProgress] = useState('0');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createDocument('projects', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      Alert.alert('Başarılı', 'Proje oluşturuldu', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Hata', error.message || 'Proje oluşturulamadı');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Proje adı gereklidir');
      return;
    }

    const projectData: any = {
      name: name.trim(),
      status,
      progress: parseInt(progress) || 0,
      dueDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (description.trim()) {
      projectData.description = description.trim();
    }

    if (clientId.trim()) {
      projectData.clientId = clientId.trim();
    }

    createMutation.mutate(projectData);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-text mb-6">Yeni Proje</Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Proje Adı *</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={name}
            onChangeText={setName}
            placeholder="Proje adı"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Açıklama</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={description}
            onChangeText={setDescription}
            placeholder="Proje açıklaması"
            multiline
            numberOfLines={4}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Client ID (Opsiyonel)</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={clientId}
            onChangeText={setClientId}
            placeholder="Kullanıcı UID"
          />
          <Text className="text-xs text-gray-400 mt-1">
            Client Hub projesi için kullanıcının UID'sini girin
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Durum</Text>
          <View className="flex-row flex-wrap gap-2">
            {(['active', 'completed', 'on-hold', 'cancelled'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                className={`px-4 py-2 rounded-lg ${
                  status === s ? 'bg-primary' : 'bg-gray-200'
                }`}
                onPress={() => setStatus(s)}
              >
                <Text
                  className={`font-semibold ${
                    status === s ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {s === 'active' ? 'Aktif' : s === 'completed' ? 'Tamamlandı' : s === 'on-hold' ? 'Beklemede' : 'İptal'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-500 mb-2">İlerleme (%)</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={progress}
            onChangeText={setProgress}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          className="bg-primary rounded-lg py-4 mb-4"
          onPress={handleCreate}
          disabled={createMutation.isPending}
        >
          <Text className="text-center text-white font-semibold text-lg">
            {createMutation.isPending ? 'Oluşturuluyor...' : 'Proje Oluştur'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-200 rounded-lg py-4"
          onPress={() => router.back()}
        >
          <Text className="text-center text-gray-700 font-semibold">İptal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

