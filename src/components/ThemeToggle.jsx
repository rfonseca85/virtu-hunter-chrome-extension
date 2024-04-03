import React, { useState, useEffect } from 'react';
import { ThemeType, DEFAULT_THEME } from '../consts';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Switch } from '@material-tailwind/react';

function ThemeToggle() {
  const [localTheme, saveLocalTheme] = useLocalStorage('theme', DEFAULT_THEME);
  const [theme, setTheme] = useState(localTheme);
  const isDark = theme === ThemeType.DARK;

  useEffect(() => {
    if (localTheme) {
      const themeStored =
        localTheme === ThemeType.DARK ? ThemeType.DARK : ThemeType.LIGHT;
      setTheme(themeStored);
      saveLocalTheme(themeStored);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme =
      theme === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT;
    setTheme(newTheme);
    saveLocalTheme(newTheme);
  };

  return (
    <Switch
      onClick={toggleTheme}
      defaultChecked={isDark}
      ripple={false}
      className='h-full w-full checked:bg-gray-900 bg-indigo-50'
      containerProps={{
        className: 'w-11 h-6',
      }}
      circleProps={{
        className: 'before:hidden left-0.5 border-none',
      }}
    />
  );
}

export default ThemeToggle;
