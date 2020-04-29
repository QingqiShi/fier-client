import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';
import { firestore } from 'firebase/app';
import Currency from 'components/base/Currency';
import useTexts from 'hooks/useTexts';
import user from 'stores/user';

function AccountCard({
  className,
  account,
}: {
  className?: string;
  account: Settings.Account;
}) {
  const { id, type, name, currency } = account;
  const [t] = useTexts();
  const [{ uid }] = user.useStore();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const db = firestore();
    db.doc(`users/${uid}/accounts/${id}`).onSnapshot((doc) => {
      const data = doc.data();
      if (data && 'balance' in data) {
        setBalance(data.balance);
      }
    });
  }, [id, uid]);

  return (
    <Card className={className} elevation={4}>
      <CardActionArea>
        <CardContent>
          <Typography color="textSecondary" variant="subtitle1">
            {type === 'debt' ? t.ACCOUNT_TYPE_DEBT : t.ACCOUNT_TYPE_NORMAL}
          </Typography>
          <Typography>{name}</Typography>

          <Currency
            align="right"
            currency={currency.toUpperCase()}
            value={balance}
            variant={['h6', 'subtitle1']}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default AccountCard;
