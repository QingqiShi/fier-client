import React from 'react';
import { render } from 'testUtils';
import OverlayContainer from './OverlayContainer';

describe('OverlayContainer', () => {
  it('renders children', () => {
    const { getByText } = render(
      <OverlayContainer>test text</OverlayContainer>
    );
    expect(getByText('test text'));
  });
});
