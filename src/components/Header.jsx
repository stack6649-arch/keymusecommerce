import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import menuIcon from "../assets/images/header/menu.svg";
import logo from "../assets/images/header/Keylogo7.png";
import "./Header.css";

/*
  Header.jsx

  Changes in this file:
  - Updated Main dropdown submenu targets so each item navigates to the app pages you requested.
  - On Login page and before authentication: Show only public routes (products, premium membership, dashboard)
  - After authentication: Show all routes including protected ones
  - Mobile sidebar now uses same filtered routes based on authentication status
*/

export default function Header({ onMenuClick, disableMenu = false, isLoginPage = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  // When logo is clicked, send authenticated users to /dashboards, otherwise to public /dashboard
  const handleLogoClick = () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) navigate("/dashboard");
    else navigate("/dashboard");
  };

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      setIsAuthenticated(!!token);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Product category nav (scrollable on tablet) - ALWAYS VISIBLE
  const productNavItems = [
    { label: "Shoes", to: "/shoes" },
    { label: "Apparel", to: "/apparel" },
    { label: "Electronics", to: "/electronics" },
    { label: "Accessories", to: "/accessories" },
    { label: "Jewellery", to: "/jewelry" },
    { label: "Watches", to: "/watches" },
    { label: "Furniture", to: "/furniture" },
  ];

  const fixedCenterItems = [{ label: "★ Premium Membership", to: "/vip", star: true }];

  // Main dropdown sections - ONLY SHOW IF AUTHENTICATED
  const protectedMainSections = [
    {
      id: "asset",
      title: "Asset",
      items: [
        { label: "Access", to: "/tasks" },
        { label: "Top Up", to: "/deposit" },
        { label: "Withdrawal", to: "/withdraw" },
        { label: "My Reward", to: "/transaction-history" },
      ],
    },
    {
      id: "profile",
      title: "Profile",
      items: [
        { label: "My Account", to: "/profile" },
        { label: "Referral Code", to: "/referral" },
      ],
    },
    {
      id: "history",
      title: "History",
      items: [
        { label: "Orders", to: "/records" },
        { label: "Funds", to: "/transaction-history" },
      ],
    },
  ];

  // Main sections to show based on auth status
  const mainSections = isAuthenticated ? protectedMainSections : [];

  // User state + refs
  const [username, setUsername] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userBtnRef = useRef(null);
  const userPortalContentRef = useRef(null);

  // Main dropdown portal state + refs
  const [mainOpen, setMainOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const mainBtnRef = useRef(null);
  const portalRootRef = useRef(null);
  const portalContentRef = useRef(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });

  // User menu portal position
  const [userMenuPos, setUserMenuPos] = useState({ top: 0, left: 0 });

  // load username
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) {
        setUsername("");
        return;
      }
      const cur = localStorage.getItem("currentUser");
      if (cur) {
        const parsed = JSON.parse(cur);
        if (parsed && parsed.username) {
          setUsername(parsed.username);
          return;
        }
      }
      const raw = localStorage.getItem("user");
      if (raw) {
        setUsername(raw);
        return;
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChanged = (e) => {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      setIsAuthenticated(!!token);
      if (e.detail && e.detail.username) {
        setUsername(e.detail.username);
      }
    };

    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  // create portal root for dropdowns
  useEffect(() => {
    if (!portalRootRef.current) {
      const existing = document.getElementById("header-main-portal-root");
      if (existing) portalRootRef.current = existing;
      else {
        const el = document.createElement("div");
        el.id = "header-main-portal-root";
        document.body.appendChild(el);
        portalRootRef.current = el;
      }
    }
  }, []);

  // compute portal position for Main dropdown
  const updatePortalPosition = () => {
    const btn = mainBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPortalPos({ top: Math.round(r.bottom + 8), left: Math.round(r.left) });
  };

  useLayoutEffect(() => {
    if (mainOpen) updatePortalPosition();
  }, [mainOpen]);

  useEffect(() => {
    if (!mainOpen) return;
    const onScrollResize = () => updatePortalPosition();
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [mainOpen]);

  // compute user menu position
  const updateUserMenuPosition = () => {
    const btn = userBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();

    // menu width used for preventing overflow to the right
    const MENU_WIDTH = 220; // px, matches the visual size in screenshot
    const PAGE_PADDING = 12; // minimal gap from right edge

    let left = Math.round(r.left);
    // If the menu would go beyond viewport right edge, clamp it so it stays within page
    const maxLeft = Math.max(PAGE_PADDING, Math.round(window.innerWidth - MENU_WIDTH - PAGE_PADDING));
    if (left > maxLeft) left = maxLeft;
    if (left < PAGE_PADDING) left = PAGE_PADDING;

    setUserMenuPos({ top: Math.round(r.bottom + 8), left });
  };

  useLayoutEffect(() => {
    if (userMenuOpen) updateUserMenuPosition();
  }, [userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onScrollResize = () => updateUserMenuPosition();
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [userMenuOpen]);

  // Outside click handling: check both portal content and user portal content and the buttons
  useEffect(() => {
    function onDocPointerDown(e) {
      const target = e.target;

      if (mainOpen) {
        if (portalContentRef.current && portalContentRef.current.contains(target)) return;
        if (mainBtnRef.current && mainBtnRef.current.contains(target)) return;
        setMainOpen(false);
        setActiveSubmenu(null);
      }

      if (userMenuOpen) {
        if (userPortalContentRef.current && userPortalContentRef.current.contains(target)) return;
        if (userBtnRef.current && userBtnRef.current.contains(target)) return;
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("mousedown", onDocPointerDown);
    function onKey(e) {
      if (e.key === "Escape") {
        setMainOpen(false);
        setActiveSubmenu(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mainOpen, userMenuOpen]);

  // responsive hide main dropdown on small screens
  useEffect(() => {
    function onResize() {
      if (window.innerWidth < 980) {
        setMainOpen(false);
        setActiveSubmenu(null);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const goToLogin = () => navigate("/login");
  const goToProfile = () => {
    setUserMenuOpen(false);
    navigate("/profile");
  };
  const handleLogoutClick = () => {
    setUserMenuOpen(false);
    setShowLogoutModal(true);
  };
  const handleConfirmLogout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("username");
    } catch {}
    setShowLogoutModal(false);
    setUsername("");
    setIsAuthenticated(false);
    navigate("/logout");
  };
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const onMainClick = (e) => {
    e.stopPropagation();
    updatePortalPosition();
    setMainOpen((prev) => {
      const next = !prev;
      if (!next) setActiveSubmenu(null);
      return next;
    });
  };

  const onLeftSectionClick = (sectionId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveSubmenu((prev) => (prev === sectionId ? null : sectionId));
    setMainOpen(true);
    updatePortalPosition();
  };

  const go = (to) => {
    setMainOpen(false);
    setActiveSubmenu(null);
    navigate(to);
  };

  const PortalDropdown = () => {
    if (!portalRootRef.current || mainSections.length === 0) return null;
    const style = {
      position: "fixed",
      top: `${portalPos.top}px`,
      left: `${portalPos.left}px`,
      zIndex: 14000,
      display: "flex",
      gap: 12,
      pointerEvents: "auto",
    };
    return ReactDOM.createPortal(
      <div ref={portalContentRef} style={style} id="header-main-portal-content" role="menu" aria-label="Main dropdown">
        <div className="main-left" role="menu" aria-label="Main sections">
          {mainSections.map((sec) => (
            <div
              key={sec.id}
              className="left-item"
              role="menuitem"
              tabIndex={0}
              onClick={(e) => onLeftSectionClick(sec.id, e)}
              onKeyPress={(e) => { if (e.key === "Enter") onLeftSectionClick(sec.id, e); }}
              aria-expanded={activeSubmenu === sec.id}
              aria-controls={`submenu-${sec.id}`}
            >
              <span>{sec.title}</span>
              <span aria-hidden>›</span>
            </div>
          ))}
        </div>

        {activeSubmenu && (
          <div className="main-right" id={`submenu-${activeSubmenu}`} role="menu" aria-label={`${activeSubmenu} submenu`}>
            {mainSections.find((s) => s.id === activeSubmenu)?.items?.map((it) => (
              <div
                key={it.label}
                className="col-item"
                role="menuitem"
                tabIndex={0}
                onClick={() => go(it.to)}
                onKeyPress={(e) => { if (e.key === "Enter") go(it.to); }}
              >
                {it.label}
              </div>
            ))}
          </div>
        )}
      </div>,
      portalRootRef.current
    );
  };

  // Logout confirmation modal
  const LogoutModal = () => {
    if (!portalRootRef.current) return null;

    const style = {
      position: "fixed",
      inset: 0,
      zIndex: 15000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.45)",
      padding: 20,
      pointerEvents: "auto",
    };

    return ReactDOM.createPortal(
      <div style={style}>
        <div
          style={{
            width: 420,
            maxWidth: "100%",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            padding: "24px 20px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleCancelLogout}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 24,
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close logout modal"
          >
            ×
          </button>

          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: 18,
              fontWeight: 700,
              color: "#111",
            }}
          >
            Are you sure you want to quit?
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={handleCancelLogout}
              style={{
                padding: "12px 16px",
                borderRadius: 24,
                border: "2px solid #0645d6",
                background: "#fff",
                color: "#0645d6",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f0f4ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
              }}
            >
              Close
            </button>

            <button
              onClick={handleConfirmLogout}
              style={{
                padding: "12px 16px",
                borderRadius: 24,
                border: "none",
                background: "#0645d6",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#0535b8";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#0645d6";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>,
      portalRootRef.current
    );
  };

  // Render user menu as portal positioned under username button
  const UserMenuPortal = ({ portalRoot, pos, refContent, onProfile, onLogout }) => {
    if (!portalRoot) return null;

    // keep consistent width with the clamping used in updateUserMenuPosition
    const MENU_WIDTH = 220;

    const style = {
      position: "fixed",
      top: `${pos.top}px`,
      left: `${pos.left}px`,
      zIndex: 14000,
      pointerEvents: "auto",
    };

    return ReactDOM.createPortal(
      <div
        ref={refContent}
        style={style}
        id="header-user-portal-content"
        role="menu"
        aria-label="User menu portal"
      >
        <div
          style={{
            minWidth: MENU_WIDTH,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(11,18,25,0.12)",
            border: "1px solid rgba(11,43,74,0.06)",
            overflow: "hidden",
            fontFamily: "inherit",
          }}
        >
          <button
            onClick={onProfile}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "12px 16px",
              border: "none",
              background: "transparent",
              textAlign: "left",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center" }} aria-hidden>
              {/* user icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20c0-3.3137 2.6863-6 6-6h4c3.3137 0 6 2.6863 6 6" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>My Account</span>
          </button>

          <div style={{ height: 1, background: "rgba(11,43,74,0.06)" }} />

          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "12px 16px",
              border: "none",
              background: "transparent",
              textAlign: "left",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            <span style={{ width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center" }} aria-hidden>
              {/* logout icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
                <path d="M16 17l5-5-5-5" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>,
      portalRootRef.current
    );
  };

  // Toggle user menu (compute position when opening)
  const onUserButtonClick = (e) => {
    e.stopPropagation();
    updateUserMenuPosition();
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <header className="header" role="banner" style={{ background: "#fff" }}>
      <style>{`
        /* Header layout */
        .ga-header-bar { width:100%; padding:12px 20px; display:flex; align-items:center; justify-content:space-between; position:relative; box-sizing:border-box; z-index:1100; }
        .ga-left { display:flex; align-items:center; gap:14px; flex:0 0 auto; }
        .header-icon.menu { width:28px; height:28px; cursor:pointer; }
        .header-logo { height:40px; width:auto; }

        /* Center nav: fixed group + product-nav scroll area */
        .nav-center { position:absolute; left:50%; transform:translateX(-50%); width:72%; max-width:1100px; display:flex; align-items:center; justify-content:center; pointer-events:none; }
        .nav-center-inner { width:100%; display:flex; align-items:center; gap:16px; pointer-events:auto; }

        .center-fixed { display:flex; gap:20px; align-items:center; flex:0 0 auto; white-space:nowrap; }

        /* product nav: default behavior no scroll on large desktop, scroll on tablet range */
        .product-nav { display:flex; gap:22px; align-items:center; white-space:nowrap; flex:1 1 auto; }

        /* desktop: >=1200px => no scroll */
        @media (min-width:1200px) {
          .product-nav { overflow: visible; }
        }

        /* tablet: 980px <= width < 1200px => allow horizontal scroll when overflow */
        @media (min-width:980px) and (max-width:1199px) {
          .product-nav { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
          .product-nav::-webkit-scrollbar { height:8px; }
          .product-nav::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius:4px; }
        }

        /* mobile: <980px hide center nav and show hamburger */
        @media (max-width:979px) {
          .nav-center { display:none; }
          .header-logo { height:36px; }
          .header-icon.menu { display:inline-block !important; }
        }

        /* Hide hamburger on PC (>=980) */
        @media (min-width:980px) {
          .header-icon.menu { display:none !important; }
        }

        .nav-link, .nav-center a { color:#111; text-decoration:none; font-weight:600; font-size:15px; background:transparent; border:none; cursor:pointer; white-space:nowrap; padding:6px 2px; }
        .main-link { color:#0645d6; text-decoration:underline; font-weight:700; }

        /* Portal dropdown styles */
        .main-left { background:#fff; padding:8px 6px; border-radius:6px; border:1px solid rgba(11,43,74,0.04); box-shadow:0 8px 30px rgba(11,18,25,0.12); min-width:160px; }
        .left-item { padding:12px 18px; font-weight:600; display:flex; justify-content:space-between; cursor:pointer; }
        .left-item:hover { background: rgba(11,43,74,0.04); }
        .main-right { background:#fff; padding:10px 12px; border-radius:6px; border:1px solid rgba(11,43,74,0.04); box-shadow:0 8px 30px rgba(11,18,25,0.12); min-width:180px; }
        .col-item { padding:10px 14px; cursor:pointer; font-weight:600; }
        .col-item:hover { background: rgba(11,77,255,0.06); color:#0b4dff; }

        /* Username button with subtle grey border */
        .ga-user-btn { display:inline-flex; align-items:center; justify-content:center; padding:8px 12px; border-radius:8px; border:1px solid rgba(0,0,0,0.12); background:#fff; color:#111; font-weight:700; cursor:pointer; white-space:nowrap; }
        .ga-login-link { display:inline-block; padding:8px 14px; border-radius:8px; border:none; background:transparent; color:#0645d6; font-weight:700; cursor:pointer; white-space:nowrap; }
        .ga-right { display:flex; alignItems:center; gap:12px; flex:0 0 auto; }

        /* Ensure center nav doesn't wrap into two lines */
        .nav-center-inner { flex-wrap: nowrap; overflow: visible; }
        .center-fixed, .product-nav { flex-wrap: nowrap; }
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
            onKeyPress={(e) => { if (e.key === "Enter" || e.key === " ") handleLogoClick(); }}
          >
            <img src={logo} alt="GA Agency" className="header-logo" />
          </div>
        </div>

        {/* CENTER NAV - ONLY SHOW IF AUTHENTICATED */}
        {isAuthenticated && (
          <div className="nav-center" aria-hidden={false}>
            <div className="nav-center-inner">
              <div className="center-fixed" aria-hidden={false}>
                <button ref={mainBtnRef} className="nav-link main-link" onClick={onMainClick} aria-haspopup="true" aria-expanded={mainOpen}>
                  Main
                </button>
                <Link className="nav-link" to="/dashboards">Dashboard</Link>
                {fixedCenterItems.map((it) => (
                  <Link key={it.to} to={it.to} className="nav-link">{it.label}</Link>
                ))}
              </div>

              <div className="product-nav" role="navigation" aria-label="Product categories">
                {productNavItems.map((it) => (
                  <Link key={it.to} to={it.to} className="nav-link">{it.label}</Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CENTER NAV - PUBLIC VERSION FOR LOGIN PAGE */}
        {!isAuthenticated && (
          <div className="nav-center" aria-hidden={false}>
            <div className="nav-center-inner">
              <div className="center-fixed" aria-hidden={false}>
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                {fixedCenterItems.map((it) => (
                  <Link key={it.to} to={it.to} className="nav-link">{it.label}</Link>
                ))}
              </div>

              <div className="product-nav" role="navigation" aria-label="Product categories">
                {productNavItems.map((it) => (
                  <Link key={it.to} to={it.to} className="nav-link">{it.label}</Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div className="ga-right">
          {username ? (
            <>
              <button
                ref={userBtnRef}
                className="ga-user-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  updateUserMenuPosition();
                  setUserMenuOpen((s) => !s);
                }}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                aria-label={`Account (${username})`}
                title={`Account (${username})`}
              >
                {username}
              </button>

              {/* Render user menu in a portal so it floats below the username button */}
              {userMenuOpen && portalRootRef.current && (
                <UserMenuPortal
                  portalRoot={portalRootRef.current}
                  pos={userMenuPos}
                  refContent={userPortalContentRef}
                  onProfile={goToProfile}
                  onLogout={handleLogoutClick}
                />
              )}
            </>
          ) : (
            <button className="ga-login-link" onClick={goToLogin}>Log In</button>
          )}
        </div>
      </div>

      {/* Main dropdown portal - ONLY SHOW IF AUTHENTICATED */}
      {mainOpen && isAuthenticated && portalRootRef.current && <PortalDropdown />}

      {/* Logout confirmation modal */}
      {showLogoutModal && portalRootRef.current && <LogoutModal />}

    </header>
  );
}
