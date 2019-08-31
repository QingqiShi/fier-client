import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Avatar, IconButton } from '@material-ui/core';
import { AddBox, Person } from '@material-ui/icons';
import TitleBar from 'components/base/TitleBar';
import NavMenu from 'components/app/NavMenu';
import useRoute from 'hooks/useRoute';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.grey[600],
      height: 37,
      width: 37
    }
  })
);

const PROFILE_HASH = '#profile';

function TopNav({ title }: { title: string }) {
  const classes = useStyles();
  const { location, history } = useRoute();

  function openProfile() {
    history.push({ ...location, hash: PROFILE_HASH });
  }
  function closeProfile() {
    history.push({ ...location, hash: '' });
  }

  return (
    <>
      <TitleBar
        title={title}
        leftAction={
          <IconButton
            edge="start"
            data-testid="account-icon-button"
            onClick={openProfile}
          >
            <Avatar className={classes.avatar}>
              <Person />
            </Avatar>
          </IconButton>
        }
        rightAction={
          <IconButton edge="end" color="primary" data-testid="add-icon-button">
            <AddBox />
          </IconButton>
        }
      />
      <NavMenu open={location.hash === PROFILE_HASH} onClose={closeProfile} />
    </>
  );
}

export default TopNav;
