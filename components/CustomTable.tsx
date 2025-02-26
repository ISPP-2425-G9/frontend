import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';


type CustomTableProps = {
  columns: string[];
  columnWidths?: number[];
  tableStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<TextStyle>;
  children: ReactNode;      // permite recibir filas dentro
};

const CustomTable: React.FC<CustomTableProps> = ({ columns, columnWidths, tableStyle, headerStyle, cellStyle, children }) => {
  return (
    <View style={[styles.table, tableStyle]}>
      <View style={[styles.row, styles.header, headerStyle]}>
        {columns.map((col, index) => (
          <Text 
            key={index} 
            style={[
              styles.cell, 
              styles.headerCell, 
              cellStyle, 
              { flex: columnWidths ? columnWidths[index] : 1 }
            ]}
          >
            {col}
          </Text>
        ))}
      </View>
      {children}
    </View>
  );
};


const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: GlobalStyles.darkGrey,
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  header: {
    backgroundColor: GlobalStyles.darkGrey,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerCell: {
    fontWeight: 'bold',
    color: GlobalStyles.white,
    fontFamily: GlobalStyles.fontBold,
  },
});

export default CustomTable;
