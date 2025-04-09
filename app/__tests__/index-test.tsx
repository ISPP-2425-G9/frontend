import React from 'react';
import { render } from '@testing-library/react-native';
import Index from '../index';

const mockRedirect = jest.fn();
jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    mockRedirect(href);
    return null;
  },
}));

describe('Index', () => {
  beforeEach(() => {
    mockRedirect.mockClear();
  });

  it('should redirect to /home', () => {
    render(<Index />);
    
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith('/home');
  });
}); 