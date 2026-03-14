import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBalance } from "../context/balanceContext";
import "./Dashboards.css"; // reuse the dashboard styles so page matches the rest

/**
 * Referral.jsx
 *
 * - Uses the same page/header/footer/gradient styling as other pages by matching
 *   the layout classes used across the app (dashboard-main-bg and dashboard-centered-section).
 * - Reads referral code from the logged-in user's profile (via useBalance -> userProfile).
 *   Tries a few common field names to be resilient: userProfile.referralCode / inviteCode / refCode.
 * - Shows a hero area with title & description, then a simple card showing the referral code
 *   and a "Copy Referral Code" button. Clicking the button copies to clipboard and shows
 *   a small inline confirmation message.
 *
 * Behavior / assumptions:
 * - This component does NOT render the header/footer itself — it expects to be rendered
 *   within the app's Layout so the global header/footer are present.
 * - No changes to other files.
 */

export default function Referral() {
  const { userProfile, refreshProfile } = useBalance();
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Try to refresh profile (safe to call if available)
    refreshProfile && refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (!userProfile) {
      setReferralCode("");
      return;
    }
    // Support multiple possible field names
    const code =
      userProfile.referralCode ||
      userProfile.refCode ||
      userProfile.inviteCode ||
      userProfile.referral ||
      userProfile.code ||
      userProfile.referalCode || // common misspelling
      "";
    setReferralCode(String(code || "").toUpperCase());
  }, [userProfile]);

  const handleCopy = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1700);
    } catch (err) {
      // Fallback: select text in prompt
      try {
        window.prompt("Copy referral code:", referralCode);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <main className="dashboard-main-bg" style={{ minHeight: "100vh" }}>
      <div className="dashboard-centered-section" style={{ paddingTop: 36 }}>
        {/* Hero */}
        <section style={{ marginBottom: 18 }}>
          <h1 className="dashboard-title" style={{ marginBottom: 8 }}>Referral code</h1>
          <div
            style={{
              height: 8,
              width: "100%",
              maxWidth: 1100,
              background: "#1f8fc0",
              borderRadius: 6,
              marginBottom: 16
            }}
          />
          <div
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              borderRadius: 8,
              padding: 18
            }}
          >
            <h2 style={{ color: "#fff", margin: 0, fontSize: 18, fontWeight: 800 }}>
              Unlock Incredible Benefits with Our Referral Program!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 10, lineHeight: 1.5 }}>
              Refer a friend and unlock rewards. When someone registers using your referral code, both you and your
              friend may receive benefits according to our membership program terms.
            </p>
            <ul style={{ color: "rgba(255,255,255,0.75)", marginTop: 12, lineHeight: 1.45 }}>
              <li>1. You must be a Silver member or higher to participate.</li>
              <li>2. You must have completed at least one full cycle of required activity to qualify.</li>
            </ul>
          </div>
        </section>

        {/* Referral code card */}
        <section aria-label="Referral code" style={{ marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: "rgba(255,255,255,0.97)",
              padding: "18px 20px",
              borderRadius: 8,
              boxShadow: "0 6px 22px rgba(2,6,23,0.08)"
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ color: "#6b6f76", fontWeight: 700, marginBottom: 8 }}>Referral Code</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0b2b4a", letterSpacing: "0.08em" }}>
                {referralCode || "N/A"}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <button
                onClick={handleCopy}
                style={{
                  background: "#1f8fc0",
                  color: "#fff",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontWeight: 800,
                  cursor: referralCode ? "pointer" : "not-allowed",
                  boxShadow: "0 6px 18px rgba(31,143,192,0.18)"
                }}
                disabled={!referralCode}
                aria-disabled={!referralCode}
                title={referralCode ? "Copy referral code" : "No referral code available"}
              >
                Copy Referral Code
              </button>

              {copied && (
                <div
                  role="status"
                  style={{
                    background: "#f0fff7",
                    color: "#006442",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 13
                  }}
                >
                  Copied!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Small help / link */}
        <div style={{ marginTop: 20, color: "rgba(255,255,255,0.9)" }}>
          <p style={{ margin: 0 }}>
            Share this code with friends — they can use it during registration. You can also visit your{" "}
            <Link to="/profile" style={{ color: "#1fb6fc", fontWeight: 800 }}>Profile</Link> for more account details.
          </p>
        </div>
      </div>
    </main>
  );
}