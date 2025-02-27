import { View } from 'react-native';
import LogoutButton from '@/components/LogoutButton';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LogoutButton />
    </View>
  );
} 