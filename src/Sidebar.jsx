import React from "react";
import { Link } from "react-router-dom";
import accountIcon from "../assets/images/dashboard/auth.svg"; // same as Dashboard sidebar

export default function Sidebar({ open, onClose }) {
  return (
    <div className={`dashboard-sidebar-overlay${open ? " open" : ""}`}>
      <div className="dashboard-sidebar">
        {/* Close button (× character, no image needed) */}
        <button
          className="dashboard-sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          &times;
        </button>

        <div className="dashboard-sidebar-title">SS&amp;C Sequence</div>

        <nav className="dashboard-sidebar-nav">
          <Link to="/shoes" className="dashboard-sidebar-item" onClick={onClose}>
            SHOES
          </Link>
          <Link to="/apparel" className="dashboard-sidebar-item" onClick={onClose}>
            APPAREL
          </Link>
          <Link to="/electronics" className="dashboard-sidebar-item" onClick={onClose}>
            ELECTRONICS
          </Link>
          <Link to="/accessories" className="dashboard-sidebar-item" onClick={onClose}>
            ACCESSORIES
          </Link>
          <Link to="/jewelry" className="dashboard-sidebar-item" onClick={onClose}>
            JEWELRY
          </Link>
          <Link to="/watches" className="dashboard-sidebar-item" onClick={onClose}>
            WATCHES
          </Link>
          <Link to="/furniture" className="dashboard-sidebar-item" onClick={onClose}>
            FURNITURE
          </Link>
          <Link to="/commodities" className="dashboard-sidebar-item" onClick={onClose}>
            COMMODITIES
          </Link>

          <hr className="dashboard-sidebar-divider" />

          <Link
            to="/profile"
            className="dashboard-sidebar-item dashboard-sidebar-account"
            onClick={onClose}
          >
            <img
              src={accountIcon}
              alt="Account"
              className="dashboard-sidebar-account-icon"
            />
            <span className="dashboard-sidebar-account-text">MY ACCOUNT</span>
          </Link>

          <Link to="/dashboards" className="dashboard-sidebar-item" onClick={onClose}>
            DASHBOARD
          </Link>
          <Link to="/vip" className="dashboard-sidebar-item" onClick={onClose}>
            PREMIUM MEMBERSHIP
          </Link>
        </nav>
      </div>
    </div>
  );
}