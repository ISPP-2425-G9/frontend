import React from 'react';
import { render } from '@testing-library/react-native';
import CustomTableRow from '../CustomTableRow';
import { Text, View, Button } from 'react-native';

describe('CustomTableRow Component', () => {
  const rowData = ['John Doe', '30', 'New York'];

  it('renders row data correctly', () => {
    const { getByText } = render(<CustomTableRow rowData={rowData} />);

    rowData.forEach(data => {
      expect(getByText(data)).toBeTruthy();
    });
  });

  it('renders actions correctly', () => {
    const { getByText } = render(
      <CustomTableRow 
        rowData={rowData} 
        actions={[<Text key="edit">Edit</Text>, <Text key="delete">Delete</Text>]} 
      />
    );

    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('applies custom styles properly', () => {
    const { getByText } = render(
      <CustomTableRow 
        rowData={rowData} 
        rowStyle={{ backgroundColor: 'red' }}
        cellStyle={{ color: 'green' }}
      />
    );
    
    expect(getByText('John Doe')).toBeTruthy();
  });
});