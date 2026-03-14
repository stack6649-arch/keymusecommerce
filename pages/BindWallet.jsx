import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const START_BLUE = "#1fb6fc";

// Use your API backend URL here!
const BACKEND_API = "https://stacksapp-backend-main.onrender.com/api";

export default function BindWallet() {
  const [fullName, setFullName] = useState("");
  const [exchange, setExchange] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no local user, keep behavior but don't block layout rendering
      // redirect user to login for safety
      alert("Please login first.");
      navigate("/login");
    }
  }, [navigate]);

  // Load the existing wallet details if they exist
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setExchange(user.exchange || "");
      setWalletAddress(user.walletAddress || user.wallet || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!walletAddress.trim()) return;
    setLoading(true);

    try {
      const token = user?.token || localStorage.getItem("authToken");
      const res = await fetch(`${BACKEND_API}/bind-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          fullName,
          exchange,
          walletAddress,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        // Update local user as well
        const updatedUser = {
          ...user,
          fullName,
          exchange,
          walletAddress,
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/profile");
        }, 1500);
      } else {
        alert(data.message || "Failed to update wallet address.");
      }
    } catch (err) {
      setLoading(false);
      alert("Failed to update wallet address.");
    }
  };

  if (!user) return null;

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        .bind-gradient {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(120deg, #071e2f 0%, #1f4287 45%, #278ea5 85%, #21e6c1 100%);
          position: relative;
        }
        .bind-gradient::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, rgba(7,30,61,0.92) 60%, rgba(39,142,165,0.80) 100%);
          z-index: 0;
          pointer-events: none;
        }
        .bind-centered {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          /* Reduced bottom padding to avoid large gap before footer */
          padding: 36px 18px 20px 18px;
          box-sizing: border-box;
          color: #fff;
        }
        .bind-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #fff;
        }
        .bind-divider {
          height: 8px;
          width: 100%;
          max-width: 900px;
          background: #1f8fc0;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .bind-form {
          margin-top: 10px;
          max-width: 760px;
          background: transparent;
          margin-left: auto;
          margin-right: auto;
        }
        .bind-label {
          display: block;
          color: rgba(255,255,255,0.9);
          font-weight: 700;
          margin-bottom: 6px;
          font-size: 13px;
        }
        .bind-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 6px;
          background: rgba(255,255,255,0.95);
          border: none;
          font-size: 15px;
          color: #0b2b4a;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(2,6,23,0.06);
          outline: none;
        }
        /* Remove focus outlines and blue glow */
        .bind-input:focus,
        .bind-input:active,
        .bind-input::-moz-focus-inner {
          outline: none !important;
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
          border: none !important;
        }
        /* make sure on iOS/Android there's no highlight */
        .bind-input:focus-visible { outline: none; }

        /* hide webkit number spin buttons (if any) */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .bind-button {
          width: 100%;
          background: ${START_BLUE};
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          padding: 12px 0;
          cursor: pointer;
          box-shadow: 0 8px 28px ${START_BLUE}22;
        }
        .bind-footer-space { height: 8px; }
        @media (max-width: 520px) {
          .bind-centered { padding-left: 12px; padding-right: 12px; }
          .bind-title { font-size: 22px; }
        }
      `}</style>

      <div className="bind-gradient" aria-hidden="false">
        <div className="bind-centered">
          <h1 className="bind-title">Bind Wallet Address</h1>
          <div className="bind-divider" />

          <div className="bind-form" role="form" aria-label="Bind wallet form">
            <label className="bind-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="bind-input"
            />

            <label className="bind-label" htmlFor="exchange">Exchange</label>
            <input
              id="exchange"
              type="text"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              placeholder="Exchange"
              className="bind-input"
            />

            <label className="bind-label" htmlFor="walletAddress">Wallet Address</label>
            <input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Wallet Address"
              className="bind-input"
            />

            <button
              onClick={handleUpdate}
              className="bind-button"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

          <div className="bind-footer-space" />

          {showToast && (
            <div
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded shadow-lg"
              role="status"
            >
              ✅ Wallet updated successfully!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
