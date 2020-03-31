import React, { useMemo } from 'react';
import { Typography } from '@material-ui/core';
import settings from 'stores/settings';

type TypographyVariant = React.ComponentProps<typeof Typography>['variant'];
type TypographyAlign = React.ComponentProps<typeof Typography>['align'];

function Currency({
  value,
  currency,
  variant,
  align,
  className,
}: {
  value: number;
  currency: string;
  variant: [TypographyVariant, TypographyVariant];
  align?: TypographyAlign;
  className?: string;
}) {
  const [{ locale }] = settings.useStore();
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency }),
    [currency, locale]
  );
  const parts = useMemo(() => formatter.formatToParts(value), [
    formatter,
    value,
  ]);

  return (
    <Typography align={align} className={className} variant={variant[0]}>
      {parts.map((part, i) => {
        switch (part.type) {
          case 'currency':
          case 'fraction':
            return (
              <Typography
                key={`currency-part-${i}`}
                component="span"
                variant={variant[1]}
              >
                {part.value}
              </Typography>
            );
          default:
            return <span key={`currency-part-${i}`}>{part.value}</span>;
        }
      })}
    </Typography>
  );
}

export default Currency;
