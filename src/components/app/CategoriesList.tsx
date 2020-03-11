import React from 'react';
import emojiRegex from 'emoji-regex/text';
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  createStyles,
  makeStyles
} from '@material-ui/core';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles(theme =>
  createStyles({
    list: {
      backgroundColor: theme.palette.background.paper
    },
    listHeader: {
      top: theme.spacing(-8)
    },
    emoji: {
      fontSize: theme.typography.h5.fontSize,
      color: theme.palette.text.primary
    },
    emojiAvatar: {
      width: 24,
      height: 24,
      fontSize: '0.7rem'
    },
    truncatedText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    addText: {
      color: theme.palette.primary.main
    },
    addIcon: {
      color: theme.palette.primary.main
    }
  })
);

const regex = emojiRegex();

function CategoriesList({
  header,
  categories,
  onClick,
  onAdd,
  addLabel
}: {
  header: string;
  categories: Category[];
  onClick?: (category: Category) => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  const classes = useStyles();
  return (
    <List
      className={classes.list}
      component="div"
      subheader={
        <ListSubheader
          className={classes.listHeader}
          component="div"
          disableGutters
        >
          {header}
        </ListSubheader>
      }
    >
      {categories.map((cat, i) => (
        <ListItem
          key={`${cat.name}-${i}`}
          button={!!onClick as any}
          onClick={() => {
            if (onClick) {
              onClick(cat);
            }
          }}
        >
          <ListItemIcon className={classes.emoji}>
            {cat.emoji.match(regex) ? (
              <span>{cat.emoji}</span>
            ) : (
              <Avatar className={classes.emojiAvatar}>{cat.emoji}</Avatar>
            )}
          </ListItemIcon>
          <ListItemText className={classes.truncatedText} primary={cat.name} />
        </ListItem>
      ))}
      {onAdd && (
        <ListItem button onClick={onAdd}>
          <ListItemIcon className={classes.addIcon}>
            <Add />
          </ListItemIcon>
          <ListItemText className={classes.addText} primary={addLabel} />
        </ListItem>
      )}
    </List>
  );
}

export default CategoriesList;
