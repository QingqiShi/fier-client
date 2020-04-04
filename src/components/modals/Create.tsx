import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import NumPad from 'components/base/NumPad';
import fitty from 'fitty';

const useStyles = makeStyles(() =>
  createStyles({
    numWrapper: {
      width: '100%',
      textAlign: 'right',
    },
  })
);

function Create({ onClose }: { onClose: () => void }) {
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
    <>
      <div className={classes.numWrapper}>
        <Typography
          ref={(el: HTMLElement) => setNumEl(el)}
          display="block"
          variant="h2"
        >
          {num}
        </Typography>
      </div>
      <NumPad onChange={(n) => setNum(n)} onDone={() => onClose()} />
    </>
  );
}

export default Create;
