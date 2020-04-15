import React, { useEffect, useMemo, useState } from 'react';
import { InputAdornment, MenuItem, TextField } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import dayjs, { Dayjs } from 'dayjs';

import useFormInput from 'hooks/useFormInput';
import useTexts from 'hooks/useTexts';
import settings from 'stores/settings';

const NUMBER_REGEX = /^-?[1-9][0-9]*\.?[0-9]{0,2}$/;

function CreateTransaction({ onClose }: { onClose: () => void }) {
  const [t] = useTexts();
  const [num, handleNumChange] = useFormInput('');
  const [account, handleAccountChange, setAccount] = useFormInput('');
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [notes, handleNotesChange] = useFormInput('');
  const [{ accounts }] = settings.useStore();

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
    if (!account && accounts.length) {
      setAccount(accounts[0].id.toString());
    }
  });

  return (
    <>
      <TextField
        error={!numIsValid}
        helperText={amountHelperText}
        id="add-amount"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        label={t.TRANSACTION_AMOUNT}
        margin="normal"
        value={num}
        fullWidth
        required
        onChange={handleNumChange}
      />
      <TextField
        id="add-account"
        label={t.TRANSACTION_ACCOUNT}
        margin="normal"
        value={account}
        fullWidth
        select
        onChange={handleAccountChange}
      >
        {accounts.map((a) => (
          <MenuItem key={`add-select-account-${a.id}`} value={a.id}>
            {a.name}
          </MenuItem>
        ))}
      </TextField>

      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <DateTimePicker
          ampm={false}
          id="add-date"
          label={t.TRANSACTION_DATE}
          margin="normal"
          value={time}
          fullWidth
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
    </>
  );
}

export default CreateTransaction;
