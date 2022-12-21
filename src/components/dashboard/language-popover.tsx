import type { FC } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Box, ListItemIcon, ListItemText, MenuItem, Popover, Typography } from '@mui/material';

interface LanguagePopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

type Language = 'en' | 'de' | 'es';

type LanguageOptions = {
  [key in Language]: {
    icon: string;
    label: string;
  };
}

const languageOptions: LanguageOptions = {
  en: {
    icon: '/static/icons/uk_flag.svg',
    label: 'English'
  },
  de: {
    icon: '/static/icons/de_flag.svg',
    label: 'German'
  },
  es: {
    icon: '/static/icons/es_flag.svg',
    label: 'Spanish'
  }
};

export const LanguagePopover: FC<LanguagePopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const { i18n, t } = useTranslation();

  const handleChange = async (language: Language): Promise<void> => {
    onClose?.();
    await i18n.changeLanguage(language);
    toast.success(t('Language changed') as string);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 240 } }}
      transitionDuration={0}
      {...other}
    >
      {(Object.keys(languageOptions) as Language[]).map((language) => (
        <MenuItem
          onClick={() => handleChange(language)}
          key={language}
        >
          <ListItemIcon>
            <Box
              sx={{
                display: 'flex',
                height: 20,
                width: 20,
                '& img': {
                  width: '100%'
                }
              }}
            >
              <img
                alt={languageOptions[language].label}
                src={languageOptions[language].icon}
              />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="subtitle2">
                {languageOptions[language].label}
              </Typography>
            )}
          />
        </MenuItem>
      ))}
    </Popover>
  );
};

LanguagePopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
