import { StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';


type RouteParams = {
    ReviewObituairesAndMessagesView: {
        certificateId: number;
    };
  };

function ReviewObituairesAndMessagesView() {
    const route = useRoute<RouteProp<RouteParams, 'ReviewObituairesAndMessagesView'>>();
    const { certificateId } = route.params ?? {};

    return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
        <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
        />
        }>
        <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Page Under Construction</ThemedText>
        </ThemedView>
        <ThemedText>This page is under construction and is not available yet.</ThemedText>
        <ThemedText>Información de las esquelas y mensajes del certificado {certificateId}</ThemedText>
    </ParallaxScrollView>
    );
}


const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default withAuth(ReviewObituairesAndMessagesView, [AUTHORITIES.ADMIN]);
