import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">🍎 Nutrition Tracker</h1>
        <p className="header-subtitle">Track your daily nutrition intake</p>
      </div>
    </header>
  );
};

export default Header;
