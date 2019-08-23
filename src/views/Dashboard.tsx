import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useAuth from 'hooks/useAuth';

function Dash() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <Typography variant="h1">
        {user.name || user.email.split('@')[0]}
      </Typography>
      <Button onClick={() => signOut()}>log out</Button>
    </div>
  );
}

export default Dash;
