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
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      transitionProperty: 'box-shadow, margin',
      '&:before': { height: 0 }
    },
    summary: { padding: '0 16px' },
    summaryContent: { margin: 0 }
  })
);

function ProfileSettingsItem({
  icon,
  label,
  actionLabel,
  disabled,
  onSave,
  children,
  ...rest
}: React.PropsWithChildren<
  {
    icon: React.ReactElement;
    label: string;
    actionLabel?: string;
    disabled?: boolean;
    onSave?: () => void;
  } & React.ComponentProps<typeof ExpansionPanel>
>) {
  const classes = useStyles();
  const [t] = useTexts();
  return (
    <ExpansionPanel
      className={classes.root}
      elevation={rest.expanded ? 1 : 0}
      square={true}
      {...rest}
    >
      <ExpansionPanelSummary
        classes={{ root: classes.summary, content: classes.summaryContent }}
        expandIcon={<ExpandMore />}
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
          {actionLabel || t['SAVE']}
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
}

export default ProfileSettingsItem;
