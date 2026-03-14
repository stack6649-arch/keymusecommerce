// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import menuIcon from "../assets/images/header/menu.svg";
import logo from "../assets/images/header/logo.a8b5034.png";
import "./Header.css";

export default function Header({ onMenuClick, disableMenu = false }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const navItems = [
    { label: "Premium Membership", to: "/vip", star: true },
    { label: "Shoes", to: "/shoes" },
    { label: "Apparel", to: "/apparel" },
    { label: "Electronics", to: "/electronics" },
    { label: "Accessories", to: "/accessories" },
    { label: "Jewellery", to: "/jewelry" },
    { label: "Watches", to: "/watches" },
    { label: "Furnitures", to: "/furniture" },
    { label: "Commodities", to: "/commodities" },
    { label: "Events", to: "/events" },
  ];

  return (
    <header className="header" role="banner" style={{ background: "#fff" }}>
      <style>{`
        .ga-header-bar {
          width: 100%;
          padding: 16px 40px; /* taller header */
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          box-sizing: border-box;
        }

        .ga-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-icon.menu {
          width: 28px;
          height: 28px;
          cursor: pointer;
        }

        .header-icon.menu.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .header-logo-wrap {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .header-logo {
          height: 56px; /* bigger logo */
          width: auto;
        }

        /* CENTER NAV */
        .nav-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: none;
        }

        .nav-center ul {
          display: flex;
          gap: 30px;
          list-style: none;
          padding: 0;
          margin: 0;
          align-items: center;
        }

        .nav-center a {
          color: #111;
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
          font-size: 15px;
        }

        /* Star for Premium Membership */
        .nav-center li .star {
          margin-right: 4px;
          color: black;
          font-size: 14px;
        }

        /* Make center nav scrollable if it overflows */
        @media (min-width: 980px) {
          .header-icon.menu {
            display: none !important;
          }

          .nav-center {
            display: block;
            max-width: calc(100% - 220px); /* space for logo + login */
            overflow-x: auto;
            white-space: nowrap;
          }

          .nav-center ul {
            gap: 30px;
            flex-wrap: nowrap;
          }

          /* hide scroll bar */
          .nav-center::-webkit-scrollbar {
            display: none;
          }
          .nav-center {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }

        /* MOBILE */
        @media (max-width: 979px) {
          .nav-center {
            display: none;
          }

          .header-logo {
            height: 36px;
          }
        }

        /* RIGHT SIDE */
        .ga-right {
          display: flex;
          align-items: center;
        }

        .ga-login-link {
          color: #111;
          text-decoration: none;
          font-weight: 700;
          padding: 6px 10px;
          white-space: nowrap;
        }
      `}</style>

      <div className="ga-header-bar">
        {/* LEFT */}
        <div className="ga-left">
          <img
            src={menuIcon}
            alt="Menu"
            className={`header-icon menu ${disableMenu ? "disabled" : ""}`}
            onClick={disableMenu ? undefined : onMenuClick}
          />

          <div
            className="header-logo-wrap"
            role="button"
            tabIndex={0}
            onClick={handleLogoClick}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") handleLogoClick();
            }}
          >
            <img src={logo} alt="GA Agency" className="header-logo" />
          </div>
        </div>

        {/* CENTER NAV */}
        <nav className="nav-center">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                {item.star && <span className="star">★</span>}
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* RIGHT */}
        <div className="ga-right">
          <Link to="/login" className="ga-login-link">
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}