// src/components/Header.jsx
import React from "react";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import logo from "../assets/images/header/logo.a8b5034.png";
import "./Header.css"; // optional, only if you put CSS separately

/**
 * Header Component
 * @param {function} onMenuClick - function to trigger Sidebar open
 * @param {boolean} disableMenu - when true, disables the hamburger button
 */
export default function Header({ onMenuClick, disableMenu = false }) {
  return (
    <header className="header">
      <div className="header-bar">
        {/* Hamburger menu icon */}
        <img
          src={menuIcon}
          alt="Menu"
          className={`header-icon ${disableMenu ? "disabled" : ""}`}
          onClick={disableMenu ? undefined : onMenuClick}
          style={{
            cursor: disableMenu ? "not-allowed" : "pointer",
            opacity: disableMenu ? 0.5 : 1,
          }}
        />

        {/* Logo */}
        <div className="header-logo-wrap">
          <img src={logo} alt="Sequence Logo" className="header-logo" />
        </div>

        {/* Refresh / logout */}
        <img src={refreshIcon} alt="Refresh" className="header-icon" />
      </div>
    </header>
  );
}
