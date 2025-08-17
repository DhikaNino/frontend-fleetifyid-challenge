import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/employees', label: 'Karyawan' },
    { path: '/departments', label: 'Departemen' },
    { path: '/attendance', label: 'Absensi' },
    { path: '/attendance-logs', label: 'Log Absensi' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="header" ref={navRef}>
      <div className="container">
        <nav className="nav">
          <div className="nav-brand">
            <h1 className="nav-title">Fleetify.id</h1>
          </div>

          <div className="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}
          </div>

          <button
            className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Buka menu navigasi"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </nav>

        <div className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-mobile-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
