import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar, IconButton } from '@material-ui/core';
import { AddBox, Person } from '@material-ui/icons';
import TitleBar from 'components/base/TitleBar';
import NavMenu from 'components/app/NavMenu';
import CreateTransaction from 'components/app/CreateTransaction';
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
const CREATE_HASH = '#create';

function TopNav({ title }: { title: string }) {
  const classes = useStyles();
  const { location, history } = useRoute();

  function openProfile() {
    history.push({ ...location, hash: PROFILE_HASH });
  }
  function closeProfile() {
    history.push({ ...location, hash: '' });
  }

  function openCreate() {
    history.push({ ...location, hash: CREATE_HASH });
  }
  function closeCreate() {
    history.push({ ...location, hash: '' });
  }

  return (
    <>
      <TitleBar
        leftAction={
          <IconButton
            data-testid="topnav-profile"
            edge="start"
            onClick={openProfile}
          >
            <Avatar className={classes.avatar}>
              <Person />
            </Avatar>
          </IconButton>
        }
        rightAction={
          <IconButton
            color="primary"
            data-testid="topnav-add"
            edge="end"
            onClick={openCreate}
          >
            <AddBox />
          </IconButton>
        }
        title={title}
      />
      <NavMenu open={location.hash === PROFILE_HASH} onClose={closeProfile} />
      <CreateTransaction
        open={location.hash === CREATE_HASH}
        onClose={closeCreate}
      />
    </>
  );
}

export default TopNav;
