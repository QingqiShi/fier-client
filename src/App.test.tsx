import React from 'react';
import { act, render } from '@testing-library/react';
import App from './App';

test('renders without blowing up', () => {
  render(<App />);
});

test('renders dark mode without blowing up', () => {
  // @ts-ignore
  window.matchMedia = jest.fn(() => ({
    matches: true,
    addListener: jest.fn()
  }));
  render(<App />);
});

test('switches to dark mode without blowing up', () => {
  const mockMediaListener = jest.fn();
  // @ts-ignore
  window.matchMedia = jest.fn(() => ({
    matches: false,
    addListener: mockMediaListener
  }));
  render(<App />);

  // Switch to dark mode
  act(() => {
    mockMediaListener.mock.calls[0][0]({ matches: true });
  });

  // Switch to light mode
  act(() => {
    mockMediaListener.mock.calls[0][0]({ matches: false });
  });
});
