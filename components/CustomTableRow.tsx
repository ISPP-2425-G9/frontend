import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import { GlobalStyles } from '@/constants/Colors';


type CustomTableRowProps = {
  rowData: string[];
  columnWidths?: number[];
  rowStyle?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<TextStyle>;
  actions?: ReactNode[];
};

const CustomTableRow: React.FC<CustomTableRowProps> = ({ rowData, columnWidths, rowStyle, cellStyle, actions }) => {
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
      {actions && actions.length > 0 && (
        <View style={[styles.cell, styles.actions]}>
          {actions.map((action, index) => (
            <View key={index} style={styles.actionWrapper}>
              {action}
            </View>
          ))}
        </View>
      )}
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
  actions: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actionWrapper: {
    marginHorizontal: 5,
  },
});

export default CustomTableRow;
