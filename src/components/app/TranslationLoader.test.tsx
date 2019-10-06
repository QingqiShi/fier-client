import React from 'react';
import { wait } from '@testing-library/react';
import { render } from 'testUtils';
import i18n from 'stores/i18n';
import useText from 'hooks/useTexts';
import TranslationLoader from './TranslationLoader';

const Component = () => {
  const [t] = useText();
  return (
    <div>
      <TranslationLoader />
      <span>{t['DASHBOARD']}</span>
    </div>
  );
};

test('load english', async () => {
  const { getByText } = render(<Component />, [i18n], { translations: false });
  await wait();
  expect(getByText('Dashboard')).toBeInTheDocument();
});
