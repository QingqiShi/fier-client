import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import { Language } from '@material-ui/icons';
import LanguageSelector from './LanguageSelector';
import useTexts from 'hooks/useTexts';

function AppSettings({ className }: { className: string }) {
  const [t] = useTexts();
  return (
    <List
      className={className}
      subheader={<ListSubheader disableSticky>{t['SETTINGS']}</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <Language />
        </ListItemIcon>
        <ListItemText id="settings-language" primary={t['SETTINGS_LANGUAGE']} />
        <ListItemSecondaryAction>
          <LanguageSelector />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

export default AppSettings;
