import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAllUsers } from '@/hooks/useAllUsers';

export default function AdminUsersScreen() {
  const router = useRouter();
  const { users, isLoading } = useAllUsers();

  const clientUsers = users.filter((u: any) => u.role === 'client');
  const adminUsers = users.filter((u: any) => u.role === 'admin');

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text">Tüm Kullanıcılar</Text>
          <TouchableOpacity
            className="bg-primary rounded-lg px-4 py-2"
            onPress={() => router.push('/admin/users/new')}
          >
            <Text className="text-white font-semibold">Yeni Kullanıcı</Text>
          </TouchableOpacity>
        </View>

        {/* Client Users */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-text mb-4">Müşteriler ({clientUsers.length})</Text>
          {isLoading ? (
            <Text className="text-gray-500">Yükleniyor...</Text>
          ) : clientUsers.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center">
              <Text className="text-gray-500">Henüz müşteri bulunmuyor</Text>
            </View>
          ) : (
            clientUsers.map((user: any) => (
              <TouchableOpacity
                key={user.id || user.uid}
                className="bg-surface rounded-lg p-4 mb-3 shadow-sm"
                onPress={() => router.push(`/admin/users/${user.uid || user.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-text">
                      {user.name || user.displayName || 'Kullanıcı'}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">{user.email}</Text>
                    {user.company && (
                      <Text className="text-sm text-gray-500">{user.company}</Text>
                    )}
                  </View>
                  <View className="items-end">
                    <View className={`px-3 py-1 rounded-full ${
                      user.isActive ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        user.isActive ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Admin Users */}
        <View className="mb-4">
          <Text className="text-xl font-semibold text-text mb-4">Adminler ({adminUsers.length})</Text>
          {adminUsers.length === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center">
              <Text className="text-gray-500">Henüz admin bulunmuyor</Text>
            </View>
          ) : (
            adminUsers.map((user: any) => (
              <TouchableOpacity
                key={user.id || user.uid}
                className="bg-surface rounded-lg p-4 mb-3 shadow-sm"
                onPress={() => router.push(`/admin/users/${user.uid || user.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-text">
                      {user.name || user.displayName || 'Admin'}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">{user.email}</Text>
                  </View>
                  <View className="items-end">
                    <View className="px-3 py-1 rounded-full bg-blue-100">
                      <Text className="text-xs font-semibold text-blue-700">Admin</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

