import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Button,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: ({ expanded }: { expanded: boolean }) => ({
      transitionProperty: 'box-shadow, margin, background-color',
      backgroundColor: expanded ? theme.palette.background.level1 : undefined,
      '&:before': { height: 0 },
    }),
    summary: { padding: '0 16px' },
    summaryContent: { margin: 0 },
  })
);

function ProfileSettingsItem({
  icon,
  label,
  actionLabel,
  disabled,
  onSave,
  children,
  expanded,
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
  const classes = useStyles({ expanded: !!expanded });
  const [t] = useTexts();
  return (
    <ExpansionPanel
      className={classes.root}
      elevation={expanded ? 1 : 0}
      expanded={expanded}
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
