import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  GridList,
  GridListTile,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Currency from 'components/base/Currency';
import TopNav from 'components/app/TopNav';
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(13, 2),
    },
    sectionTitle: {
      margin: theme.spacing(5, 0, 1),
    },
    gridListContainer: {
      margin: theme.spacing(0, -2),
      padding: theme.spacing(1, 2),
      overflowX: 'auto',
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
      overflow: 'visible',
    },
    gridListTile: {
      overflow: 'visible',
    },
    gridAddButton: {
      height: 'calc(100% - 16px)',
      display: 'flex',
    },
    accountBalance: {
      marginTop: theme.spacing(2),
    },
    emoji: {
      fontSize: theme.typography.h5.fontSize,
      color: theme.palette.text.primary,
    },
    listHeader: { top: 72, backgroundColor: theme.palette.background.default },
    fab: {
      position: 'fixed',
      right: theme.spacing(2),
      bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(2)}px)`,
      zIndex: theme.zIndex.speedDial,
    },
  })
);

function Dashboard() {
  const [t] = useTexts();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TopNav title={t.APP_NAME} />

      <Typography align="right" color="textSecondary" variant="subtitle1">
        {t['NET_WORTH']}
      </Typography>
      <Currency
        align="right"
        currency="GBP"
        value={1234.56}
        variant={['h3', 'h4']}
      />

      <Typography className={classes.sectionTitle} variant="h6">
        {t['ACCOUNTS']}
      </Typography>
      <div className={classes.gridListContainer}>
        <GridList
          cellHeight={140}
          className={classes.gridList}
          cols={1.5}
          spacing={16}
        >
          {[1].map((i) => (
            <GridListTile
              key={`account-${i}`}
              classes={{
                tile: classes.gridListTile,
              }}
            >
              <Card className={classes.gridAddButton} elevation={4}>
                <CardActionArea>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle1">
                      Xxxx xxxxxxx
                    </Typography>
                    <Typography>Xxxxx</Typography>

                    <Currency
                      align="right"
                      currency="GBP"
                      value={1234.56}
                      variant={['h6', 'subtitle1']}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </GridListTile>
          ))}
          <GridListTile
            classes={{
              tile: classes.gridListTile,
            }}
            style={{ paddingRight: 16 }}
          >
            <Card className={classes.gridAddButton} elevation={4}>
              <CardActionArea>
                <CardContent>
                  <Typography align="center" color="textSecondary" variant="h3">
                    +
                  </Typography>
                  <Typography align="center" color="textSecondary">
                    {t.CREATE_ACCOUNT}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </GridListTile>
        </GridList>
      </div>

      <Typography className={classes.sectionTitle} variant="h6">
        {t['TRANSACTIONS']}
      </Typography>
      <List
        component="div"
        subheader={
          <ListSubheader
            className={classes.listHeader}
            component="div"
            disableGutters
          >
            xx/xx/xxxx
          </ListSubheader>
        }
      >
        {['🛍', '🛒', '🚇'].map((emoji, i) => (
          <ListItem key={`first-list-item-${i}`} ContainerComponent="div">
            <ListItemIcon className={classes.emoji}>
              <span>{emoji}</span>
            </ListItemIcon>
            <ListItemText primary="Xxxxx xxx xxxx" secondary="Xxxx x xxxxx" />
            <ListItemSecondaryAction>
              <Currency
                currency="GBP"
                value={-12.34}
                variant={['body1', 'body2']}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <List
        component="div"
        subheader={
          <ListSubheader
            className={classes.listHeader}
            component="div"
            disableGutters
          >
            xx/xx/xxxx
          </ListSubheader>
        }
      >
        {['🛍', '🛒', '🧾', '🚇', '💸'].map((emoji, i) => (
          <ListItem key={`second-list-item-${i}`} ContainerComponent="div">
            <ListItemIcon className={classes.emoji}>
              <span>{emoji}</span>
            </ListItemIcon>
            <ListItemText primary="Xxxxx xxx xxxx" secondary="Xxxx x xxxxx" />
            <ListItemSecondaryAction>
              <Currency
                currency="GBP"
                value={-12.34}
                variant={['body1', 'body2']}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Fab className={classes.fab} color="primary">
        <Add />
      </Fab>
    </div>
  );
}

export default Dashboard;
