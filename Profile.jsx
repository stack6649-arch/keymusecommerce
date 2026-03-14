import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/profileContext";
import CustomerServiceModal from "../components/CustomerServiceModal";

// Image Assets
import avatarIcon from "../assets/images/profile/avatar.png";
import badgeIcon from "../assets/images/profile/badge.png";
import depositIcon from "../assets/images/profile/deposit.png";
import withdrawIcon from "../assets/images/profile/withdraw.png";
import personalIcon from "../assets/images/profile/personal.png";
import walletIcon from "../assets/images/profile/wallet.png";
import contactIcon from "../assets/images/profile/contact.png";
import notifIcon from "../assets/images/profile/notif.png";

// Notification bell component
import NotificationBell from "../components/NotificationBell";

// ---- Updated: Use your custom API domain ----
const API_URL = "https://api.stacksl.com";

// --- Consistent blue (from start button etc.) ---
const START_BLUE = "#1fb6fc";
const END_BLUE = "#0072ff";

// --- Grey fading spinner for loading ---
function GreyFadeSpinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100vw",
      height: "100vh",
      background: "rgba(245,247,251,0.9)",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 10000,
      transition: "opacity 0.5s"
    }}>
      <div style={{
        width: "3.2rem",
        height: "3.2rem",
        border: "5px solid #e0e0e0",
        borderTop: "5px solid #b0b0b0",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <style>
        {`@keyframes spin {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(360deg);}
        }`}
      </style>
    </div>
  );
}

// --- Grey fading message overlay (universal) ---
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
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(245,247,251,0.93)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none"
      }}
    >
      <div style={{
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
        animation: "fade-in-out-profile-logout 1s linear"
      }}>
        {message}
      </div>
      <style>
        {`
        @keyframes fade-in-out-profile-logout {
          0% { opacity: 0; transform: scale(0.98);}
          10% { opacity: 1; transform: scale(1);}
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        `}
      </style>
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
        pointerEvents: "auto"
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
        onClick={e => e.stopPropagation()}
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
              border: "none"
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
              border: "none"
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
function WithdrawPasswordModalProfile({ open, onClose, onSubmit, withdrawPassword, setWithdrawPassword, errorMsg, submitting }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        minHeight: "100vh",
        minWidth: "100vw",
        pointerEvents: "auto"
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
        onClick={e => e.stopPropagation()}
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
          onChange={e => setWithdrawPassword(e.target.value)}
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

  const [showModal, setShowModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [destination, setDestination] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  // --- Logout modal and fading message ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [fadeMsg, setFadeMsg] = useState("");

  // --- Only show spinner for 1 second on mount/refresh ---
  useEffect(() => {
    setShowLoading(true);
    fetchProfile().finally(() => {
      setTimeout(() => setShowLoading(false), 1000);
    });
    // eslint-disable-next-line
  }, []);

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
        setShowLoading(true);
        fetchProfile().finally(() => {
          setTimeout(() => {
            setShowLoading(false);
            navigate(destination);
          }, 1000);
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

  if (showLoading)
    return <GreyFadeSpinner />;

  if (!profile) return <div className="p-4">No profile found.</div>;

  return (
    <div className="bg-[#f6f7fb] min-h-screen pb-20">
      {/* Header with Back Arrow */}
      <div className="bg-[#2d2d2d] text-white text-center py-3 font-semibold text-lg relative flex items-center justify-center">
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          <svg width={28} height={28} viewBox="0 0 22 22">
            <polyline
              points="14,5 8,11 14,17"
              fill="none"
              stroke={START_BLUE}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span>Profile</span>
        <span style={{ position: "absolute", right: 20 }}>
          <NotificationBell />
        </span>
      </div>

      {/* Profile Card - Two blue gradient */}
      <div
        className="mx-4 mt-4 rounded-lg p-4"
        style={{
          background: `linear-gradient(90deg, ${START_BLUE} 0%, ${END_BLUE} 100%)`,
          color: "#fff",
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img src={avatarIcon} alt="Avatar" className="w-12 h-12 rounded-full mr-3" />
            <div>
              <div className="font-bold text-lg">{profile.username}</div>
              <div className="text-sm opacity-90">
                VIP Level: <span className="text-white font-semibold">{profile.vipLevel}</span>
              </div>
              <div className="text-sm opacity-90 mt-1">
                Invitation Code: <span className="text-white font-semibold">{profile.inviteCode || "N/A"}</span>
              </div>
            </div>
          </div>
          <img src={badgeIcon} alt="Badge" className="w-10 h-10" />
        </div>

        <div className="mt-4 text-sm">
          <div className="mb-1">Credit Score:</div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white w-full"></div>
          </div>
          <div className="text-right text-xs mt-1">100%</div>
        </div>

        <div className="flex justify-between text-sm mt-4 font-medium">
          <div className="text-center">
            <div>Total Balance</div>
            <div className="text-xl font-bold" style={{ color: "#fff" }}>
              {Number(profile.balance).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div>Commission Today</div>
            <div className="text-xl font-bold" style={{ color: "#fff" }}>
              {Number(profile.commissionToday).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* My Financial */}
      <Section title="My Financial">
        <Item label="Deposit" icon={depositIcon} to="/deposit" />
        {/* Withdraw is protected */}
        <ProtectedItem
          label="Withdraw"
          icon={withdrawIcon}
          onClick={() => handleProtectedRoute("/withdraw")}
        />
      </Section>

      {/* My Details */}
      <Section title="My Details">
        <ProtectedItem
          label="Personal Information"
          icon={personalIcon}
          onClick={() => handleProtectedRoute("/personal-info")}
        />
        <ProtectedItem
          label="Bind Wallet Address"
          icon={walletIcon}
          onClick={() => handleProtectedRoute("/bind-wallet")}
        />
      </Section>

      {/* Other */}
      <Section title="Other">
        <div
          className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => setShowContactModal(true)}
        >
          <div className="flex items-center gap-3 text-sm">
            <img src={contactIcon} alt="Contact Us" className="w-5 h-5" />
            <span style={{ color: START_BLUE }}>Contact Us</span>
          </div>
          <span className="text-gray-400 text-sm">›</span>
        </div>
        <Item label="Notifications" icon={notifIcon} to="/notifications" />
      </Section>

      {/* Logout */}
      <div className="mx-4 mt-6">
        <button
          className="w-full py-3 rounded-lg text-white font-bold text-base"
          style={{
            background: START_BLUE,
            boxShadow: `0 1px 8px ${START_BLUE}22`,
            transition: "background 0.2s"
          }}
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
      />

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
      {fadeMsg && (
        <GreyFadeMessage
          message={fadeMsg}
          duration={1000}
          onDone={() => setFadeMsg("")}
        />
      )}

      {/* Customer Service Modal */}
      <CustomerServiceModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white mt-4 mx-4 rounded-lg overflow-hidden">
      <div className="p-4 font-semibold text-[#222] border-b">{title}</div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

// For open (unprotected) items
function Item({ label, icon, to }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(to)}
      className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center gap-3 text-sm">
        <img src={icon} alt={label} className="w-5 h-5" />
        <span style={{ color: START_BLUE }}>{label}</span>
      </div>
      <span className="text-gray-400 text-sm">›</span>
    </div>
  );
}

// For protected items, only calls onClick (which will show modal)
function ProtectedItem({ label, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 gap-3 text-sm cursor-pointer hover:bg-gray-50"
    >
      <img src={icon} alt={label} className="w-5 h-5" />
      <div className="flex-1 font-medium" style={{ color: START_BLUE }}>{label}</div>
      <span className="text-gray-400 text-sm">›</span>
    </div>
  );
}
