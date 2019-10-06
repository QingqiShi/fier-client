import React from 'react';
import { Helmet } from 'react-helmet-async';
import useTexts from 'hooks/useTexts';

function Meta() {
  const [t] = useTexts();

  return (
    <Helmet>
      <meta content={t['META_DESCRIPTION']} name="description"></meta>
    </Helmet>
  );
}

export default Meta;
