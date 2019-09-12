import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import TopNav from './TopNav';

test('renders', () => {
  const { getByText, getByTestId } = render(<TopNav title="test title" />);

  expect(getByText('test title')).toBeVisible();
  expect(getByTestId('topnav-profile')).toBeVisible();
  expect(getByTestId('topnav-add')).toBeVisible();
});

test('open profile menu', () => {
  const { getByText, getByTestId } = render(<TopNav title="test title" />);

  fireEvent.click(getByTestId('topnav-profile'));
  expect(getByText('fier')).toBeVisible();
});

test('open create modal', () => {
  const { getByText, getByTestId } = render(<TopNav title="test title" />);

  fireEvent.click(getByTestId('topnav-add'));
  expect(getByText('1')).toBeVisible();
});
