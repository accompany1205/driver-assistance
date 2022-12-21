import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  Typography
} from '@mui/material';
import type { Settings } from '../contexts/settings-context';
import { useSettings } from '../hooks/use-settings';
import { X as XIcon } from '../icons/x';
// @ts-ignore
import LightThemeIcon from '../components/light-theme.svg';
// @ts-ignore
import DarkThemeIcon from '../components/dark-theme.svg';
import PropTypes from 'prop-types';

interface SettingsDrawerProps {
  onClose?: () => void;
  open?: boolean;
}

const themes = [
  {
    label: 'Light',
    value: 'light',
    icon: LightThemeIcon
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: DarkThemeIcon
  }
];

const getValues = (settings: Settings) => ({
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  theme: settings.theme
});

export const SettingsDrawer: FC<SettingsDrawerProps> = (props) => {
  const { open, onClose, ...other } = props;
  const { settings, saveSettings } = useSettings();
  const [values, setValues] = useState<Settings>(getValues(settings));

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleChange = (field: string, value: unknown): void => {
    setValues({
      ...values,
      [field]: value
    });
  };

  const handleSave = (): void => {
    saveSettings(values);
    onClose?.();
  };

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{ sx: { zIndex: 2000 } }}
      PaperProps={{ sx: { width: 320 } }}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2
        }}
      >
        <Typography
          color="inherit"
          variant="h6"
        >
          Theme settings
        </Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          py: 4,
          px: 3
        }}
      >
        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1
          }}
          variant="overline"
        >
          Color Scheme
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            m: -1
          }}
        >
          {themes.map((theme) => {
            const { label, icon: Icon, value } = theme;

            return (
              <div key={value}>
                <Box
                  onClick={() => handleChange('theme', value)}
                  sx={{
                    borderColor: values.theme === value ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    cursor: 'pointer',
                    flexGrow: 1,
                    fontSize: 0,
                    m: 1,
                    overflow: 'hidden',
                    p: 1,
                    '& svg': {
                      height: 'auto',
                      width: '100%'
                    }
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  align="center"
                  sx={{ mt: 1 }}
                  variant="subtitle2"
                >
                  {label}
                </Typography>
              </div>
            );
          })}
        </Box>
        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1,
            mt: 4
          }}
          variant="overline"
        >
          Settings
        </Typography>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.direction === 'rtl'}
                name="direction"
                onChange={(event): void => handleChange(
                  'direction',
                  event.target.checked
                    ? 'rtl'
                    : 'ltr'
                )}
              />
            )}
            label={(
              <Typography variant="subtitle2">
                Activate RTL content
              </Typography>
            )}
          />
        </div>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.responsiveFontSizes}
                name="direction"
                onChange={(event): void => handleChange(
                  'responsiveFontSizes',
                  event.target.checked
                )}
              />
            )}
            label={(
              <Typography variant="subtitle2">
                Responsive font sizes
              </Typography>
            )}
          />
        </div>
        <Button
          color="primary"
          fullWidth
          onClick={handleSave}
          sx={{ mt: 3 }}
          variant="contained"
        >
          Save Settings
        </Button>
      </Box>
    </Drawer>
  );
};

SettingsDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
