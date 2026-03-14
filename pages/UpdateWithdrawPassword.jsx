import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const START_BLUE = "#1fb6fc";

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
      const BASE_URL = "https://stacksapp-backend-main.onrender.com";
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

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #071e2f 0%, #0f2b45 30%, #16384e 60%, #0f4f63 100%)",
        paddingTop: 28,
        paddingBottom: 12, // small space left under form
        color: "#fff",
      }}
    >
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Page title */}
          <h1 style={{ color: "#fff", fontSize: 36, margin: "22px 0 12px", fontWeight: 800, textAlign: "left" }}>
            Update Withdrawal Password
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

          <div style={{ paddingBottom: 8, maxWidth: 720 }}>
            {showSuccess ? (
              <div style={{ background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: 12 }}>
                <div style={{ color: "#9ae6b4", fontWeight: 700, marginBottom: 8 }}>
                  Withdrawal password updated successfully!
                </div>
                <div style={{ color: "#cbd5e1" }}>Redirecting to profile in 4 seconds...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Old Password"
                  type="password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  placeholder="Enter old withdrawal password"
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter new withdrawal password"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm new withdrawal password"
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
            )}
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
