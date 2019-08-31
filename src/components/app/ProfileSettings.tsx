import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import {
  Email,
  Face,
  Lock,
  NavigateNext,
  TextFields
} from '@material-ui/icons';
import useTexts from 'hooks/useTexts';

function ProfileSettings({ className }: { className?: string }) {
  const [t] = useTexts();
  return (
    <List
      className={className}
      subheader={<ListSubheader disableSticky>{t['PROFILE']}</ListSubheader>}
    >
      <ListItem button>
        <ListItemIcon>
          <TextFields />
        </ListItemIcon>
        <ListItemText id="profile_name" primary={t['PROFILE_NAME']} />
        <ListItemSecondaryAction>
          <NavigateNext />
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <Face />
        </ListItemIcon>
        <ListItemText id="profile_name" primary={t['PROFILE_PICTURE']} />
        <ListItemSecondaryAction>
          <NavigateNext />
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <Email />
        </ListItemIcon>
        <ListItemText id="profile_name" primary={t['PROFILE_EMAIL']} />
        <ListItemSecondaryAction>
          <NavigateNext />
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <Lock />
        </ListItemIcon>
        <ListItemText id="profile_name" primary={t['PROFILE_PASSWORD']} />
        <ListItemSecondaryAction>
          <NavigateNext />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

export default ProfileSettings;
