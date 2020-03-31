import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Avatar, IconButton } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import TitleBar from 'components/base/TitleBar';
import useModalHash, { Modal } from 'hooks/useModalHash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: theme.palette.grey[600],
      height: 37,
      width: 37,
    },
  })
);

function TopNav({ title }: { title: string }) {
  const classes = useStyles();
  const { open: openProfile } = useModalHash(Modal.PROFILE);
  // const { open: openCreate } = useModalHash(Modal.CREATE);

  return (
    <TitleBar
      rightAction={
        <IconButton
          data-testid="topnav-profile"
          edge="end"
          onClick={openProfile}
        >
          <Avatar className={classes.avatar}>
            <Person />
          </Avatar>
        </IconButton>
      }
      title={title}
    />
  );
}

export default TopNav;
