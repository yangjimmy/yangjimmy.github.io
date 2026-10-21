import { useState } from 'react';

// Switches Bootstrap's colour mode (data-bs-theme) and remembers the choice.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-bs-theme') || 'light');

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    setTheme(next);
  };

  return (
    <button type="button" className="theme-toggle ms-lg-2" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} />
    </button>
  );
}
