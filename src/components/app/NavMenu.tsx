import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import SlideModal from 'components/base/SlideModal';
import ProfileSettings from 'components/app/ProfileSettings';
import AppSettings from 'components/app/AppSettings';
import useTexts from 'hooks/useTexts';
import useAuth from 'hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logOutContainer: {
      textAlign: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)'
    },
    avatar: {
      backgroundColor: theme.palette.grey[600],
      margin: '0 auto 10px',
      width: 150,
      height: 150
    },
    avatarIcon: {
      width: '70%',
      height: 'auto',
      padding: '15% 0'
    },
    list: {
      marginBottom: 20
    }
  })
);

function NavMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const classes = useStyles();
  const [t] = useTexts();
  const { user, signOut } = useAuth();

  return (
    <SlideModal open={open} title={t['APP_NAME']} onClose={onClose}>
      <Avatar className={classes.avatar}>
        <Person className={classes.avatarIcon} />
      </Avatar>
      <Typography align="center" variant="h5" paragraph>
        {user.name}
      </Typography>

      <ProfileSettings className={classes.list} />
      <AppSettings className={classes.list} />

      <div className={classes.logOutContainer}>
        <Button color="secondary" onClick={() => signOut()}>
          {t['SIGN_OUT']}
        </Button>
      </div>
    </SlideModal>
  );
}

export default NavMenu;
