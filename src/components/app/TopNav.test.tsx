import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import { useHistory } from 'react-router';
import TopNav from './TopNav';

test('renders', () => {
  const { getByText, getByTestId } = render(<TopNav title="test title" />);

  expect(getByText('test title')).toBeVisible();
  expect(getByTestId('topnav-profile')).toBeVisible();
});

test('open profile menu', () => {
  const historyRef: { history: any } = { history: null };
  const { getByTestId } = render(<TopNav title="test title" />, {
    useHook: () => {
      historyRef.history = useHistory();
    },
  });

  fireEvent.click(getByTestId('topnav-profile'));
  expect(historyRef.history.location.hash).toEqual('#profile');
});
