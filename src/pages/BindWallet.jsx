import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const START_BLUE = "#0645d6";
const LIGHT_BG = "#efeae7";

// Use your API backend URL here!
const BACKEND_API = "https://keymuse-backend.onrender.com/api";

export default function BindWallet({ onBack }) {
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
          if (onBack) {
            onBack();
          } else {
            navigate("/profile");
          }
        }, 1500);
      } else {
        alert(data.message || "Failed to update wallet address.");
      }
    } catch (err) {
      setLoading(false);
      alert("Failed to update wallet address.");
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/profile");
    }
  };

  if (!user) return null;

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", background: LIGHT_BG }}>
      <style>{`
        .bind-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 16px;
          box-sizing: border-box;
        }

        .bind-title {
          font-size: 32px;
          font-weight: 900;
          margin: 0 0 24px 0;
          color: #111;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .bind-divider {
          height: 8px;
          width: 100%;
          background: #111;
          border-radius: 0;
          margin-bottom: 28px;
        }

        .bind-form {
          margin-top: 10px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          background: #fff;
          padding: 28px 24px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.04);
        }

        .bind-label {
          display: block;
          color: #6b6b6b;
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .bind-input-wrapper {
          position: relative;
          margin-bottom: 16px;
        }

        .bind-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 6px;
          background: #f6f7fb;
          border: 1px solid rgba(0,0,0,0.08);
          font-size: 15px;
          color: #111;
          box-sizing: border-box;
          outline: none;
          transition: all 0.2s ease;
        }

        .bind-input:focus {
          background: #fff;
          border-color: ${START_BLUE};
          box-shadow: 0 0 0 3px ${START_BLUE}10;
        }

        .bind-button-group {
          display: flex;
          gap: 16px;
          margin-top: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .bind-button-primary {
          background: ${START_BLUE};
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          border-radius: 28px;
          border: none;
          padding: 12px 48px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 180px;
        }

        .bind-button-primary:hover {
          background: #053aa8;
        }

        .bind-button-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .bind-button-secondary {
          background: #fff;
          color: ${START_BLUE};
          font-weight: 700;
          font-size: 15px;
          border-radius: 28px;
          border: 2px solid ${START_BLUE};
          padding: 10px 48px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 180px;
        }

        .bind-button-secondary:hover {
          background: ${START_BLUE}10;
        }

        @media (max-width: 600px) {
          .bind-container {
            padding: 28px 12px;
          }

          .bind-title {
            font-size: 24px;
            margin-bottom: 16px;
          }

          .bind-divider {
            margin-bottom: 20px;
          }

          .bind-form {
            padding: 20px 16px;
          }

          .bind-button-group {
            flex-direction: column;
            gap: 12px;
          }

          .bind-button-primary,
          .bind-button-secondary {
            min-width: auto;
            width: 100%;
            padding: 12px 32px;
          }
        }
      `}</style>

      <div className="bind-container">
        <h1 className="bind-title">Bind Wallet Address</h1>
        <div className="bind-divider" />

        <div className="bind-form" role="form" aria-label="Bind wallet form">
          <div className="bind-input-wrapper">
            <label className="bind-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="bind-input"
            />
          </div>

          <div className="bind-input-wrapper">
            <label className="bind-label" htmlFor="exchange">Exchange</label>
            <input
              id="exchange"
              type="text"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              placeholder="Enter exchange"
              className="bind-input"
            />
          </div>

          <div className="bind-input-wrapper">
            <label className="bind-label" htmlFor="walletAddress">Wallet Address</label>
            <input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="bind-input"
            />
          </div>

          <div className="bind-button-group">
            <button
              onClick={handleUpdate}
              className="bind-button-primary"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Updating..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="bind-button-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>

        {showToast && (
          <div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded shadow-lg"
            role="status"
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#10b981",
              color: "#fff",
              fontSize: 14,
              padding: "12px 20px",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
              zIndex: 1000,
            }}
          >
            ✅ Wallet updated successfully!
          </div>
        )}
      </div>
    </main>
  );
}
