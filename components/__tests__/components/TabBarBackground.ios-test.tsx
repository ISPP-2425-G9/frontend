import React from 'react';
import { render } from '@testing-library/react-native';
import BlurTabBarBackground, { useBottomTabOverflow } from '../../ui/TabBarBackground.ios';
import { SafeAreaProvider } from 'react-native-safe-area-context';

describe('BlurTabBarBackground Component', () => {
  it('renders correctly with blur effect', () => {
    const { toJSON } = render(
      <SafeAreaProvider>
        <BlurTabBarBackground />
      </SafeAreaProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

