import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import dayjs, { Dayjs } from 'dayjs';
import HorizontalList from 'components/base/HorizontalList';
import HorizontalListItem from 'components/base/HorizontalListItem';
import SelectableCard from 'components/base/SelectableCard';
import SlideModal from 'components/base/SlideModal';
import ManageCategories from 'components/modals/ManageCategories';
import CreateAccount from 'components/modals/CreateAccount';
import useFormInput from 'hooks/useFormInput';
import useTexts from 'hooks/useTexts';
import settings from 'stores/settings';

const NUMBER_REGEX = /^-?[1-9][0-9]*\.?[0-9]{0,2}$/;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    category: {
      width: '1.25em',
      display: 'block',
      textAlign: 'center',
    },
    categoriesContainer: {
      display: 'flex',
      margin: `${theme.spacing(
        2
      )}px calc((24px + env(safe-area-inset-right)) * -1) ${theme.spacing(
        1
      )}px`,
    },
    categoriesLabel: {
      margin: `0 calc(24px + env(safe-area-inset-right))`,
    },
    addAccountMenuItem: {
      margin: theme.spacing(1),
      textAlign: 'center',
    },
  })
);

function CreateTransaction({ onClose }: { onClose: () => void }) {
  const [t] = useTexts();
  const classes = useStyles();
  const [num, handleNumChange] = useFormInput('');
  const [category, setCategory] = useState(0);
  const [account, handleAccountChange, setAccount] = useFormInput('');
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [notes, handleNotesChange] = useFormInput('');
  const [{ accounts, categories }] = settings.useStore();
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);

  const numIsValid = useMemo(() => NUMBER_REGEX.test(num), [num]);
  const amountHelperText = useMemo(() => {
    if (!num) {
      return t.ERROR_AMOUNT_REQUIRED;
    } else if (!numIsValid) {
      return t.ERROR_AMOUNT_INVALID;
    }
    return undefined;
  }, [num, numIsValid, t.ERROR_AMOUNT_INVALID, t.ERROR_AMOUNT_REQUIRED]);

  useEffect(() => {
    if (!category && categories.length) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  useEffect(() => {
    if (!account && accounts.length) {
      setAccount(accounts[0].id.toString());
    }
  }, [account, accounts, setAccount]);

  return (
    <>
      <Typography variant="h6">{t.NEW_TRANSACTION}</Typography>

      <TextField
        error={!numIsValid}
        helperText={amountHelperText}
        id="add-amount"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        label={t.TRANSACTION_AMOUNT}
        margin="normal"
        placeholder="0.00"
        value={num}
        fullWidth
        required
        onChange={handleNumChange}
      />
      <FormControl
        className={classes.categoriesContainer}
        margin="normal"
        required
      >
        <InputLabel className={classes.categoriesLabel} shrink>
          {t.TRANSACTION_CATEGORY}
        </InputLabel>
        <input id="add-category" hidden />
        <HorizontalList height={110}>
          <HorizontalListItem>
            <SelectableCard onClick={() => setShowCategoriesModal(true)}>
              <Typography
                align="center"
                className={classes.category}
                color="textSecondary"
                data-testid="add-create-category"
                variant="h4"
              >
                +
              </Typography>
            </SelectableCard>
          </HorizontalListItem>
          {categories.map((c) => (
            <HorizontalListItem key={`add-category-${c.id}`}>
              <SelectableCard
                selected={category === c.id}
                onClick={() => setCategory(c.id)}
              >
                <Typography className={classes.category} variant="h4">
                  {c.emoji}
                </Typography>
              </SelectableCard>
            </HorizontalListItem>
          ))}
        </HorizontalList>
      </FormControl>

      <TextField
        id="add-account"
        label={t.TRANSACTION_ACCOUNT}
        margin="normal"
        value={account}
        fullWidth
        required
        select
        onChange={handleAccountChange}
      >
        {accounts.map((a) => (
          <MenuItem key={`add-select-account-${a.id}`} value={a.id}>
            {a.name}
          </MenuItem>
        ))}
        <div className={classes.addAccountMenuItem}>
          <Button
            color="primary"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setShowAccountsModal(true);
            }}
          >
            {t.ADD_ACCOUNT}
          </Button>
        </div>
      </TextField>

      <div
        onMouseMove={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <DateTimePicker
          ampm={false}
          id="add-date"
          label={t.TRANSACTION_DATE}
          margin="normal"
          value={time}
          fullWidth
          required
          onChange={(date) => setTime(date)}
        />
      </div>
      <TextField
        id="add-notes"
        label={t.TRANSACTION_NOTES}
        margin="normal"
        value={notes}
        fullWidth
        multiline
        onChange={handleNotesChange}
      />

      <SlideModal
        open={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      >
        <ManageCategories onClose={() => setShowCategoriesModal(false)} />
      </SlideModal>
      <SlideModal
        height={470}
        open={showAccountsModal}
        onClose={() => setShowAccountsModal(false)}
      >
        <CreateAccount onClose={() => setShowAccountsModal(false)} />
      </SlideModal>
    </>
  );
}

export default CreateTransaction;
