import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const START_BLUE = "#0645d6";
const LIGHT_BG = "#efeae7";

export default function UpdateWithdrawPassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
      const BASE_URL = "https://keymuse-backend.onrender.com";
      const res = await fetch(`${BASE_URL}/api/change-withdraw-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 4000);
      } else {
        setErrorMsg(data.message || "Withdrawal password update failed.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Network error. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", paddingTop: 40, paddingBottom: 300 }}>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Page title */}
          <h1 style={{ color: "#111", fontSize: 32, margin: "0 0 24px", fontWeight: 900, textAlign: "left", letterSpacing: "-0.02em" }}>
            Update Secondary Password
          </h1>

          {/* Black divider */}
          <div style={{ height: 8, background: "#111", borderRadius: 0, margin: "0 0 28px", width: "100%" }} />

          {/* Form card */}
          <div style={{ background: "#fff", padding: "28px 24px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.04)" }}>
            {showSuccess ? (
              <div style={{ background: "rgba(16,185,129,0.08)", padding: 20, borderRadius: 8 }}>
                <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 8, fontSize: 15 }}>
                  ✅ Secondary password updated successfully!
                </div>
                <div style={{ color: "#666", fontSize: 14 }}>Redirecting to profile in 4 seconds...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Input
                  label="Old Secondary Password"
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  placeholder="Enter old secondary password"
                />
                <Input
                  label="New Secondary Password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter new secondary password"
                />
                <Input
                  label="Confirm New Secondary Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm new secondary password"
                />
                {errorMsg && (
                  <div style={{ color: "#ff7b7b", fontSize: 14, marginTop: 12, marginBottom: 12 }}>{errorMsg}</div>
                )}

                {/* Button group */}
                <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    style={{
                      background: START_BLUE,
                      color: "#fff",
                      padding: "12px 32px",
                      borderRadius: "28px",
                      fontWeight: 700,
                      fontSize: "15px",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      opacity: loading ? 0.7 : 1,
                      flex: 1,
                      minWidth: 180,
                    }}
                    disabled={loading}
                    onMouseEnter={(e) => !loading && (e.target.style.background = "#053aa8")}
                    onMouseLeave={(e) => !loading && (e.target.style.background = START_BLUE)}
                  >
                    {loading ? "Updating..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      background: "#fff",
                      color: START_BLUE,
                      padding: "10px 32px",
                      borderRadius: "28px",
                      fontWeight: 700,
                      fontSize: "15px",
                      border: `2px solid ${START_BLUE}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      flex: 1,
                      minWidth: 180,
                    }}
                    onMouseEnter={(e) => (e.target.style.background = `${START_BLUE}10`)}
                    onMouseLeave={(e) => (e.target.style.background = "#fff")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 600px) {
          main {
            padding: 0 12px;
          }
          h1 {
            font-size: 24px !important;
            margin-bottom: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: "#6b6b6b", fontWeight: 700, marginBottom: 8, fontSize: 13 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder || ""}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 6,
          background: "#f6f7fb",
          color: "#111",
          border: "1px solid rgba(0,0,0,0.08)",
          fontSize: 15,
          boxSizing: "border-box",
          outline: "none",
          transition: "all 0.2s ease",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.target.style.background = "#fff";
          e.target.style.borderColor = START_BLUE;
          e.target.style.boxShadow = `0 0 0 3px ${START_BLUE}10`;
        }}
        onBlur={(e) => {
          e.target.style.background = "#f6f7fb";
          e.target.style.borderColor = "rgba(0,0,0,0.08)";
          e.target.style.boxShadow = "none";
        }}
        required
      />
    </div>
  );
}
