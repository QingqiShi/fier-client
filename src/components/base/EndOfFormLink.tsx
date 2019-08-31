import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import useLocale from 'hooks/useLocale';

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
  const { goto } = useLocale();
  return (
    <Link className={classes.link} variant="body2" onClick={() => goto(to)}>
      {children}
    </Link>
  );
}

export default EndOfFormLink;
