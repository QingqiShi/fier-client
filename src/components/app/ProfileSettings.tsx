import React, { useState } from 'react';
import { List, ListSubheader, TextField } from '@material-ui/core';
import { Email, Face, Lock, TextFields } from '@material-ui/icons';
import ProfileSettingsItem from 'components/app/ProfileSettingsItem';
import useAuth from 'hooks/useAuth';
import useTexts from 'hooks/useTexts';
import useFormInput from 'hooks/useFormInput';

function ProfileSettings({ className }: { className?: string }) {
  const [t] = useTexts();
  const { user, updateName, updateEmail, updatePassword } = useAuth();

  const [name, changeName, setName] = useFormInput(user.name);
  const saveName = () => {
    setExpanded(false);
    updateName(name);
  };

  const [
    currentPassword,
    changeCurrentPassword,
    setCurrentPassword
  ] = useFormInput('');

  const [email, changeEmail, setEmail] = useFormInput(user.email);
  const saveEmail = () => {
    setExpanded(false);
    updateEmail(email, currentPassword);
  };

  const [password, changePassword, setPassword] = useFormInput('');
  const savePassword = () => {
    setExpanded(false);
    updatePassword(password, currentPassword);
  };

  const [expanded, setExpanded] = useState<string | false>('');
  const handleExpandChange = (current: string) => () => {
    setExpanded(val => (val === current ? false : current));
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setCurrentPassword('');
  };

  return (
    <List
      className={className}
      subheader={<ListSubheader disableSticky>{t['PROFILE']}</ListSubheader>}
    >
      <li>
        <ProfileSettingsItem
          disabled={!name || name === user.name}
          expanded={expanded === 'name'}
          icon={<TextFields />}
          label={t['DISPLAY_NAME_LABEL']}
          saveLabel={t['CHANGE_NAME']}
          onChange={handleExpandChange('name')}
          onSave={saveName}
        >
          <TextField
            autoComplete="name"
            label={t['DISPLAY_NAME_LABEL']}
            margin="normal"
            type="text"
            value={name}
            fullWidth
            required
            onChange={changeName}
          />
        </ProfileSettingsItem>

        {false && (
          <ProfileSettingsItem
            expanded={expanded === 'avatar'}
            icon={<Face />}
            label={t['AVATAR_LABEL']}
            saveLabel={t['CHANGE_AVATAR']}
            onChange={handleExpandChange('avatar')}
            onSave={() => setExpanded(false)}
          >
            test
          </ProfileSettingsItem>
        )}

        <ProfileSettingsItem
          disabled={!email || email === user.email || !currentPassword}
          expanded={expanded === 'email'}
          icon={<Email />}
          label={t['EMAIL_LABEL']}
          saveLabel={t['CHANGE_EMAIL']}
          onChange={handleExpandChange('email')}
          onSave={saveEmail}
        >
          <div>
            <TextField
              autoComplete="email"
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
              label={t['CURRENT_PASSWORD_LABEL']}
              margin="normal"
              type="password"
              value={currentPassword}
              fullWidth
              required
              onChange={changeCurrentPassword}
            />
          </div>
        </ProfileSettingsItem>

        <ProfileSettingsItem
          disabled={!password || !currentPassword}
          expanded={expanded === 'password'}
          icon={<Lock />}
          label={t['PASSWORD_LABEL']}
          saveLabel={t['CHANGE_PASSWORD']}
          onChange={handleExpandChange('password')}
          onSave={savePassword}
        >
          <div>
            <TextField
              autoComplete="new-password"
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
              label={t['CURRENT_PASSWORD_LABEL']}
              margin="normal"
              type="password"
              value={currentPassword}
              fullWidth
              required
              onChange={changeCurrentPassword}
            />
          </div>
        </ProfileSettingsItem>
      </li>
    </List>
  );
}

export default ProfileSettings;
