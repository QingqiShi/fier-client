import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import TitleBar from './TitleBar';

describe('TitleBar', () => {
  it('renders title', () => {
    const { getByText } = render(<TitleBar title="test title" />);
    expect(getByText('test title')).toBeInTheDocument();
  });

  it('renders left action', () => {
    const { getByText } = render(<TitleBar leftAction="left action" />);
    expect(getByText('left action')).toBeInTheDocument();
  });

  it('renders right action', () => {
    const { getByText } = render(<TitleBar rightAction="right action" />);
    expect(getByText('right action')).toBeInTheDocument();
  });

  it('respond to scroll', () => {
    const { asFragment } = render(<TitleBar rightAction="right action" />);

    const before = asFragment();
    // @ts-ignore
    window.pageYOffset = 100;
    fireEvent.scroll(window);
    const after = asFragment();

    expect(before).not.toEqual(after);
  });
});
