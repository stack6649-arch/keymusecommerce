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

  const handleCopyLink = async () => {
    if (!referralCode) return;
    const link = `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1700);
    } catch (err) {
      try {
        window.prompt("Copy invitation link:", link);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <main className="dashboard-main-bg" style={{ minHeight: "100vh" }}>
      <style>{`
        /* Page-level styles to match screenshots */
        .ref-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 20px 80px;
          color: #111;
        }

        .ref-heading {
          color: #1f4de6; /* heading blue */
          font-weight: 900;
          letter-spacing: -0.02em;
          margin: 6px 0 30px 0;
          text-align: left;
        }
        @media (min-width: 992px) {
          .ref-heading { font-size: 56px; }
        }
        @media (max-width: 991px) {
          .ref-heading { font-size: 44px; text-align: left; }
        }

        .ref-hero {
          padding: 22px 8px 36px 8px;
        }
        .ref-hero .lead-block {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .ref-vertical-bar {
          width: 6px;
          height: 48px;
          background: #1f4de6;
          border-radius: 2px;
          margin-right: 14px;
          flex-shrink: 0;
        }
        .ref-title {
          font-size: 28px;
          font-weight: 900;
          margin: 0 0 12px 0;
        }
        @media (min-width: 992px) {
          .ref-title { font-size: 32px; }
        }
        .ref-desc {
          color: #4b5563;
          line-height: 1.7;
          margin-top: 6px;
          max-width: 900px;
        }

        .ref-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 28px 0 38px 0;
        }

        /* Invitation area */
        .invite-wrap {
          text-align: center;
          margin-top: 18px;
        }
        .invite-label {
          font-weight: 800;
          margin-bottom: 16px;
          color: #111;
        }

        /* Invitation code pill - blue by default, turns red on hover */
        .invite-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          background: #0b42d9;
          color: #fff;
          padding: 22px 48px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 26px;
          cursor: pointer;
          user-select: none;
          transition: background 180ms ease, transform 120ms ease;
          box-shadow: 0 6px 18px rgba(11,66,217,0.12);
        }
        .invite-code:active { transform: translateY(1px); }
        .invite-code:hover { background: #d43a3a; } /* show red when pointed at */
        .invite-code .code-text { letter-spacing: 0.14em; font-family: "Courier New", Courier, monospace; }

        /* Copy icon inside pill */
        .invite-code .icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.12);
        }
        .invite-code:hover .icon { background: rgba(255,255,255,0.14); }

        /* Copy link button under the pill */
        .copy-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          background: #efefef;
          color: #111;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          border: none;
          box-shadow: none;
        }
        .copy-link-btn:active { transform: translateY(1px); }

        /* Copied notice */
        .copied-notice {
          display: inline-block;
          background: #f0fff7;
          color: #006442;
          padding: 6px 10px;
          border-radius: 6px;
          font-weight: 800;
          margin-left: 12px;
        }

        /* Responsive spacing */
        @media (max-width: 820px) {
          .ref-container { padding: 18px 14px 60px; }
          .invite-code { padding: 20px 36px; font-size: 22px; }
        }
      `}</style>

      <div className="ref-container">
        {/* Heading / hero */}
        <header style={{ marginBottom: 8 }}>
          <h1 className="ref-heading">REFER A FRIEND</h1>
        </header>

        <div className="ref-hero">
          <div className="ref-hero-inner">
            <div className="ref-hero-content" style={{ maxWidth: 980 }}>
              <div className="lead-block">
                <div className="ref-vertical-bar" aria-hidden />
                <div>
                  <h2 className="ref-title">Get You & Your Friends Amazing Rewards</h2>
                  <p className="ref-desc">
                    Join my team every half hour every day. Winning USD 50 a month is just the beginning! Every invitation is a seed of opportunity, a ladder of wealth and freedom! Unlimited sharing, big rebates! Come in, the first layer is still 10%, the second layer is still 5%, and the third layer is still 2%.
                  </p>
                </div>
              </div>
            </div>

            <div className="ref-divider" />

            {/* Invitation code area */}
            <div className="invite-wrap" aria-label="Invitation area">
              <div className="invite-label">Invitation Code</div>

              <button
                className="invite-code"
                onClick={handleCopy}
                aria-label="Copy invitation code"
                title={referralCode ? "Copy invitation code" : "No invitation code"}
                disabled={!referralCode}
                style={{ border: "none" }}
              >
                <span className="code-text">{referralCode || "N/A"}</span>
                <span className="icon" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1z" fill="#fff" />
                    <path d="M20 5H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h12v14z" fill="#fff" />
                  </svg>
                </span>
              </button>

              <div>
                <button
                  className="copy-link-btn"
                  onClick={handleCopyLink}
                  aria-label="Copy invitation link"
                  title={referralCode ? "Copy invitation link" : "No invitation code"}
                  disabled={!referralCode}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block" }}>
                    <path d="M10.59 13.41L9.17 12l4.24-4.24 1.41 1.41L10.59 13.41z" fill="#111"/>
                    <path d="M17 3H7a4 4 0 0 0-4 4v10c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4V7a4 4 0 0 0-4-4zM7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z" fill="#111"/>
                  </svg>
                  <span>Copy Invitation Link</span>
                </button>

                {copied && <span className="copied-notice" role="status">Copied!</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}