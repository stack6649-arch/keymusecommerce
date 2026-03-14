import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/profileContext";
import CustomerServiceModal from "../components/CustomerServiceModal";

// Image Assets
import badgeIcon from "../assets/images/profile/badge.png";
import notifIcon from "../assets/images/profile/notif.png";

// Notification bell component
import NotificationBell from "../components/NotificationBell";

// Import the update pages so clicking Edit navigates to the actual pages
// (these files already exist in your src/pages folder)
import UpdatePassword from "./UpdatePassword.jsx";
import UpdateWithdrawPassword from "./UpdateWithdrawPassword.jsx";

// ---- Updated: Use your custom API domain ----
const API_URL = "https://stacksapp-backend-main.onrender.com";

// --- Consistent blue (from start button etc.) ---
const START_BLUE = "#1fb6fc";
const END_BLUE = "#0072ff";

// --- Grey fading message overlay (kept for compatibility) ---
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

// --- Logout Modal with grey fade message after confirm ---
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

// Centered Withdrawal Password Modal for Profile page
function WithdrawPasswordModalProfile({
  open,
  onClose,
  onSubmit,
  withdrawPassword,
  setWithdrawPassword,
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
          <span className="text-[17px] font-semibold text-[#333]">Withdrawal Password</span>
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
          placeholder="Withdrawal Password"
          value={withdrawPassword}
          onChange={(e) => setWithdrawPassword(e.target.value)}
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

  // We no longer block rendering with a spinner.
  // Use localProfile so the page can render immediately from localStorage and update quickly when context profile arrives.
  const [localProfile, setLocalProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [destination, setDestination] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // --- Logout modal and fading message ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [fadeMsg, setFadeMsg] = useState("");

  // On mount, fetch profile but don't block UI rendering.
  useEffect(() => {
    // fire-and-forget; update localProfile when profile from context arrives
    fetchProfile && fetchProfile().catch(() => {});
    // eslint-disable-next-line
  }, []);

  // When context profile updates, keep local cache and persist
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

  // Centralized handler for all protected routes
  const handleProtectedRoute = (targetPath) => {
    setDestination(targetPath);
    setWithdrawPassword("");
    setErrorMsg("");
    setShowModal(true);
  };

  // Validate withdrawal password with backend
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
        body: JSON.stringify({ password: withdrawPassword }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success) {
        setShowModal(false);
        fetchProfile && fetchProfile().finally(() => {
          // Navigate to destination if set
          if (destination) {
            navigate(destination);
          }
        });
      } else {
        setErrorMsg(data.message || "Incorrect withdrawal password.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  // --- Logout logic with fading message and redirect ---
  const handleLogout = () => {
    setShowLogoutModal(false);
    setFadeMsg("Logout Success");
    setTimeout(() => {
      setFadeMsg("");
      // Clear all user data, tokens, etc.
      localStorage.removeItem("currentUser");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      navigate("/login");
    }, 1000);
  };

  // Use profile from context when available, otherwise fallback to localProfile or sensible defaults
  const p = profile || localProfile || {};
  const username = p.username || p.fullName || "MK737";
  const vipLevel = p.vipLevel ?? p.vip ?? 2;
  const fullName = p.fullName || username;
  const walletAddress = p.walletAddress || "";

  // Row component matching requested UI
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

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        background: "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)",
      }}
    >
      {/* NOTE: This component relies on the global header/footer (do not render them here).
          Per request we add a "Return Home Page >" link at the top-right of the page content so it appears under the global header. */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 80px", color: "#fff" }}>
        

        <div style={{ marginBottom: 18 }}>
          <h1 style={{ color: "#fff", fontSize: 32, margin: 0, fontWeight: 800 }}>Profile</h1>
        </div>

        {/* Thin blue divider */}
        <div style={{ height: 8, background: "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))", borderRadius: 4, marginBottom: 22 }} />

        {/* Profile information content area (dark overlay card inside gradient) */}
        <section
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.08))",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Top block: username + membership + credibility */}
          <div style={{ padding: "22px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>Username</div>
                <div style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{username}</div>
              </div>
              <img src={badgeIcon} alt="Badge" style={{ width: 44, height: 44 }} />
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>Membership Tier</div>
              <div style={{ color: "#fff", fontWeight: 700 }}>{`VIP${vipLevel}`}</div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>Credibility</div>
              <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "#0ea5b7" }} />
              </div>
            </div>
          </div>

          {/* Rows: Full Name (no edit), Password (edit), Withdraw Password (edit), Bind Wallet Address (edit) */}
          <div>
            <Row label="Full Name" value={fullName} showEdit={false} />
            <Row label="Password" value={"••••••••"} onEdit={() => handleProtectedRoute("/update-password")} editText="Edit Password" />
            <Row label="Withdraw Password" value={"••••••••"} onEdit={() => handleProtectedRoute("/update-withdraw-password")} editText="Edit Password" />
            <Row label="Bind Wallet Address" value={walletAddress} onEdit={() => handleProtectedRoute("/bind-wallet")} editText="Edit Wallet Address" />
          </div>
        </section>
      </main>

      {/* Logout Modal */}
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} onLogout={handleLogout} />

      {/* Modal for protected routes: fully centered and visible */}
      <WithdrawPasswordModalProfile
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitPassword}
        withdrawPassword={withdrawPassword}
        setWithdrawPassword={setWithdrawPassword}
        errorMsg={errorMsg}
        submitting={submitting}
      />

      {/* Fading grey message for logout */}
      {fadeMsg && <GreyFadeMessage message={fadeMsg} duration={1000} onDone={() => setFadeMsg("")} />}

      {/* Customer Service Modal */}
      <CustomerServiceModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}
