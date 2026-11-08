import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, GLASS_DEFAULTS } from '../theme/tokens';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: typeof COLORS.light;
  glassAlpha: number;
  glassBlur: number;
  setGlassAlpha: React.Dispatch<React.SetStateAction<number>>;
  setGlassBlur: React.Dispatch<React.SetStateAction<number>>;
  resetGlass: () => void;
}

const STORAGE_KEY_THEME = '@kitchensink_theme';
const STORAGE_KEY_GLASS_ALPHA = '@kitchensink_glass_alpha';
const STORAGE_KEY_GLASS_BLUR = '@kitchensink_glass_blur';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [glassAlpha, setGlassAlpha] = useState<number>(GLASS_DEFAULTS.alpha);
  const [glassBlur, setGlassBlur] = useState<number>(GLASS_DEFAULTS.blur);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY_THEME).then((val) => {
      if (val === 'light' || val === 'dark') setTheme(val);
    });
    AsyncStorage.getItem(STORAGE_KEY_GLASS_ALPHA).then((val) => {
      if (val !== null) setGlassAlpha(parseFloat(val));
    });
    AsyncStorage.getItem(STORAGE_KEY_GLASS_BLUR).then((val) => {
      if (val !== null) setGlassBlur(parseFloat(val));
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY_THEME, next);
      return next;
    });
  };

  const updateGlassAlpha: React.Dispatch<React.SetStateAction<number>> = (action) => {
    setGlassAlpha((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      AsyncStorage.setItem(STORAGE_KEY_GLASS_ALPHA, next.toString());
      return next;
    });
  };

  const updateGlassBlur: React.Dispatch<React.SetStateAction<number>> = (action) => {
    setGlassBlur((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      AsyncStorage.setItem(STORAGE_KEY_GLASS_BLUR, next.toString());
      return next;
    });
  };

  const resetGlass = () => {
    setGlassAlpha(GLASS_DEFAULTS.alpha);
    setGlassBlur(GLASS_DEFAULTS.blur);
    AsyncStorage.setItem(STORAGE_KEY_GLASS_ALPHA, GLASS_DEFAULTS.alpha.toString());
    AsyncStorage.setItem(STORAGE_KEY_GLASS_BLUR, GLASS_DEFAULTS.blur.toString());
  };

  const colors = COLORS[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors,
        glassAlpha,
        glassBlur,
        setGlassAlpha: updateGlassAlpha,
        setGlassBlur: updateGlassBlur,
        resetGlass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
