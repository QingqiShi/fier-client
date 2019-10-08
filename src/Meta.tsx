import React from 'react';
import { Helmet } from 'react-helmet-async';
import useTexts from 'hooks/useTexts';
import useRoute from 'hooks/useRoute';

function Meta() {
  const [t] = useTexts();
  const { getPath } = useRoute();

  return (
    <Helmet>
      <meta content={t['META_DESCRIPTION']} name="description" />
      <link href={getPath('/manifest.json')} rel="manifest" />
    </Helmet>
  );
}

export default Meta;
