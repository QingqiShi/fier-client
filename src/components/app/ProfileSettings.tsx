import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List, ListSubheader, TextField } from '@material-ui/core';
import { Email, Face, Lock, TextFields } from '@material-ui/icons';
import ProfileSettingsItem from 'components/app/ProfileSettingsItem';
import useAuth from 'hooks/useAuth';
import useTexts from 'hooks/useTexts';
import useFormInput from 'hooks/useFormInput';

const useStyles = makeStyles(() =>
  createStyles({ fullWidth: { width: '100%' } })
);

function ProfileSettings({ className }: { className?: string }) {
  const [t] = useTexts();
  const classes = useStyles();
  const { user, updateName, updateEmail, updatePassword } = useAuth();

  const [expanded, setExpanded] = useState<string | false>('');
  const handleSave = (callback: () => void) => () => {
    setExpanded(false);
    callback();
  };

  const [currentPass, changeCurrentPass, setCurrentPass] = useFormInput('');

  const [name, changeName, setName] = useFormInput(user.name);
  const saveName = handleSave(() => updateName(name));

  const [email, changeEmail, setEmail] = useFormInput(user.email);
  const saveEmail = handleSave(() => updateEmail(email, currentPass));

  const [password, changePassword, setPassword] = useFormInput('');
  const savePassword = handleSave(() => updatePassword(password, currentPass));

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setCurrentPass('');
  }, [
    expanded,
    setCurrentPass,
    setEmail,
    setName,
    setPassword,
    user.email,
    user.name
  ]);

  return (
    <List
      className={className}
      subheader={<ListSubheader disableSticky>{t['PROFILE']}</ListSubheader>}
    >
      <li>
        <ProfileSettingsItem
          actionLabel={t['CHANGE_NAME']}
          disabled={!name || name === user.name}
          expanded={expanded === 'name'}
          icon={<TextFields />}
          label={t['DISPLAY_NAME_LABEL']}
          onChange={() => setExpanded(expanded === 'name' ? false : 'name')}
          onSave={saveName}
        >
          <form className={classes.fullWidth}>
            <TextField
              autoComplete="name"
              id="profile-update-name"
              label={t['DISPLAY_NAME_LABEL']}
              margin="normal"
              type="text"
              value={name}
              fullWidth
              required
              onChange={changeName}
            />
          </form>
        </ProfileSettingsItem>

        {false && (
          <ProfileSettingsItem
            actionLabel={t['CHANGE_AVATAR']}
            expanded={expanded === 'avatar'}
            icon={<Face />}
            label={t['AVATAR_LABEL']}
            onChange={() =>
              setExpanded(expanded === 'avatar' ? false : 'avatar')
            }
            onSave={() => setExpanded(false)}
          >
            test
          </ProfileSettingsItem>
        )}

        <ProfileSettingsItem
          actionLabel={t['CHANGE_EMAIL']}
          disabled={!email || email === user.email || !currentPass}
          expanded={expanded === 'email'}
          icon={<Email />}
          label={t['EMAIL_LABEL']}
          onChange={() => setExpanded(expanded === 'email' ? false : 'email')}
          onSave={saveEmail}
        >
          <form className={classes.fullWidth}>
            <TextField
              autoComplete="email"
              id="profile-update-email"
              label={t['EMAIL_LABEL']}
              margin="normal"
              type="email"
              value={email}
              fullWidth
              required
              onChange={changeEmail}
            />
            <TextField
              autoComplete="current-password"
              id="profile-update-email-password"
              label={t['CURRENT_PASSWORD_LABEL']}
              margin="normal"
              type="password"
              value={currentPass}
              fullWidth
              required
              onChange={changeCurrentPass}
            />
          </form>
        </ProfileSettingsItem>

        <ProfileSettingsItem
          actionLabel={t['CHANGE_PASSWORD']}
          disabled={!password || !currentPass}
          expanded={expanded === 'password'}
          icon={<Lock />}
          label={t['PASSWORD_LABEL']}
          onChange={() =>
            setExpanded(expanded === 'password' ? false : 'password')
          }
          onSave={savePassword}
        >
          <form className={classes.fullWidth}>
            <TextField
              autoComplete="new-password"
              id="profile-update-password"
              label={t['NEW_PASSWORD_LABEL']}
              margin="normal"
              type="password"
              value={password}
              fullWidth
              required
              onChange={changePassword}
            />
            <TextField
              autoComplete="current-password"
              id="profile-update-password-password"
              label={t['CURRENT_PASSWORD_LABEL']}
              margin="normal"
              type="password"
              value={currentPass}
              fullWidth
              required
              onChange={changeCurrentPass}
            />
          </form>
        </ProfileSettingsItem>
      </li>
    </List>
  );
}

export default ProfileSettings;
