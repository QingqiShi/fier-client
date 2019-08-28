import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { MenuItem, Select } from '@material-ui/core';
import { Locale, locales } from 'stores/i18n';
import useTexts from 'hooks/useTexts';
import useLocale from 'hooks/useLocale';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emoji: {
      paddingLeft: 5
    },
    languageContainer: {
      position: 'fixed',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center'
    }
  })
);

function LanguageSelector({ position }: { position?: 'bottom' }) {
  const classes = useStyles();
  const [t] = useTexts();
  const { locale, changeLocale } = useLocale();

  const [selectedLang, setSelectedLang] = useState<Locale>(locale);

  function handleLanguageChange(
    event: React.ChangeEvent<{ namne?: string; value: unknown }>
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
        value={selectedLang}
        onChange={handleLanguageChange}
        renderValue={value => (
          <span className={classes.emoji}>
            {t[`FLAG_${(value as Locale).toUpperCase()}`]}
          </span>
        )}
        name="language"
      >
        {locales.map(locale => {
          const language = t[`LANGUAGE_${locale.toUpperCase()}`];
          const flag = t[`FLAG_${locale.toUpperCase()}`];
          return (
            <MenuItem value={locale} key={`settings-language-option-${locale}`}>
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
