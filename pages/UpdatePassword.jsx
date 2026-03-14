import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const START_BLUE = "#1fb6fc";

// FadeMessage overlay, copy from your login page
function FadeMessage({ message, onDone, duration = 1000 }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none"
      }}
    >
      <div
        style={{
          background: "rgba(60, 60, 60, 0.94)",
          color: "#fff",
          borderRadius: 16,
          padding: "1.1rem 2.2rem",
          fontWeight: 600,
          fontSize: "1.19rem",
          boxShadow: "0 2px 16px 0 #0003",
          opacity: 0.97,
          textAlign: "center",
          minWidth: "140px",
          maxWidth: "80vw",
          textTransform: "none",
          letterSpacing: "0.01em",
          animation: "fade-in-out-anim 1s linear"
        }}
      >
        {message}
      </div>
      <style>
        {`
        @keyframes fade-in-out-anim {
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

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeMsg, setFadeMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const BASE_URL = "https://stacksapp-backend-main.onrender.com";
      const res = await fetch(`${BASE_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // NOTE: lowercase 'x-auth-token'
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setFadeMsg("Password updated successfully!");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } else {
        setErrorMsg(data.message || "Password update failed.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Network error. Please try again.");
    }
  };

  // Handle fade success message, then redirect
  React.useEffect(() => {
    if (fadeMsg) {
      const timeout = setTimeout(() => {
        setFadeMsg("");
        navigate("/login");
      }, 1000); // 1s for fade, then redirect
      return () => clearTimeout(timeout);
    }
  }, [fadeMsg, navigate]);

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #071e2f 0%, #0f2b45 30%, #16384e 60%, #0f4f63 100%)",
        paddingTop: 28,
        paddingBottom: 12, // small space left under form
        color: "#fff",
      }}
    >
      {fadeMsg && <FadeMessage message={fadeMsg} />}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Page title */}
          <h1 style={{ color: "#fff", fontSize: 36, margin: "22px 0 12px", fontWeight: 800, textAlign: "left" }}>
            Update Login Password
          </h1>

          {/* Thin blue divider */}
          <div
            style={{
              height: 8,
              background: "linear-gradient(90deg, rgba(31,143,192,1), rgba(33,230,193,1))",
              borderRadius: 6,
              margin: "6px 0 24px",
              width: "100%",
            }}
          />

          {/* Form card (visually similar to Bind Wallet style) */}
          <div style={{ paddingBottom: 8 }}>
            <form onSubmit={handleSubmit} className="space-y-4" style={{ maxWidth: 720 }}>
              <Input
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={setOldPassword}
                placeholder="Enter old password"
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm new password"
              />
              {errorMsg && (
                <div className="text-red-500 text-sm" style={{ color: "#ff7b7b", marginTop: 6 }}>{errorMsg}</div>
              )}

              {/* Centered update button with narrower width as requested */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  style={{
                    background: START_BLUE,
                    color: "#fff",
                    padding: "0.65rem 2.5rem",
                    borderRadius: "0.75rem",
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginTop: "0.75rem",
                    transition: "opacity 0.2s",
                    opacity: loading ? 0.7 : 1,
                    border: "none",
                    width: 260,
                    maxWidth: "80%",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="block mb-1 font-semibold" style={{ color: "#ffffff", marginBottom: 8 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder || ""}
        className="w-full border rounded px-3 py-2"
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          background: "#ffffff",
          color: "#1f2937",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
