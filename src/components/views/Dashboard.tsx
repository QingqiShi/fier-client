import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  GridList,
  GridListTile,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import dayjs from 'dayjs';
import { firestore } from 'firebase/app';
import Currency from 'components/base/Currency';
import TopNav from 'components/app/TopNav';
import AccountCard from 'components/app/AccountCard';
import TransactionList from 'components/app/TransactionList';
import useTexts from 'hooks/useTexts';
import useModalHash, { Modal } from 'hooks/useModalHash';
import settings from 'stores/settings';
import user from 'stores/user';

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
  const { open: openCreateAcount } = useModalHash(Modal.CREATE_ACCOUNT);
  const { open: openNew } = useModalHash(Modal.CREATE_TRANSACTION);
  const [{ accounts }] = settings.useStore();
  const [{ uid }] = user.useStore();
  const [transactions, setTransactions] = useState<Data.Transaction[]>([]);

  useEffect(() => {
    const db = firestore();
    return db
      .collection(`users/${uid}/transactions`)
      .orderBy('dateTime', 'desc')
      .limit(20)
      .onSnapshot((query) => {
        const dataHolder: Data.Transaction[] = [];
        query.forEach((doc) => {
          const data = doc.data() as any;
          dataHolder.push({
            ...data,
            id: doc.id,
            dateTime: dayjs.unix(data.dateTime),
          });
        });
        setTransactions(dataHolder);
      });
  }, [uid]);

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
          {accounts.map((account) => (
            <GridListTile
              key={`dashboard-account-${account.id}`}
              classes={{
                tile: classes.gridListTile,
              }}
            >
              <AccountCard
                account={account}
                className={classes.gridAddButton}
              />
            </GridListTile>
          ))}
          <GridListTile
            classes={{
              tile: classes.gridListTile,
            }}
            style={{ paddingRight: 16 }}
          >
            <Card
              className={classes.gridAddButton}
              elevation={4}
              onClick={openCreateAcount}
            >
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
      <TransactionList transactions={transactions} />

      <Fab className={classes.fab} color="primary" onClick={openNew}>
        <Add />
      </Fab>
    </div>
  );
}

export default Dashboard;
