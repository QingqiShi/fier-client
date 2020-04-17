import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: 'background-color 0.2s ease',
      color: 'black !important',
      backgroundColor: ({ selected }: { selected?: boolean }) =>
        selected ? theme.palette.primary.main : theme.palette.background.paper,
    },
  })
);

function SelectableCard({
  children,
  onClick,
  selected,
}: React.PropsWithChildren<{ onClick?: () => void; selected?: boolean }>) {
  const classes = useStyles({ selected });
  return (
    <Card className={classes.root} data-testid="selectable-card" elevation={4}>
      <CardActionArea onClick={onClick}>
        <CardContent>{children}</CardContent>
      </CardActionArea>
    </Card>
  );
}

export default SelectableCard;
