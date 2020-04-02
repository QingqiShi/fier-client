import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MenuItem, Select } from '@material-ui/core';
import { Locale, locales } from 'stores/i18n';
import useTexts from 'hooks/useTexts';
import settings from 'stores/settings';

const useStyles = makeStyles(() =>
  createStyles({
    emoji: {
      paddingLeft: 5,
    },
    languageContainer: ({ position }: { position: 'static' | 'fixed' }) => ({
      position: position,
      right: 'calc(env(safe-area-inset-right) + 20px)',
      top: 20,
      textAlign: 'center',
    }),
  })
);

const options = locales.map((locale) => ({
  language: `LANGUAGE_${locale.toUpperCase()}` as 'LANGUAGE_EN' | 'LANGUAGE_ZH',
  flag: `FLAG_${locale.toUpperCase()}` as 'FLAG_EN' | 'FLAG_ZH',
  key: `language-selector-option-${locale}`,
  value: locale,
}));

function LanguageSelector({
  position = 'static',
}: {
  position?: 'static' | 'fixed';
}) {
  const classes = useStyles({ position });
  const [t] = useTexts();
  const [{ locale }, { setLocale }] = settings.useStore();

  const handleLanguageChange: React.ComponentProps<
    typeof Select
  >['onChange'] = (event) => {
    const newLocale = event.target.value as Locale;
    setLocale(newLocale);
  };

  return (
    <div className={classes.languageContainer}>
      <Select
        name="language"
        renderValue={(value) => (
          <span className={classes.emoji} role="img">
            {
              t[
                `FLAG_${(value as Locale).toUpperCase()}` as
                  | 'FLAG_EN'
                  | 'FLAG_ZH'
              ]
            }
          </span>
        )}
        value={locale}
        onChange={handleLanguageChange}
      >
        {options.map(({ language, flag, key, value }) => (
          <MenuItem key={key} value={value}>
            <span aria-label={t[language]} role="img">
              {t[flag]}
            </span>{' '}
            <span>{t[language]}</span>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default LanguageSelector;
