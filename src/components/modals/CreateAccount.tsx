import React, { useState } from 'react';
import {
  Button,
  MenuItem,
  TextField,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import useTexts from 'hooks/useTexts';
import settings from 'stores/settings';

const useStyles = makeStyles((theme) =>
  createStyles({
    actions: {
      paddingTop: theme.spacing(3),
      textAlign: 'right',
    },
  })
);

function CreateAccount({ onClose }: { onClose: () => void }) {
  const [t] = useTexts();
  const classes = useStyles();

  const [newAccount, setNewAccount] = useState<Settings.Account>({
    id: 0,
    name: '',
    type: 'normal',
    currency: 'gbp',
  });
  const [, { setAccount }] = settings.useStore();

  return (
    <>
      <form>
        <Typography variant="h6">{t.ADD_ACCOUNT}</Typography>

        <TextField
          id="create-account-type"
          label={t.ACCOUNT_TYPE}
          margin="normal"
          value={newAccount.type}
          fullWidth
          required
          select
          onChange={(e) =>
            setNewAccount({ ...newAccount, type: e.target.value as any })
          }
        >
          <MenuItem value="normal">{t.ACCOUNT_TYPE_NORMAL}</MenuItem>
          <MenuItem value="debt">{t.ACCOUNT_TYPE_DEBT}</MenuItem>
        </TextField>
        <TextField
          id="create-account-currency"
          label={t.ACCOUNT_CURRENCY}
          margin="normal"
          value="gbp"
          fullWidth
          required
          select
          onChange={(e) =>
            setNewAccount({ ...newAccount, currency: e.target.value as any })
          }
        >
          <MenuItem value="gbp">{t.CURRENCY_GBP}</MenuItem>
          <MenuItem value="usd">{t.CURRENCY_USD}</MenuItem>
          <MenuItem value="cny">{t.CURRENCY_CNY}</MenuItem>
        </TextField>
        <TextField
          id="create-account-name"
          label={t.ACCOUNT_NAME}
          margin="normal"
          value={newAccount.name}
          fullWidth
          required
          onChange={(e) =>
            setNewAccount({ ...newAccount, name: e.target.value })
          }
        />

        <div className={classes.actions}>
          <Button
            color="primary"
            data-testid="add-account-btn"
            disabled={!newAccount.type || !newAccount.name}
            startIcon={<Add />}
            variant="contained"
            onClick={() => {
              setAccount(newAccount);
              onClose();
            }}
          >
            {t.ADD}
          </Button>
        </div>
      </form>
    </>
  );
}

export default CreateAccount;
