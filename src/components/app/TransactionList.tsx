import React from 'react';
import {
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
import Currency from 'components/base/Currency';
import settings from 'stores/settings';
import useText from 'hooks/useTexts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emoji: {
      fontSize: theme.typography.h5.fontSize,
      color: theme.palette.text.primary,
    },
    listHeader: { top: 72, backgroundColor: theme.palette.background.default },
    emptyText: {
      textAlign: 'center',
      width: '60%',
      margin: theme.spacing(2, 'auto', 0),
    },
  })
);

function TransactionList({
  transactions,
}: {
  transactions: Data.Transaction[];
}) {
  const [t] = useText();
  const classes = useStyles();
  const [{ accounts, categories, locale }] = settings.useStore();

  const groupedByDay = transactions.reduce((grouped, account) => {
    if (!grouped.length) return [...grouped, [account]];

    const group = grouped[grouped.length - 1];
    if (group[group.length - 1].dateTime.isSame(account.dateTime, 'day')) {
      group.push(account);
      return [...grouped];
    }

    return [...grouped, [account]];
  }, [] as Data.Transaction[][]);

  return (
    <>
      {transactions.length ? (
        groupedByDay.map((group) => (
          <List
            key={`transactions-group-${group[0].dateTime
              .locale(locale)
              .format('ll')}`}
            component="div"
            subheader={
              <ListSubheader
                className={classes.listHeader}
                component="div"
                disableGutters
              >
                {group[0].dateTime.locale(locale).format('ll')}
              </ListSubheader>
            }
          >
            {group.map((transaction) => (
              <ListItem
                key={`transaction-${transaction.id}`}
                ContainerComponent="div"
              >
                <ListItemIcon className={classes.emoji}>
                  <span>
                    {
                      categories.find(
                        (category) => category.id === transaction.categoryId
                      )?.emoji
                    }
                  </span>
                </ListItemIcon>
                <ListItemText
                  primary={
                    categories.find(({ id }) => id === transaction.categoryId)
                      ?.name
                  }
                  secondary={
                    accounts.find(({ id }) => id === transaction.fromAccountId)
                      ?.name
                  }
                />
                <ListItemSecondaryAction>
                  <Currency
                    currency="GBP"
                    value={transaction.value}
                    variant={['body1', 'body2']}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ))
      ) : (
        <div className={classes.emptyText}>
          <Typography color="textSecondary" component="p" variant="h6">
            {t.TRANSACTION_EMPTY}
          </Typography>
          <Typography color="textSecondary">
            {t.TRANSACTION_EMPTY_DESC}
          </Typography>
        </div>
      )}
    </>
  );
}

export default TransactionList;
