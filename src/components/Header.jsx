import React, { useEffect, useState } from 'react';
import './Header.css';

function Header({ username = '' }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="app-header">
      <div className="user-info">
        {username && <span className="username">Hi, {username}!</span>}
      </div>
    </header>
  );
}

export default Header;
