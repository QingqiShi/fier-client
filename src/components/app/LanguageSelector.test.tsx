import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import LanguageSelector from './LanguageSelector';

const mockSettings = [{ locale: 'zh' }, { setLocale: jest.fn() }];
jest.mock('stores/settings', () => ({
  __esModule: true,
  default: {
    useStore: () => mockSettings
  }
}));

test('select language using flags', () => {
  const { getByText, getByRole } = render(<LanguageSelector />);
  expect(getByText('🇨🇳')).toBeInTheDocument();

  fireEvent.click(getByRole('button'));
  fireEvent.click(getByText('English'));

  expect(mockSettings[1].setLocale).toHaveBeenCalledWith('en');
});
