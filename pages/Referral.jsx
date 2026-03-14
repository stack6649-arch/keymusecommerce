import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBalance } from "../context/balanceContext";
import "./Dashboards.css"; // reuse dashboard styling so page matches the rest

export default function Referral() {
  const { userProfile, refreshProfile } = useBalance();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    refreshProfile && refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (!userProfile) {
      setReferralCode("");
      return;
    }
    const code =
      userProfile.referralCode ||
      userProfile.refCode ||
      userProfile.inviteCode ||
      userProfile.referral ||
      userProfile.code ||
      userProfile.referalCode ||
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
        {/* Title / hero */}
        <section style={{ marginBottom: 18 }}>
          <h1 className="dashboard-title" style={{ marginBottom: 8 }}>
            Referral code
          </h1>

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
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              borderRadius: 8,
              padding: 18
            }}
          >
            <h2 style={{ color: "#fff", margin: 0, fontSize: 18, fontWeight: 800 }}>
              Unlock Incredible Benefits with Our Referral Program!
            </h2>

            <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 10, lineHeight: 1.4 }}>
              Do you know someone talented and motivated who would be a perfect fit for our company? Refer them to us and unlock incredible benefits! Not only will you help a friend discover an exciting career opportunity, but youll also receive fantastic rewards as a token of our appreciation.
            </p>

            <div style={{ color: "rgba(255,255,255,0.85)", marginTop: 12, lineHeight: 2.5 }}>
              <strong>Terms and Conditions:</strong>
              <ol style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>1.You must be a Silver member or higher to participate.</li>
                <li>2.You must have complated at least one full cycle of the basic salary.</li>
              </ol>


              <p style={{ marginTop: 10 }}>
                Take advantage of this opportunity to beneft both your friends and your career!
              </p>
            </div>
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
                    fontWeight: 900,
                    fontSize: 13
                  }}
                >
                  Copied!
                </div>
              )}
            </div>
          </div>
        </section>

        <div style={{ marginTop: 20, color: "rgba(255,255,255,0.9)" }}>
          <p style={{ margin: 0 }}>
            Share this code with friends — they can use it during registration.
          </p>
        </div>
      </div>
    </main>
  );
}