import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import useTexts from 'hooks/useTexts';
import CategoriesList from 'components/app/CategoriesList';
import SlideModal from 'components/base/SlideModal';
import CategoryAddForm from 'components/app/CategoryAddForm';
import settings from 'stores/settings';

const ADD_SHEET_HEIGHT = 330;

interface StyleProps {
  showAddSheet: boolean;
}
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      paddingBottom: ({ showAddSheet }: StyleProps) =>
        showAddSheet ? ADD_SHEET_HEIGHT : theme.spacing(2)
    },
    heading: {
      marginBottom: theme.spacing(2)
    },
    subHeading: {
      color: theme.palette.grey[500],
      marginBottom: theme.spacing(3)
    },
    addSheet: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: `${theme.spacing(4)}px ${theme.spacing(
        2
      )}px ${`calc(env(safe-area-inset-bottom) + 40px + ${theme.spacing(
        4
      )}px)`}`,
      background: theme.palette.background.level1,
      transform: 'translate3d(0, 0, 0)',
      height: ADD_SHEET_HEIGHT
    },
    doneFab: {
      position: 'fixed',
      bottom: `calc(env(safe-area-inset-bottom) + 40px + ${theme.spacing(
        4
      )}px)`,
      right: theme.spacing(4)
    }
  })
);

function Setup({ onClose }: { onClose: () => void }) {
  const [t] = useTexts();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const classes = useStyles({ showAddSheet });

  const [newCategory, setNewCategory] = useState<Category>({
    id: 0,
    emoji: '',
    name: '',
    type: 'expenses'
  });

  const [{ categories }, { setCategory, removeCategory }] = settings.useStore();

  return (
    <div className={classes.root} data-testid="setup-modal-root">
      <Typography className={classes.heading} variant="h3">
        {t['SETUP_CATEGORIES']}
      </Typography>
      <Typography className={classes.subHeading} variant="body1">
        {t['SETUP_CATEGORIES_DESC']}
      </Typography>

      <CategoriesList
        addLabel={t['ADD_CATEGORY']}
        categories={categories.filter(cat => cat.type === 'expenses')}
        header={t['SETUP_CATEGORIES_EXPENSES']}
        onAdd={() => {
          setNewCategory({ id: 0, emoji: '', name: '', type: 'expenses' });
          setShowAddSheet(true);
        }}
        onClick={category => {
          setNewCategory(category);
          setShowAddSheet(true);
        }}
      />
      <CategoriesList
        addLabel={t['ADD_CATEGORY']}
        categories={categories.filter(cat => cat.type === 'income')}
        header={t['SETUP_CATEGORIES_INCOME']}
        onAdd={() => {
          setNewCategory({ id: 0, emoji: '', name: '', type: 'income' });
          setShowAddSheet(true);
        }}
        onClick={category => {
          setNewCategory(category);
          setShowAddSheet(true);
        }}
      />

      <Button
        className={classes.doneFab}
        color="secondary"
        disabled={!categories.length}
        size="large"
        startIcon={<Done />}
        variant="contained"
        onClick={onClose}
      >
        {t['DONE']}
      </Button>

      <SlideModal
        height={ADD_SHEET_HEIGHT}
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
      >
        <CategoryAddForm
          value={newCategory}
          onChange={setNewCategory}
          onDelete={() => {
            removeCategory(newCategory.id);
            setShowAddSheet(false);
          }}
          onSave={() => {
            if (newCategory.emoji) {
              setCategory(newCategory);
            } else {
              setCategory({
                ...newCategory,
                emoji: newCategory.name.substring(0, 1)
              });
            }
            setShowAddSheet(false);
          }}
        />
      </SlideModal>
    </div>
  );
}

export default Setup;
