import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Typography
} from '@material-ui/core';
import { Language, Person } from '@material-ui/icons';
import SlideModal from 'components/base/SlideModal';
import LanguageSelector from 'components/app/LanguageSelector';
import useTexts from 'hooks/useTexts';
import useAuth from 'hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      textAlign: 'center'
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

function ProfileMenu({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles();
  const [t] = useTexts();
  const { user, signOut } = useAuth();

  return (
    <SlideModal open={open} onClose={onClose}>
      <Avatar className={classes.avatar}>
        <Person className={classes.avatarIcon} />
      </Avatar>
      <Typography variant="h5" align="center" paragraph>
        {user.name}
      </Typography>

      <List
        subheader={<ListSubheader>{t['SETTINGS']}</ListSubheader>}
        className={classes.list}
      >
        <ListItem>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText
            id="settings-language"
            primary={t['SETTINGS_LANGUAGE']}
          />
          <ListItemSecondaryAction>
            <LanguageSelector />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <div className={classes.center}>
        <Button color="secondary" onClick={() => signOut()}>
          {t['SIGN_OUT']}
        </Button>
      </div>
    </SlideModal>
  );
}

export default ProfileMenu;
