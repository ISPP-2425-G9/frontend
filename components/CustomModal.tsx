import { GlobalStyles } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import Notification from "./Notification";

export type NotificationParams = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
};

export type CustomModalRef = {
  showNotification: (params: NotificationParams) => void;
  hideNotification: () => void;
};

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string | React.ReactElement;
  children?: React.ReactNode;
  style?: ViewStyle;
};

const CustomModal = forwardRef<CustomModalRef, ModalProps>(
  ({ visible, onClose, title, children, style }, ref) => {
    const [notif, setNotif] = useState<NotificationParams | null>(null);

    const showNotification = (params: NotificationParams) => {
      setNotif(params);
    };

    const hideNotification = () => {
      setNotif(null);
    };

    useImperativeHandle(ref, () => ({
      showNotification,
      hideNotification
    }));

    return (
      <Modal testID="custom-modal" visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          {notif && (
            <Notification
              message={notif.message}
              type={notif.type}
              duration={notif.duration}
              onHide={hideNotification}
            />
          )}
          <View style={[styles.modalContainer, style]}>
            <Pressable
              testID="close-button"
              style={styles.closeButton}
              onPress={() => {
                onClose();
                hideNotification();
              }}
            >
              <AntDesign name="close" size={24} color="#434343" />
            </Pressable>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.content}>
              {children}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "auto",
    backgroundColor: GlobalStyles.white,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    paddingBottom: 30,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.darkGrey,
    marginBottom: 15,
    textAlign: "center",
    marginTop: 20
  },
  content: {
    top: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default CustomModal;