import React from 'react';
import Button from '@material-ui/core/Button';
import TopNav from 'components/TopNav';
import useAuth from 'hooks/useAuth';
import useTexts from 'hooks/useTexts';

function Dash() {
  const [t] = useTexts();
  const { signOut } = useAuth();
  return (
    <div style={{ padding: '5em 0' }}>
      <TopNav title={t['DASHBOARD']} />
      <Button onClick={() => signOut()}>log out</Button>
    </div>
  );
}

export default Dash;
