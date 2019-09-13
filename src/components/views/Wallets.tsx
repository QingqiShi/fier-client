import React from 'react';
import TopNav from 'components/app/TopNav';
import useTexts from 'hooks/useTexts';

function Charts() {
  const [t] = useTexts();
  return (
    <div style={{ padding: '5em 0' }}>
      <TopNav title={t['WALLETS']} />
    </div>
  );
}

export default Charts;
