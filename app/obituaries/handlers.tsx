import * as ImagePicker from 'expo-image-picker';
import { useNotification } from '@/context/NotificationContext';

export const pickImage = async (setFormData: Function, formData: any) => {
    const { showNotification } = useNotification();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const allowedFormats = ["png", "jpg", "jpeg"];
      const filteredAssets = result.assets.filter(asset => {
        const fileExtension = asset.mimeType ? asset.mimeType.split("/")[1] : '';
        return allowedFormats.includes(fileExtension);
      });
  
      if (filteredAssets.length === 0) {
        showNotification({
          message: "Solo se permiten imágenes en formato PNG, JPG o JPEG",
          type: "error",
          duration: 2500,
        });
        return;
      }
      setFormData({ ...formData, customImage: result.assets[0].uri });
    }
  };