import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import SlideModal from 'components/base/SlideModal';
import NumPad from 'components/base/NumPad';
import fitty from 'fitty';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    numWrapper: {
      width: '100%',
      textAlign: 'right'
    }
  })
);

function CreateTransaction({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const classes = useStyles();

  const [num, setNum] = useState('0');
  const [numEl, setNumEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (numEl) {
      const fitted = fitty(numEl, { maxSize: 100 });
      return () => {
        fitted.unsubscribe();
      };
    }
  }, [numEl]);

  return (
    <SlideModal open={open} onClose={onClose}>
      <div className={classes.numWrapper}>
        <Typography
          ref={(el: HTMLElement) => setNumEl(el)}
          display="block"
          variant="h2"
        >
          {num}
        </Typography>
      </div>
      <NumPad onChange={n => setNum(n)} onDone={() => onClose()} />
    </SlideModal>
  );
}

export default CreateTransaction;
