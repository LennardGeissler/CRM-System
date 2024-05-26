// ToggleThemeButton.tsx
import React from 'react';
import './ToggleThemeButton.scss';
import { useTheme } from './ThemeContext';

const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={`toggle-theme-button ${theme}`} onClick={toggleTheme}>
      <span className="toggle-icon"></span>
    </button>
  );
}

export default ToggleThemeButton;