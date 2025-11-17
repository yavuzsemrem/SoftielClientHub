import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocument } from '@/firebase/firestore';
import { useState } from 'react';

export default function NewUserScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [company, setCompany] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createDocument('users', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      Alert.alert('Başarılı', 'Kullanıcı oluşturuldu', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Hata', error.message || 'Kullanıcı oluşturulamadı');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı gereklidir');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Hata', 'Email gereklidir');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Hata', 'Şifre gereklidir');
      return;
    }

    // UID oluştur (basit bir yöntem, production'da daha güvenli olmalı)
    const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const userData: any = {
      uid,
      name: name.trim(),
      displayName: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(), // Production'da hash kullanılmalı
      role,
      isActive: true,
      loginAttempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: '',
    };

    if (company.trim()) {
      userData.company = company.trim();
    }

    createMutation.mutate(userData);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-text mb-6">Yeni Kullanıcı</Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Ad *</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={name}
            onChangeText={setName}
            placeholder="Kullanıcı adı"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Email *</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Şifre *</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            secureTextEntry
          />
          <Text className="text-xs text-gray-400 mt-1">
            Production'da şifre hash'lenmelidir
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-2">Rol *</Text>
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
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-500 mb-2">Şirket (Opsiyonel)</Text>
          <TextInput
            className="bg-surface border border-gray-300 rounded-lg px-4 py-3 text-text"
            value={company}
            onChangeText={setCompany}
            placeholder="Şirket adı"
          />
        </View>

        <TouchableOpacity
          className="bg-primary rounded-lg py-4 mb-4"
          onPress={handleCreate}
          disabled={createMutation.isPending}
        >
          <Text className="text-center text-white font-semibold text-lg">
            {createMutation.isPending ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
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

