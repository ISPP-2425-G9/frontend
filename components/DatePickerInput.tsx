import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import CustomTextInput from './CustomTextInput'; // Asumo que tienes un componente CustomTextInput

interface DatePickerInputProps {
  placeholder: string;
  type: string;
  editable?: boolean;
  value: Date | string; // La fecha puede ser un Date o un string con formato 'YYYY-MM-DD'
  containerStyle?: StyleProp<ViewStyle>; 
  handleChange: (field: string, value: string) => void;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({containerStyle, placeholder, type, editable = true, value, handleChange }) => {

  const formatDate = (date: Date | string): string => {
    if (typeof date === 'string') return date;
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es base 0
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  return (
    <CustomTextInput
      containerStyle={containerStyle}
      placeholder={placeholder}
      value={formatDate(value)}
      maxLength={10}
      keyboardType="numeric"
      editable={editable}
      onChangeText={(text) => {
        let cleaned = text.replace(/\D/g, '');
        let day = cleaned.slice(0, 2);
        let month = cleaned.slice(2, 4);
        let year = cleaned.slice(4, 8);

        if (day.length === 2) {
          let dayNum = Math.max(1, Math.min(parseInt(day, 10), 31));
          day = dayNum.toString().padStart(2, '0');
        }
        if (month.length === 2) {
          let monthNum = Math.max(1, Math.min(parseInt(month, 10), 12));
          month = monthNum.toString().padStart(2, '0');
        }
        if (year.length === 4) {
          let yearNum = parseInt(year, 10);
          const currentYear = new Date().getFullYear();
          year = Math.min(Math.max(yearNum, 1800), currentYear).toString();
        }

        let formatted = day;
        if (month) formatted += '/' + month;
        if (year) formatted += '/' + year;
        if (formatted.length > 10) formatted = formatted.slice(0, 10);

        const currentDate = new Date();
        const inputDate = new Date(`${year}-${month}-${day}`);

        if (year.length === 4 && inputDate > currentDate) {
          const [curDay, curMonth, curYear] = [
            currentDate.getDate().toString().padStart(2, '0'),
            (currentDate.getMonth() + 1).toString().padStart(2, '0'),
            currentDate.getFullYear()
          ];
          
          formatted = `${curDay}/${curMonth}/${curYear}`;        
        }
        console.log(formatted)

        handleChange(type, formatted);
      }}
    />
  );
};

export default DatePickerInput;
