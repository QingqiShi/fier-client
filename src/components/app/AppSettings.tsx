import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from '@material-ui/core';
import { Category, ChevronRight, Language } from '@material-ui/icons';
import LanguageSelector from './LanguageSelector';
import useTexts from 'hooks/useTexts';
import useModalHash, { Modal } from 'hooks/useModalHash';

function AppSettings({ className }: { className: string }) {
  const [t] = useTexts();
  const { open: openCategories } = useModalHash(Modal.SETUP);
  return (
    <List
      className={className}
      subheader={<ListSubheader disableSticky>{t['SETTINGS']}</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <Language />
        </ListItemIcon>
        <ListItemText primary={t['SETTINGS_LANGUAGE']} />
        <ListItemSecondaryAction>
          <LanguageSelector />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button onClick={openCategories}>
        <ListItemIcon>
          <Category />
        </ListItemIcon>
        <ListItemText primary={t['SETUP_CATEGORIES']} />
        <ChevronRight />
      </ListItem>
    </List>
  );
}

export default AppSettings;
