import { Image, StyleSheet, Platform} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomTextInput } from '@/components/CustomTextInput';
import DropDownPicker from '@/components/DropDownPicker';
import CustomButton from '@/components/CustomButton';
import ImageWithText from '@/components/ImageWithText';
import CustomModal from '@/components/CustomModal';
import React, { useState } from 'react';

export default function HomeScreen() {

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <CustomTextInput placeholder="Test - Type something..." />
      <DropDownPicker 
        options={[
          { label: 'Opción 1', value: 'opcion1' },
          { label: 'Opción 2', value: 'opcion2' },
          { label: 'Opción 3', value: 'opcion3' },
        ]}
        onSelect={(value) => console.log(value)}
        color="grey"
      />
      <CustomButton title="Test - Press me" onPress={() => console.log('Button pressed')} style={{width:150}}/>
      <CustomButton title="Test - Press me" onPress={() => console.log('Button pressed')} color="red" />
      <CustomButton title="Test - Press me" onPress={() => console.log('Button pressed')} color="grey"/>
      <CustomButton title="Test - Press me" onPress={() => console.log('Button pressed')} color="white"/>
      <ImageWithText image={require('@/assets/images/caronte_azul.png')} text="Imagen local" />
      <ImageWithText image={require('@/assets/images/caronte_azul.png')} text=""/>
      
      <CustomButton title="Open Modal" onPress={() => { setModalVisible(true) }}/>
      <CustomModal 
      visible={modalVisible} 
      onClose={() => {
        console.log("Modal close")
        setModalVisible(false)
      }} 
      title="Test Modal">
        <CustomButton title="Test - Press me" onPress={() => console.log('Button pressed')} color="red" />
      </CustomModal>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
