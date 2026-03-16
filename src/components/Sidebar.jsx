import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/*
  Sidebar.jsx

  - Places bold separators exactly at the positions you marked (between groups).
  - Does not change any other behaviour: no internal scrolling, clicking outside closes the sidebar,
    auto-closes on viewport >= 980px, items are semi-bold 12px, hover gradient, GA AGENCY single-line, content constrained to 75% height with 25% plain space.
  - Only the separator placements have been adjusted to the exact marked locations.
  - Updated navigation targets for the labelled items per your mapping.
  - Before login: Shows only public routes (products, dashboard, premium membership) + Contact Us + Sign Up / Log In.
  - After login: Shows all protected routes (main, access, etc.) plus public routes.
*/

export default function Sidebar({ open = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      setIsAuthenticated(!!token);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChanged = () => {
      try {
        const token = localStorage.getItem("authToken") || localStorage.getItem("token");
        setIsAuthenticated(!!token);
      } catch {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  // Always visible product categories
  const primary = [
    { label: "SHOES", to: "/shoes" },
    { label: "APPAREL", to: "/apparel" },
    { label: "ELECTRONICS", to: "/electronics" },
    { label: "ACCESSORIES", to: "/accessories" },
    { label: "JEWELLERY", to: "/jewelry" },
    { label: "WATCHES", to: "/watches" },
    { label: "FURNITURE", to: "/furniture" },
  ];

  // Protected routes - ONLY SHOW IF AUTHENTICATED
  const groupA = [
    { label: "MAIN", to: "/dashboards" },                  // Dashboards.jsx
    { label: "ACCESS", to: "/tasks" },                     // Tasks.jsx
    { label: "TOP UP", to: "/deposit" },                   // Deposit.jsx
    { label: "WITHDRAWAL", to: "/withdraw" },              // Withdraw.jsx
    { label: "MY REWARD", to: "/transaction-history" },    // TransactionHistory.jsx
  ];

  const groupB = [
    { label: "MY ACCOUNT", to: "/profile" },               // Profile.jsx
    { label: "REFERRAL CODE", to: "/referral" },           // Referral.jsx
  ];

  const groupC = [
    { label: "ORDERS", to: "/records" },                   // Records.jsx
    { label: "FUNDS", to: "/transaction-history" },        // TransactionHistory.jsx
  ];

  // Always visible (public)
  const tail = [
    { label: "PREMIUM MEMBERSHIP", to: "/vip" },
    { label: "DASHBOARD", to: "/dashboard" },              // Dashboard.jsx
  ];

  // Public unprotected items - ONLY SHOW IF NOT AUTHENTICATED
  const publicItems = [
    { label: "CONTACT US", to: "/ContactUs", icon: "✉" },
    { label: "SIGN UP / LOG IN", to: "/login", icon: "👤" },
  ];

  // Close sidebar when viewport expands to desktop
  useEffect(() => {
    function onResize() {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 980 && open) {
        onClose();
      }
    }
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [open, onClose]);

  // Close when clicking outside
  useEffect(() => {
    function handler(e) {
      if (!open) return;
      const target = e.target;
      if (panelRef.current && panelRef.current.contains(target)) return;
      onClose();
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open, onClose]);

  function go(to) {
    try { onClose && onClose(); } catch (e) {}
    setTimeout(() => {
      try {
        navigate(to);
      } catch {
        window.location.href = to;
      }
    }, 120);
  }

  function isActive(to) {
    if (!to) return false;
    const p = (location && location.pathname) || "";
    if (p === to) return true;
    const normalized = to.replace(/\/*$/, "");
    return normalized !== "" && p.includes(normalized);
  }

  return (
    <>
      <style>{`
        :root{
          --sidebar-width: 320px;
          --sidebar-bg: #ffffff;
          --sidebar-text: #0b0b0b;
          --sidebar-sep: rgba(11,43,74,0.08);
          --sidebar-active: #0b4dff;
          --sidebar-font: "Segoe UI", "Arial", sans-serif;
        }

        .ga-sidebar-panel {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: var(--sidebar-width);
          max-width: 86%;
          background: var(--sidebar-bg);
          z-index: 1400;
          transform: translateX(${open ? "0" : "-100%"});
          transition: transform 180ms ease;
          box-shadow: 6px 0 30px rgba(11,18,25,0.06);
          display: flex;
          flex-direction: column;
          font-family: var(--sidebar-font);
          -webkit-font-smoothing: antialiased;
          overflow: visible; /* no internal scrollbar on panel itself */
        }

        /* Header single-line - reduced height for better mobile fit */
        .ga-sidebar-header {
          padding: 12px 18px;
          font-weight: 900;
          font-size: 28px;
          color: var(--sidebar-text);
          box-sizing: border-box;
          border-bottom: 3px solid var(--sidebar-sep); /* bold separator under header */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 0 0 auto;
        }

        /* Content area constrained to 75% of viewport height (top) */
        .ga-sidebar-content {
          height: 75vh;
          overflow: auto; /* allow scrolling so all items are reachable on mobile */
          -webkit-overflow-scrolling: touch;
          display: flex;
          flex-direction: column;
        }

        /* Bottom plain space = 25% of viewport height */
        .ga-sidebar-bottom-space {
          height: 25vh;
          flex: 0 0 auto;
          background: transparent;
        }

        .ga-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        /* Items: semi-bold 12px and neat spacing */
        .ga-list li {
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 600;
          color: var(--sidebar-text);
          cursor: pointer;
          box-sizing: border-box;
          letter-spacing: 0.01em;
          line-height: 1.3;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ga-list li .label-text { text-transform: uppercase; }

        .ga-list li .icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        /* Hover gradient blue */
        .ga-list li:hover {
          background: linear-gradient(90deg, rgba(11,77,255,0.95) 0%, rgba(11,77,255,0.85) 100%);
          color: #ffffff;
        }

        /* Active solid blue */
        .ga-list li.active {
          background: var(--sidebar-active);
          color: #fff;
        }

        /* Separator style (thicker) placed only where marked */
        .ga-sep {
          height: 3px;
          background: var(--sidebar-sep);
          margin: 8px 0;
        }

        .ga-tail {
          margin-top: 8px;
          padding-bottom: 12px; /* ensure last tail item isn't clipped and remains clickable */
        }

        .ga-public-items {
          margin-top: auto;
          border-top: 3px solid var(--sidebar-sep);
          padding-top: 8px;
        }

        /* Hide panel at desktop widths */
        @media (min-width: 980px) {
          .ga-sidebar-panel {
            transform: translateX(-100%) !important;
          }
        }

        /* Small devices adjustments */
        @media (max-width: 420px) {
          .ga-sidebar-header { font-size: 30px; padding: 10px 14px; } /* slightly different mobile tuning */
          .ga-list li { padding: 12px 16px; font-size: 12px; }
          .ga-sidebar-content { height: 72vh; }
          .ga-sidebar-bottom-space { height: 28vh; }
        }
      `}</style>

      <aside
        className="ga-sidebar-panel"
        ref={panelRef}
        role="dialog"
        aria-hidden={!open}
        aria-label="Site navigation"
      >
        <div className="ga-sidebar-header">KEYMUS-ECOMMERCE</div>

        <div className="ga-sidebar-content">
          {/* Primary group - always visible */}
          <div>
            <ul className="ga-list" aria-label="Primary navigation">
              {primary.map((it) => (
                <li
                  key={it.label}
                  className={isActive(it.to) ? "active" : ""}
                  onClick={() => go(it.to)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
                >
                  <span className="label-text">{it.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Separator after primary (where you marked) */}
          <div className="ga-sep" />

          {/* Group A - ONLY SHOW IF AUTHENTICATED */}
          {isAuthenticated && (
            <>
              <div>
                <ul className="ga-list" aria-label="Group A">
                  {groupA.map((it) => (
                    <li
                      key={it.label}
                      onClick={() => go(it.to)}
                      role="button"
                      tabIndex={0}
                      className={isActive(it.to) ? "active" : ""}
                      onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
                    >
                      <span className="label-text">{it.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Separator after group A (where you marked) */}
              <div className="ga-sep" />

              {/* Group B - ONLY SHOW IF AUTHENTICATED */}
              <div>
                <ul className="ga-list" aria-label="Group B">
                  {groupB.map((it) => (
                    <li
                      key={it.label}
                      onClick={() => go(it.to)}
                      role="button"
                      tabIndex={0}
                      className={isActive(it.to) ? "active" : ""}
                      onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
                    >
                      <span className="label-text">{it.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Separator after group B (where you marked) */}
              <div className="ga-sep" />

              {/* Group C - ONLY SHOW IF AUTHENTICATED */}
              <div>
                <ul className="ga-list" aria-label="Group C">
                  {groupC.map((it) => (
                    <li
                      key={it.label}
                      onClick={() => go(it.to)}
                      role="button"
                      tabIndex={0}
                      className={isActive(it.to) ? "active" : ""}
                      onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
                    >
                      <span className="label-text">{it.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Separator before tail (where you marked) */}
              <div className="ga-sep" />
            </>
          )}

          {/* Tail items - always visible */}
          <div className="ga-tail">
            <ul className="ga-list" aria-label="Tail navigation">
              {tail.map((it) => (
                <li
                  key={it.label}
                  onClick={() => go(it.to)}
                  role="button"
                  tabIndex={0}
                  className={isActive(it.to) ? "active" : ""}
                  onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
                >
                  <span className="label-text">{it.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Public items - ONLY SHOW IF NOT AUTHENTICATED */}
          {!isAuthenticated && (
            <div className="ga-public-items">
              <ul className="ga-list" aria-label="Public navigation">
                {publicItems.map((it) => (
                  <li
                    key={it.label}
                    onClick={() => go(it.to)}
                    role="button"
                    tabIndex={0}
                    className={isActive(it.to) ? "active" : ""}
                    onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
                  >
                    <span className="icon">{it.icon}</span>
                    <span className="label-text">{it.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom plain space (25% of viewport) */}
        <div className="ga-sidebar-bottom-space" aria-hidden />
      </aside>
    </>
  );
}
