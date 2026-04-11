import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/profileContext";
import CustomerServiceModal from "../components/CustomerServiceModal";
import BindWallet from "./BindWallet.jsx";

// Image Assets
import badgeIcon from "../assets/images/profile/badge.png";
import notifIcon from "../assets/images/profile/notif.png";

// Notification bell component
import NotificationBell from "../components/NotificationBell";

// Import the update pages so clicking Edit navigates to the actual pages
// (these files already exist in your src/pages folder)
import UpdatePassword from "./UpdatePassword.jsx";
import UpdateWithdrawPassword from "./UpdateWithdrawPassword.jsx";

// ---- API URL (kept as before) ----
const API_URL = "https://keymuse-backend.onrender.com";

// Branding colors used in screenshots
const START_BLUE = "#1f4de6"; // deep profile heading blue
const END_BLUE = "#1f4de6";

/*
  Profile.jsx

  - Displays profile information and membership label/color based on vip level:
      VIP1 => BASIC (green)
      VIP2 => PREMIUM (purple)
      VIP3 => ELITE  (violet)
      VIP4 => VIP    (gold)
  - All Edit actions open the withdraw-password modal first.
  - Keeps existing logic (fetchProfile, local cache, logout modal, withdraw password verification, customer service modal).
  - This file only fixes a missing InfoItem definition and adds the membership label display.
*/

function GreyFadeMessage({ message, duration = 1000, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 20000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(245,247,251,0.93)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "#e6e6e6",
          color: "#222",
          borderRadius: "18px",
          padding: "1.2rem 2.5rem",
          fontWeight: 700,
          opacity: 0.96,
          fontSize: "1.18rem",
          boxShadow: "0 2px 16px 0 #0002",
          textAlign: "center",
          minWidth: "180px",
          letterSpacing: "0.01em",
          animation: "fade-in-out-profile-logout 1s linear",
        }}
      >
        {message}
      </div>
      <style>{`
        @keyframes fade-in-out-profile-logout {
          0% { opacity: 0; transform: scale(0.98);}
          10% { opacity: 1; transform: scale(1);}
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function LogoutModal({ open, onClose, onLogout }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.35)",
        minHeight: "100vh",
        minWidth: "100vw",
        pointerEvents: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs mx-auto rounded-xl shadow-xl"
        style={{
          background: "#fff",
          pointerEvents: "auto",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "16px",
          boxShadow: "0 2px 16px 0 #0002",
          marginBottom: 0,
          maxWidth: 390,
          minWidth: 320,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-4">
          <span className="text-[18px] font-semibold text-[#222] mb-2">Logout</span>
          <span className="text-sm text-gray-700">Are you sure you want to logout?</span>
        </div>
        <div className="flex justify-between gap-6 mt-3">
          <button
            className="flex-1 py-2 rounded-full font-semibold text-base"
            style={{
              background: "#f2f2f2",
              color: "#222",
              border: "none",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 rounded-full font-semibold text-base"
            style={{
              background: START_BLUE,
              color: "#fff",
              border: "none",
            }}
            onClick={onLogout}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function SecondaryPasswordModalProfile({
  open,
  onClose,
  onSubmit,
  password,
  setPassword,
  errorMsg,
  submitting,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        minHeight: "100vh",
        minWidth: "100vw",
        pointerEvents: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto rounded-xl shadow-xl"
        style={{
          background: "#fff",
          pointerEvents: "auto",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "18px",
          boxShadow: "0 2px 16px 0 #0002",
          maxWidth: 390,
          minWidth: 320,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <span className="text-[17px] font-semibold text-[#333]">Secondary Password</span>
          <button
            className="ml-2 rounded-full text-gray-400 px-1.5 py-1 transition hover:text-gray-700"
            onClick={onClose}
            style={{
              fontSize: "1.25rem",
              background: "#f2f2f2",
              border: "none",
              lineHeight: 1,
            }}
            aria-label="Cancel"
          >
            ×
          </button>
        </div>
        <input
          type="password"
          placeholder="Secondary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-200 rounded outline-none text-base"
          disabled={submitting}
          autoFocus
          style={{ background: "#f6f7fb" }}
        />
        {errorMsg && <div className="text-red-500 text-sm mb-2">{errorMsg}</div>}
        <button
          onClick={onSubmit}
          className="w-full py-2 mt-1 rounded-full text-white font-semibold text-base"
          style={{
            background: START_BLUE,
            opacity: submitting ? 0.7 : 1,
            transition: "opacity 0.2s",
            boxShadow: `0 1px 8px ${START_BLUE}22`,
          }}
          disabled={submitting}
        >
          {submitting ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, fetchProfile } = useProfile();

  const [localProfile, setLocalProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [destination, setDestination] = useState(null);
  const [destinationType, setDestinationType] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [fadeMsg, setFadeMsg] = useState("");

  const [showBindWallet, setShowBindWallet] = useState(false);

  useEffect(() => {
    fetchProfile && fetchProfile().catch(() => {});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem("currentUser", JSON.stringify(profile));
      } catch (e) {
        // ignore
      }
      setLocalProfile(profile);
    }
  }, [profile]);

  // All edits must use the password modal first
  const handleProtectedRoute = (targetPath, type = "redirect") => {
    setDestination(targetPath);
    setDestinationType(type);
    setPassword("");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmitPassword = async () => {
    setErrorMsg("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/verify-withdraw-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify({ password: password }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success) {
        setShowModal(false);
        
        if (destinationType === "bind-wallet") {
          setShowBindWallet(true);
        } else {
          fetchProfile && fetchProfile().finally(() => {
            if (destination) navigate(destination);
          });
        }
      } else {
        setErrorMsg(data.message || "Incorrect secondary password.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setFadeMsg("Logout Success");
    setTimeout(() => {
      setFadeMsg("");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      navigate("/login");
    }, 1000);
  };

  const handleBindWalletClose = () => {
    setShowBindWallet(false);
  };

  const p = profile || localProfile || {};
  const username = p.username || p.fullName || "MK737";
  const vipLevel = p.vipLevel ?? p.vip ?? 2;
  const fullName = p.fullName || username;

  // Map vip numeric level to label + color
  const membershipMap = {
    1: { label: "BASIC", color: "#10b981" },   // VIP1 => BASIC (green)
    2: { label: "PREMIUM", color: "#7c3aed" }, // VIP2 => PREMIUM (purple)
    3: { label: "ELITE", color: "#7f3fbf" },   // VIP3 => ELITE (violet)
    4: { label: "VIP", color: "#f59e0b" },     // VIP4 => VIP (gold)
  };
  const membership = membershipMap[Number(vipLevel)] || membershipMap[2];

  // Info item used in Personal Information column
  const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#6b6b6b", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#111" }}>{value || "No Address"}</div>
    </div>
  );

  // Row component matching requested UI (kept for potential use)
  const Row = ({ label, value, onEdit, editText = "Edit", showEdit = true }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{value}</div>
      </div>
      <div>
        {showEdit && (
          <button
            onClick={onEdit}
            style={{
              background: "transparent",
              border: "none",
              color: START_BLUE,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill={START_BLUE}/>
              <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill={START_BLUE}/>
            </svg>
            <span style={{ fontSize: 13 }}>{editText}</span>
          </button>
        )}
      </div>
    </div>
  );

  // Small Edit control used around the UI (all call handleProtectedRoute)
  const EditLink = ({ to = "/", label = "Edit", onClick }) => (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: "#111",
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
      aria-label="Edit"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#111"/>
        <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#111"/>
      </svg>
      <span style={{ fontSize: 13 }}>{label}</span>
    </button>
  );

  if (showBindWallet) {
    return <BindWallet onBack={handleBindWalletClose} />;
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden", background: "#fff" }}>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px 80px", color: "#111" }}>
        <style>{`
          /* Heading */
          .profile-heading {
            color: ${START_BLUE};
            font-weight: 900;
            letter-spacing: -0.02em;
            margin: 6px 0 26px 0;
            text-align: center;
          }

          /* Desktop / mobile font sizes for heading */
          @media (min-width: 992px) {
            .profile-heading { font-size: 48px; }
            .heading-edit { position: absolute; right: 56px; top: 36px; }
          }
          @media (max-width: 991px) {
            .profile-heading { font-size: 34px; }
            .heading-edit { position: absolute; right: 24px; top: 28px; }
          }

          /* Top row (avatar + name + VIP card) */
          .profile-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 28px;
            position: relative;
          }
          .profile-center {
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            flex-direction: column;
          }
          .profile-avatar {
            width: 110px;
            height: 110px;
            border-radius: 999px;
            background: #d6d6d6;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .profile-name {
            font-size: 22px;
            font-weight: 800;
            margin-top: 8px;
            color: #111;
          }
          .profile-edit-small { color: #6b6b6b; font-size: 13px; margin-top: 6px; cursor: pointer; display:inline-flex; align-items:center; gap:6px; }

          /* VIP box */
          .vip-box {
            min-width: 170px;
            border-radius: 6px;
            padding: 16px;
            border: 1px solid rgba(0,0,0,0.06);
            display:flex;
            align-items:center;
            justify-content:center;
            background: #fff;
          }

          /* Main info card (pale beige) */
          .info-card {
            background: #efeae7;
            border-radius: 6px;
            padding: 22px;
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 24px;
            align-items: start;
            margin-bottom: 28px;
          }
          .info-heading {
            background: transparent;
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom: 8px;
          }
          .section-title {
            font-weight: 800;
            font-size: 16px;
            color: #111;
            padding: 10px 12px;
            background: rgba(0,0,0,0.03);
            border-radius: 4px;
          }

          /* Security panel inner styles */
          .security-box {
            background: transparent;
            padding: 8px 0;
          }
          .security-field-label { font-size: 12px; color:#6b6b6b; margin-bottom:6px; }
          .security-value { font-weight: 700; color: #111; margin-bottom: 8px; }
          .security-input {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 12px;
            background: #fff;
          }
          .btn-row { display:flex; gap:12px; align-items:center; margin-bottom:12px; }
          .btn-primary {
            background: ${END_BLUE};
            color: #fff;
            padding: 10px 28px;
            border-radius: 28px;
            border: none;
            font-weight: 700;
            cursor: pointer;
          }
          .btn-outline {
            background: transparent;
            color: ${END_BLUE};
            padding: 9px 26px;
            border-radius: 28px;
            border: 2px solid ${END_BLUE};
            font-weight: 700;
            cursor: pointer;
          }

          /* Accounts list */
          .accounts {
            background: #fff;
            border-radius: 4px;
            padding: 10px 14px;
            border: 1px solid rgba(0,0,0,0.04);
          }
          .account-row { display:flex; align-items:center; justify-content:space-between; padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
          .account-row:last-child { border-bottom: none; }

          /* Small icon button used for section-level edit (round purple) */
          .round-edit {
            width: 36px;
            height: 36px;
            border-radius: 999px;
            background: #2b1b36;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            cursor:pointer;
            border: none;
          }

          @media (max-width: 900px) {
            .profile-top { flex-direction: column; align-items: center; gap:12px; }
            .profile-center { align-items: center; }
            .info-card { grid-template-columns: 1fr; }
            .vip-box { order: -1; width: 100%; justify-content:flex-start; }
            /* keep account rows in a horizontal layout on mobile so Edit stays on the right side */
            .account-row { flex-direction: row; align-items: center; justify-content: space-between; gap: 8px; }
            .btn-row { flex-wrap: wrap; }
            .heading-edit { position: absolute; right: 18px; top: 18px; }
          }
        `}</style>

        <h1 className="profile-heading">PROFILE DETAILS</h1>

        {/* small pencil icon on the right of the heading to match screenshot */}
        {/* REMOVED as requested */}

        <div style={{ height: 12, borderTop: "1px solid rgba(0,0,0,0.04)", marginBottom: 18 }} />

        {/* Top area: avatar, name, VIP box */}
        <div className="profile-top">
          <div style={{ flex: 1 }} />

          <div className="profile-center" aria-label="profile-main">
            <div className="profile-avatar" aria-hidden>
              {/* fallback avatar circle */}
              <svg width="110" height="110" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#bdbdbd" />
                <circle cx="32" cy="22" r="12" fill="#fff"/>
                <rect x="12" y="36" width="40" height="18" rx="9" fill="#fff"/>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="profile-name">{username}</div>
              <div
                className="profile-edit-small"
                /* made non-clickable but present */
                aria-disabled="true"
                role="button"
                style={{ cursor: "default", pointerEvents: "none" }}
                aria-label="Edit profile"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#6b6b6b"/>
                  <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#6b6b6b"/>
                </svg>
                <span style={{ fontSize: 13, color: "#6b6b6b" }}>Edit</span>
              </div>
            </div>
          </div>

          <div style={{ width: 220, display: "flex", justifyContent: "flex-end" }}>
            <div className="vip-box" aria-hidden>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                  {/* Membership label pill (dynamic) */}
                  <div
                    style={{
                      background: membership.color,
                      color: "#fff",
                      borderRadius: 18,
                      padding: "6px 12px",
                      fontWeight: 800,
                      fontSize: 13,
                      minWidth: 64,
                      textAlign: "center",
                    }}
                  >
                    {membership.label}
                  </div>

                  {/* small star circle (keeps existing visual) */}
                  <div style={{ width: 34, height: 34, borderRadius: 20, background: "#e6f7f3", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#16a34a" }}>
                    ☆
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#9b9b9b", marginBottom: 6 }}>RANK</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                  <span style={{ color: "#f5c518" }}>★</span>
                  <span style={{ color: "#f5c518" }}>★</span>
                  <span style={{ color: "#f5c518" }}>★</span>
                  <span style={{ color: "#f5c518" }}>★</span>
                  <span style={{ color: "#f5c518" }}>★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main info card */}
        <section className="info-card" aria-label="profile-info-card">
          <div>
            <div className="info-heading">
              <div className="section-title">Personal Information</div>
              <div>
                {/* small pencil between columns REMOVED as requested */}
              </div>
            </div>

            <div style={{ padding: "10px 8px 6px 8px" }}>
              <InfoItem label="Full Name" value={fullName} />
              <InfoItem label="Phone Number" value={p.phone || "xxxxxx"} />
              <InfoItem label="Email Address" value={p.email || "xxxx@xx.xx"} />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="section-title">Security</div>
              <button
                className="round-edit"
                /* present but not clickable per request */
                aria-label="Edit security"
                title="Edit security"
                aria-disabled="true"
                style={{ pointerEvents: "none" }}
              >
                ✎
              </button>
            </div>

            <div className="security-box">
              <div style={{ marginBottom: 10 }}>
                <div className="security-field-label">Password</div>
                <div className="security-value">••••••••</div>
                <div style={{ textAlign: "right" }}>
                  <EditLink onClick={() => handleProtectedRoute("/update-password", "redirect")} />
                </div>
              </div>

              <div style={{ marginTop: 6 }}>
                <div className="security-field-label">Secondary Password</div>
                <div style={{ fontSize: 14, color: "#111", marginBottom: 8 }}>*****</div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <EditLink onClick={() => handleProtectedRoute("/update-withdraw-password", "redirect")} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accounts section */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Accounts</div>
          <div>
            {/* Accounts header edit REMOVED as requested */}
          </div>
        </div>

        <div className="accounts" aria-label="accounts-list">
          {[
            { key: "erc20_usdt", label: "ERC-20 USDT Address" },
            { key: "trc20_usdt", label: "TRC-20 USDT Address" },
            { key: "erc20_usdc", label: "ERC-20 USDC Address" },
            { key: "trc20_usdc", label: "TRC-20 USDC Address" },
            { key: "eth", label: "ETH Address" },
            { key: "btc", label: "BTC Address" },
          ].map((acc) => (
            <div className="account-row" key={acc.key}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#6b6b6b", marginBottom: 6 }}>{acc.label}</div>
                <div style={{ fontSize: 14, color: "#111" }}>{p.addresses && p.addresses[acc.key] ? p.addresses[acc.key] : "No Address"}</div>
              </div>
              <div style={{ marginLeft: 16 }}>
                {/* When account edit is clicked, open password modal and then navigate to BindWallet */}
                <button
                  onClick={() => handleProtectedRoute("/bindwallet", "bind-wallet")}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#111",
                    fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: 14, marginRight: 6 }}>Edit</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#111"/>
                    <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#111"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer small navigation strip */}
        <div style={{ marginTop: 18, padding: "14px 0", borderTop: "1px solid rgba(0,0,0,0.04)", textAlign: "center", color: "#6b6b6b" }}>
          
        </div>
      </main>

      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onLogout={handleLogout} />

      <SecondaryPasswordModalProfile
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitPassword}
        password={password}
        setPassword={setPassword}
        errorMsg={errorMsg}
        submitting={submitting}
      />

      {fadeMsg && <GreyFadeMessage message={fadeMsg} duration={1000} onDone={() => setFadeMsg("")} />}

      <CustomerServiceModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}
