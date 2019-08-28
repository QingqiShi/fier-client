import React from 'react';
import { render } from '@testing-library/react';
import TopNav from './TopNav';

describe('TopNav', () => {
  it('renders title', () => {
    const { getByText } = render(<TopNav title="test title" />);
    expect(getByText('test title')).toBeInTheDocument();
  });

  it('renders account button', () => {
    const { getByTestId } = render(<TopNav title="test title" />);
    expect(getByTestId('account-icon-button')).toBeInTheDocument();
  });

  it('renders add button', () => {
    const { getByTestId } = render(<TopNav title="test title" />);
    expect(getByTestId('add-icon-button')).toBeInTheDocument();
  });
});
