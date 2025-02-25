import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

type DropDownPickerProps = {
  options: { label: string; value: string }[];
  onSelect: (value: string | null) => void;
  style?: object;
  color?: 'blue' | 'grey';
};

const DropDownPicker: React.FC<DropDownPickerProps> = ({ options, onSelect, style, color = 'blue' }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (value: string | null) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.selector} onPress={toggleDropdown}>
        <Text style={styles.text}>{selected ? options.find(opt => opt.value === selected)?.label : '-'}</Text>
        <AntDesign name={isOpen ? 'up' : 'down'} size={16} color={color === 'blue' ? GlobalStyles.blue : GlobalStyles.darkGrey} />
      </Pressable>
      {isOpen && (
        <View style={styles.dropdown}>
          <Pressable 
            style={({ hovered }) => [styles.option, hovered && { backgroundColor: GlobalStyles.blue }]} 
            onPress={() => handleSelect(null)}
          >
            <Text style={styles.text}>-</Text>
          </Pressable>
          {options.map(option => (
            <Pressable 
              key={option.value} 
              style={({ hovered }) => [styles.option, hovered && { backgroundColor: GlobalStyles.blue }]} 
              onPress={() => handleSelect(option.value)}
            >
              <Text style={styles.text}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: GlobalStyles.darkGrey,
    backgroundColor: GlobalStyles.lightGrey,
    fontFamily: GlobalStyles.font,
    fontSize: 16,
    height: 40,
  },
  dropdown: {
    width: 200,
    marginTop: 5,
    borderWidth: 0,
    borderColor: GlobalStyles.darkGrey,
    backgroundColor: 'transparent',
    fontFamily: GlobalStyles.font,
    fontSize: 16,
  },
  option: {
    padding: 3,
    fontFamily: GlobalStyles.font,
    fontSize: 16,
    borderRadius: 15,
    borderBottomColor: 'transparent',
    marginBottom: 5,
  },
  text: {
    color: GlobalStyles.darkGrey,
    backgroundColor:  GlobalStyles.lightGrey,
    borderRadius: 15,
    padding:7,
    fontFamily: GlobalStyles.font,
    fontSize: 12,
  },
});

export default DropDownPicker;
