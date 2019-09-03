import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      transitionProperty: 'box-shadow, margin',
      '&:before': {
        height: 0
      }
    },
    summary: {
      padding: '0 16px'
    },
    summaryContent: {
      margin: 0
    }
  })
);

function ProfileSettingsItem({
  icon,
  label,
  expanded,
  saveLabel,
  disabled,
  onChange,
  onSave,
  children
}: React.PropsWithChildren<{
  icon: React.ReactElement;
  label: string;
  saveLabel: string;
  expanded?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  onSave?: () => void;
}>) {
  const classes = useStyles();
  return (
    <ExpansionPanel
      className={classes.root}
      elevation={expanded ? 1 : 0}
      expanded={expanded}
      square={true}
      onChange={onChange}
    >
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        classes={{ root: classes.summary, content: classes.summaryContent }}
        expandIcon={<ExpandMore />}
        id="panel1a-header"
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      <ExpansionPanelActions>
        <Button
          color="primary"
          disabled={disabled}
          size="small"
          onClick={onSave}
        >
          {saveLabel}
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
}

export default ProfileSettingsItem;
