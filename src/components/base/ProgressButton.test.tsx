import React from 'react';
import { render } from 'testUtils';
import ProgressButton from './ProgressButton';

describe('ProgressButton', () => {
  it('disables when loading', () => {
    const { getByText } = render(<ProgressButton loading>test</ProgressButton>);
    expect(getByText('test')).toBeDisabled();
  });

  it('enables button when not loading', () => {
    const { getByText } = render(
      <ProgressButton loading={false}>test</ProgressButton>
    );
    expect(getByText('test')).not.toBeDisabled();
  });
});
