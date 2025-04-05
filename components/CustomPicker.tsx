import { GlobalStyles } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface PickerItem {
  label: string;
  value: string;
}

interface CustomPickerProps {
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  items: PickerItem[];
  placeholder?: string;
  style?: object;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  placeholder,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Picker
        testID='custom-picker'
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor={GlobalStyles.darkGrey}
      >
        {placeholder && (
          <Picker.Item label={placeholder} value="" />
        )}
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: GlobalStyles.white,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  picker: {
    fontSize: 16,
    fontFamily: GlobalStyles.font,
    color: GlobalStyles.darkGrey,
    backgroundColor: GlobalStyles.lightGrey,
    borderColor: GlobalStyles.lightGrey,
    borderWidth: 0,
    ...Platform.select({
      android: {
        height: 48,
      },
    }),
  },
});

export default CustomPicker;
