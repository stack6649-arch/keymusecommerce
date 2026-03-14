import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// VIP images (expected path in your repo)
import vip1Img from "../assets/images/vip/vip1.png";
import vip2Img from "../assets/images/vip/vip2.png";
import vip3Img from "../assets/images/vip/vip3.png";
import vip4Img from "../assets/images/vip/vip4.png";

/*
  VIP.jsx
  - Renders the "Premium Membership" page using the site's gradient/content style.
  - Assumes global header/footer are provided elsewhere (this file does not render them).
  - The "Return Home Page >" control under the header now acts as a "go back" button (navigate(-1)).
  - The VIP package selector is a full-width clickable box. Clicking anywhere opens a custom dropdown
    with all VIP options (VIP1..VIP4). The right side shows only an arrow icon (no VIP text) per request.
  - If the logged-in user's current VIP equals the selected VIP, the button shows "CURRENT" (disabled).
    Otherwise it shows "UPGRADE".
  - Uses localStorage.currentUser to determine the user's current VIP if available.
  - Updated: clicking UPGRADE will open the Customer Service modal (dispatch openCustomerService) instead of performing an in-page alert.
*/

const START_BLUE = "#1fb6fc";

const VIP_LEVELS = [
  {
    level: 1,
    title: "VIP1",
    image: vip1Img,
    bullets: [
      "Receive a set of 40 data optimization tasks.",
      "Profit for each data optimization is 0.5%.",
      "Combined data optimization profit is 2%.",
      "Activate with 100 GBP.",
      "Up to 3 sets of data optimization tasks can be completed per day.",
    ],
  },
  {
    level: 2,
    title: "VIP2",
    image: vip2Img,
    bullets: [
      "Receive a set of 45 data optimization tasks.",
      "Profit for each data optimization is 1%.",
      "Combined data optimization profit is 6%.",
      "Activate with 500 GBP.",
      "Up to 3 sets of data optimization tasks can be completed per day.",
    ],
  },
  {
    level: 3,
    title: "VIP3",
    image: vip3Img,
    bullets: [
      "Receive a set of 50 data optimization tasks.",
      "Profit for each data optimization is 1.5%.",
      "Combined data optimization profit is 9%.",
      "Activate with 2000 GBP.",
      "Up to 3 sets of data optimization tasks can be completed per day.",
    ],
  },
  {
    level: 4,
    title: "VIP4",
    image: vip4Img,
    bullets: [
      "Receive a set of 55 data optimization tasks.",
      "Profit for each data optimization is 2%.",
      "Combined data optimization profit is 12%.",
      "Activate with 5000 GBP.",
      "Up to 3 sets of data optimization tasks can be completed per day.",
    ],
  },
];

export default function VIP() {
  const navigate = useNavigate();

  // Determine logged in VIP from localStorage immediately (so page renders quickly)
  const [loggedInVip, setLoggedInVip] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        const v = Number(parsed.vipLevel ?? parsed.vip ?? parsed.level);
        return v || 2;
      }
    } catch (e) {
      // ignore parse errors
    }
    return 2;
  });

  // Default selected index: use loggedInVip if available, otherwise VIP2 if present
  const defaultIndex =
    VIP_LEVELS.findIndex((v) => v.level === loggedInVip) >= 0
      ? VIP_LEVELS.findIndex((v) => v.level === loggedInVip)
      : Math.max(0, VIP_LEVELS.findIndex((v) => v.level === 2));

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Sync loggedInVip if localStorage.currentUser changes in another tab
  useEffect(() => {
    function handleStorage() {
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          const parsed = JSON.parse(stored);
          const v = Number(parsed.vipLevel ?? parsed.vip ?? parsed.level) || 2;
          setLoggedInVip(v);
        }
      } catch (e) {}
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const selected = VIP_LEVELS[selectedIndex];

  const openCustomerServiceModal = () => {
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {
      // noop
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        background:
          "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)",
        color: "#fff",
      }}
    >
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 120px", color: "#fff" }}>
      

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ color: "#fff", fontSize: 32, margin: 0, fontWeight: 800 }}>Premium Membership</h1>
        </div>

        {/* Thin blue divider */}
        <div
          style={{
            height: 8,
            background: "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))",
            borderRadius: 4,
            marginBottom: 22,
          }}
        />

        {/* Content card */}
        <section
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06))",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
            border: "1px solid rgba(255,255,255,0.04)",
            padding: 28,
          }}
        >
          {/* Selected VIP image */}
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <img
              src={selected.image}
              alt={`VIP ${selected.level}`}
              style={{ maxWidth: 180, width: "24%", minWidth: 84, height: "auto", display: "inline-block" }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <h3 style={{ color: "#fff", fontSize: 20, marginBottom: 12 }}>Choose Your Package</h3>

            {/* package selector - full clickable box (click anywhere to open options) */}
            <div ref={containerRef} style={{ position: "relative", marginBottom: 18 }}>
              <div
                onClick={() => setOpen((s) => !s)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setOpen((s) => !s);
                  }
                }}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 4,
                  padding: "12px 14px",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Selected VIP package"
              >
                <span style={{ fontWeight: 600 }}>{selected.title}</span>
                {/* Right side shows only the arrow (no VIP text) */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 18l6-6-6-6" stroke="#a6f0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* custom dropdown menu */}
              {open && (
                <ul
                  role="listbox"
                  aria-label="VIP packages"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: "#072033",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 6,
                    listStyle: "none",
                    padding: 8,
                    zIndex: 1200,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                  }}
                >
                  {VIP_LEVELS.map((v, idx) => (
                    <li
                      key={v.level}
                      role="option"
                      aria-selected={selectedIndex === idx}
                      onClick={() => {
                        setSelectedIndex(idx);
                        setOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSelectedIndex(idx);
                          setOpen(false);
                        }
                      }}
                      tabIndex={0}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                        color: "#fff",
                        background: selectedIndex === idx ? "rgba(255,255,255,0.03)" : "transparent",
                        marginBottom: 6,
                      }}
                    >
                      {v.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* bullets */}
            <ul style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.9, marginLeft: 18 }}>
              {selected.bullets.map((b, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <span style={{ marginRight: 8 }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* action button: CURRENT (disabled) if selected === user's current vip, else UPGRADE */}
            <div style={{ marginTop: 22 }}>
              {loggedInVip === selected.level ? (
                <button
                  disabled
                  style={{
                    background: "#bfc2c6",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 4,
                    border: "none",
                    fontWeight: 700,
                    cursor: "not-allowed",
                  }}
                >
                  CURRENT
                </button>
              ) : (
                <button
                  onClick={() => {
                    // open customer service modal instead of in-app flow
                    try {
                      window.dispatchEvent(new CustomEvent("openCustomerService"));
                    } catch (err) {
                      // noop
                    }
                  }}
                  style={{
                    background: START_BLUE,
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 4,
                    border: "none",
                    fontWeight: 700,
                    boxShadow: `0 8px 28px ${START_BLUE}22`,
                    cursor: "pointer",
                  }}
                >
                  UPGRADE
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
