import React from 'react';
import { Location } from 'history';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { LocaleLink } from 'libs/locale-router';

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
  to: string | Location<any>;
}>) {
  const classes = useStyles();
  return (
    <Link
      className={classes.link}
      component={LocaleLink}
      variant="body2"
      to={to}
    >
      {children}
    </Link>
  );
}

export default EndOfFormLink;
