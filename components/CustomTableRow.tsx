import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';


type CustomTableRowProps = {
  rowData: string[];
  columnWidths?: number[];
  rowStyle?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<TextStyle>;
};

const CustomTableRow: React.FC<CustomTableRowProps> = ({ rowData, columnWidths, rowStyle, cellStyle }) => {
  return (
    <View style={[styles.row, rowStyle]}>
      {rowData.map((cell, index) => (
        <Text 
          key={index} 
          style={[
            styles.cell, 
            cellStyle, 
            { flex: columnWidths ? columnWidths[index] : 1 }
          ]}
        >
          {cell}
        </Text>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: GlobalStyles.darkGrey,
    fontFamily: GlobalStyles.font,
  },
});

export default CustomTableRow;
