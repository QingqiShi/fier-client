import React from 'react';
import Button from '@material-ui/core/Button';
import TopNav from 'components/TopNav';
import useAuth from 'hooks/useAuth';

function Charts() {
  const { signOut } = useAuth();
  return (
    <div style={{ padding: '5em 0' }}>
      <TopNav title="Charts" />
      <Button onClick={() => signOut()}>log out</Button>
    </div>
  );
}

export default Charts;
