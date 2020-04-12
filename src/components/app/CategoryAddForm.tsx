import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Typography } from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles((theme) =>
  createStyles({
    heading: {
      marginBottom: theme.spacing(2),
    },
    addSheetForm: {
      display: 'flex',
      '& > *': {
        flexGrow: 1,
      },
      '& > :first-child': {
        flexGrow: 0,
        marginRight: theme.spacing(1),
        width: 70,
      },
    },
    addSheetActions: {
      paddingTop: theme.spacing(2),
      textAlign: 'right',
      '& > button:not(:last-of-type)': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

function CategoryAddForm({
  value,
  onChange,
  onSave,
  onDelete,
}: {
  value: Settings.Category;
  onChange: React.Dispatch<React.SetStateAction<Settings.Category>>;
  onSave: () => void;
  onDelete: () => void;
}) {
  const [t] = useTexts();
  const classes = useStyles();

  const { id, emoji, name, type } = value;

  return (
    <form>
      <Typography className={classes.heading} variant="h6">
        {type === 'expenses'
          ? t['ADD_EXPENSES_CATEGORY']
          : t['ADD_INCOME_CATEGORY']}
      </Typography>
      <div className={classes.addSheetForm}>
        <TextField
          id="category-emoji"
          inputProps={{
            maxLength: 2,
          }}
          label={t['CATEGORY_EMOJI_LABEL']}
          margin="normal"
          type="text"
          value={emoji}
          onChange={(e) => onChange({ ...value, emoji: e.target.value })}
        />
        <TextField
          id="category-name"
          label={t['CATEGORY_NAME_LABEL']}
          margin="normal"
          type="text"
          value={name}
          required
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div className={classes.addSheetActions}>
        {!!id && (
          <Button
            color="secondary"
            startIcon={<Delete />}
            variant="contained"
            onClick={onDelete}
          >
            {t.REMOVE}
          </Button>
        )}
        <Button
          color="primary"
          disabled={!name}
          startIcon={id ? <Edit /> : <Add />}
          variant="contained"
          onClick={onSave}
        >
          {id ? t.EDIT : t.ADD}
        </Button>
      </div>
    </form>
  );
}

export default CategoryAddForm;
