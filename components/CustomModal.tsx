import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { GlobalStyles } from '@/constants/Colors';

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
};

const CustomModal: React.FC<ModalProps> = ({ visible, onClose, title, children, style }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, style]}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="#434343" />
          </Pressable>

          {title && <Text style={styles.title}>{title}</Text>}

          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: GlobalStyles.lightGrey,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GlobalStyles.darkGrey,
    marginBottom: 15,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
});

export default CustomModal;
