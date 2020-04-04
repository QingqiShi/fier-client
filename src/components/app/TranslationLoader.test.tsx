import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from 'testUtils';
import i18n from 'stores/i18n';
import useText from 'hooks/useTexts';
import TranslationLoader from './TranslationLoader';

const Component = () => {
  const [t] = useText();
  return (
    <div>
      <TranslationLoader>
        <span>{t['DASHBOARD']}</span>
      </TranslationLoader>
    </div>
  );
};

test('load english', async () => {
  const { getByText } = render(<Component />, {
    stores: [i18n],
    translations: false,
  });
  await waitFor(() => {
    expect(getByText('Dashboard')).toBeInTheDocument();
  });
});
