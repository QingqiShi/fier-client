import React, { useState } from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import ProfileSettingsItem from './ProfileSettingsItem';

const MockIcon = () => <i>mock icon</i>;

jest.useFakeTimers();

test('expand when clicked', () => {
  const { getByText } = render(
    <ProfileSettingsItem icon={<MockIcon />} label="test label">
      content
    </ProfileSettingsItem>
  );

  expect(getByText('mock icon')).toBeInTheDocument();
  expect(getByText('test label')).toBeInTheDocument();
  expect(getByText('content')).not.toBeVisible();

  fireEvent.click(getByText('test label'));
  expect(getByText('content')).toBeVisible();
  expect(getByText('Save')).toBeVisible();
});

test('controled expansion', () => {
  const TestComponent = () => {
    const [expanded, setExpanded] = useState(true);
    return (
      <ProfileSettingsItem
        expanded={expanded}
        icon={<MockIcon />}
        label="test label"
        onChange={() => setExpanded((val) => !val)}
      >
        content
      </ProfileSettingsItem>
    );
  };
  const { getByText } = render(<TestComponent />);

  expect(getByText('content')).toBeVisible();

  fireEvent.click(getByText('test label'));
  jest.runAllTimers();
  expect(getByText('content')).not.toBeVisible();
});

test('show specified ', () => {
  const { getByText } = render(
    <ProfileSettingsItem
      actionLabel="confirm"
      icon={<MockIcon />}
      label="test label"
    >
      content
    </ProfileSettingsItem>
  );

  fireEvent.click(getByText('test label'));
  expect(getByText('confirm')).toBeVisible();
});
