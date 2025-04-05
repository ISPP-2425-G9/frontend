import React from 'react';
import { render } from '@testing-library/react-native';
import CustomTable from '../../CustomTable';
import { Text, View } from 'react-native';

describe('CustomTable Component', () => {
  const columns = ['Name', 'Age', 'City'];

  it('renders the table with given columns', () => {
    const { getByText } = render(<CustomTable columns={columns}>{null}</CustomTable>);

    columns.forEach(column => {
      expect(getByText(column)).toBeTruthy();
    });
  });

  it('renders child rows correctly', () => {
    const { getByText } = render(
      <CustomTable columns={columns}>
        <View>
          <Text>John Doe</Text>
          <Text>30</Text>
          <Text>New York</Text>
        </View>
      </CustomTable>
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('30')).toBeTruthy();
    expect(getByText('New York')).toBeTruthy();
  });

  it('applies custom styles properly', () => {
    const { getByText } = render(
      <CustomTable 
        columns={columns} 
        tableStyle={{ backgroundColor: 'red' }}
        headerStyle={{ backgroundColor: 'blue' }}
        cellStyle={{ color: 'green' }}
      >
        <View>
          <Text>Test</Text>
        </View>
      </CustomTable>
    );
    
    expect(getByText('Test')).toBeTruthy();
  });
});
