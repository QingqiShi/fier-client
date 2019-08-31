import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MenuItem, Select } from '@material-ui/core';
import { Locale, locales } from 'stores/i18n';
import useTexts from 'hooks/useTexts';
import useLocale from 'hooks/useLocale';

const useStyles = makeStyles(() =>
  createStyles({
    emoji: {
      paddingLeft: 5
    },
    languageContainer: {
      position: 'fixed',
      right: 'calc(env(safe-area-inset-left) + 20px)',
      top: 20,
      textAlign: 'center'
    }
  })
);

function LanguageSelector({ position }: { position?: 'bottom' }) {
  const classes = useStyles({ position });
  const [t] = useTexts();
  const { locale, changeLocale } = useLocale();

  const [selectedLang, setSelectedLang] = useState<Locale>(locale);

  function handleLanguageChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
    const newLocale = event.target.value as Locale;
    setSelectedLang(newLocale);
    changeLocale(newLocale);
  }

  return (
    <div
      className={position === 'bottom' ? classes.languageContainer : undefined}
    >
      <Select
        name="language"
        renderValue={value => (
          <span className={classes.emoji}>
            {t[`FLAG_${(value as Locale).toUpperCase()}`]}
          </span>
        )}
        value={selectedLang}
        onChange={handleLanguageChange}
      >
        {locales.map(locale => {
          const language = t[`LANGUAGE_${locale.toUpperCase()}`];
          const flag = t[`FLAG_${locale.toUpperCase()}`];
          return (
            <MenuItem key={`settings-language-option-${locale}`} value={locale}>
              <span aria-label={language} role="img">
                {flag} {language}
              </span>
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}

export default LanguageSelector;
