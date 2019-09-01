import React from 'react';
import { render } from 'testUtils';
import SlideModal from './SlideModal';

describe('SlideModal', () => {
  it('renders title', () => {
    const { getByText } = render(
      <SlideModal open={true} title="Test Title" onClose={() => {}}>
        test
      </SlideModal>
    );
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children', () => {
    const { getByText } = render(
      <SlideModal open={true} title="Test" onClose={() => {}}>
        test children
      </SlideModal>
    );
    expect(getByText('test children')).toBeInTheDocument();
  });
});
