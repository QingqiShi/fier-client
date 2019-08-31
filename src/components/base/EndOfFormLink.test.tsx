import React from 'react';
import { Route } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import EndOfFormLink from './EndOfFormLink';

describe('EndOfFormLink', () => {
  it('renders children', () => {
    const { getByText } = render(
      <EndOfFormLink to="/">Test link</EndOfFormLink>
    );
    expect(getByText('Test link')).toBeInTheDocument();
  });

  it('redirects when clicked', () => {
    const { getByText } = render(
      <div>
        <EndOfFormLink to="/test">Test link</EndOfFormLink>
        <Route path="/test" render={() => <div>show after click</div>} exact />
      </div>
    );

    fireEvent.click(getByText('Test link'));
    expect(getByText('show after click')).toBeInTheDocument();
  });
});
