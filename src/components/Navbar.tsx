import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Navbar() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#1a1816] border-b border-[#2a2825]">
      <View className="flex-row gap-4">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text className="text-[#7a9e78]">home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text className="text-[#7a9e78]">about</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}