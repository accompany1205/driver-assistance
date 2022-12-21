import { useContext } from 'react';
import type { SettingsContextValue } from '../contexts/settings-context';
import { SettingsContext } from '../contexts/settings-context';

export const useSettings = (): SettingsContextValue => useContext(SettingsContext);
