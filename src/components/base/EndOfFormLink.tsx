import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import useRoute from 'hooks/useRoute';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      marginTop: theme.spacing(3),
      display: 'block',
      textAlign: 'center'
    }
  })
);

function EndOfFormLink({
  children,
  to
}: React.PropsWithChildren<{
  to: string;
}>) {
  const classes = useStyles();
  const { redirect } = useRoute();
  return (
    <Link className={classes.link} variant="body2" onClick={() => redirect(to)}>
      {children}
    </Link>
  );
}

export default EndOfFormLink;
