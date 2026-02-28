'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '@/lib/types';
import { getSettings, setSettings } from '@/lib/storage';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  companyName: 'ورشة تغيير الزيت',
  companyAddress: '',
  companyPhone: '',
  taxRate: 15,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setSettingsState(getSettings());
    setIsInitialized(true);

    const handleStorageChange = () => {
      setSettingsState(getSettings());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...updates };
    setSettings(updatedSettings);
    setSettingsState(updatedSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setSettingsState(defaultSettings);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
