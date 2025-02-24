import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: GlobalStyles.darkGrey,
    backgroundColor: GlobalStyles.white,
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: GlobalStyles.darkGrey,
    backgroundColor: GlobalStyles.white,
  },
  option: {
    padding: 10,
  },
  text: {
    color: GlobalStyles.darkGrey,
  },
});

export default DropDownPicker;
