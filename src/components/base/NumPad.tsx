import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid } from '@material-ui/core';
import { Backspace, Done } from '@material-ui/icons';
import { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles(() =>
  createStyles({
    number: {
      fontSize: '2.5rem',
      lineHeight: '2.5rem',
      display: 'block',
      width: '1em',
      height: '1em',
      touchAction: 'manipulation'
    },
    alignCenter: {
      textAlign: 'center'
    },
    numberButton: {
      width: '100%',
      borderRadius: 0,
      paddingTop: 15,
      paddingBottom: 15
    },
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: 'calc(20px + 40px + env(safe-area-inset-bottom))'
    },
    spacer: {
      paddingTop: 20
    }
  })
);

const NumberButton = ({
  children,
  color,
  onClick,
  className,
  ...rest
}: ButtonProps) => {
  const classes = useStyles();
  return (
    <Button
      className={`${classes.numberButton} ${className}`}
      color={color || 'default'}
      onClick={onClick}
      {...rest}
    >
      <span className={classes.number}>{children}</span>
    </Button>
  );
};

const numbers: (number | '.')[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0];

function NumPad({
  onChange,
  onDone
}: {
  onChange?: (raw: string, parsed: number) => void;
  onDone?: (raw: string, parsed: number) => void;
}) {
  const classes = useStyles();
  const [num, setNum] = useState('0');

  const update = (newNum: number | '.') => {
    if (num.toString().length > 15) return;
    if (num === '0' && newNum === 0) return;

    const seg = num.split('.');
    if (seg.length > 1 && newNum === '.') return;
    if (seg.length > 1 && seg[1].length >= 2) return;

    if (num === '0' && newNum !== '.') {
      setNum(newNum.toString());
    } else {
      setNum(val => val + newNum);
    }
  };

  useEffect(() => {
    if (onChange) onChange(num, parseFloat(num));
  }, [num, onChange]);

  return (
    <Container className={classes.container} maxWidth="sm">
      <Grid justify="center" spacing={0} container>
        {numbers.map(n => (
          <Grid
            key={`num-pad-${n}`}
            className={classes.alignCenter}
            xs={4}
            item
          >
            <NumberButton onClick={() => update(n)}>{n}</NumberButton>
          </Grid>
        ))}

        <Grid className={classes.alignCenter} xs={4} item>
          <NumberButton
            color="secondary"
            onClick={() => setNum(val => val.slice(0, val.length - 1) || '0')}
          >
            <Backspace data-testid="numpad-delete" />
          </NumberButton>
        </Grid>

        <Grid
          className={`${classes.alignCenter} ${classes.spacer}`}
          xs={12}
          item
        >
          <Button
            color="primary"
            size="large"
            variant="contained"
            onClick={() => onDone && onDone(num, parseFloat(num))}
          >
            <Done data-testid="numpad-done" />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NumPad;
