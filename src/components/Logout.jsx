import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Logout.jsx
 *
 * - Renders a logout confirmation modal when the route is visited (modal opens automatically).
 * - If the user confirms, clears all auth tokens and user data from localStorage.
 * - Shows "Signout success" message, then navigates to /login.
 *
 * This file replaces the previous simple button so that navigating to "/logout"
 * presents a confirmation dialog instead of immediately redirecting.
 */

export default function Logout() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true); // open on mount
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && modalOpen && !isProcessing) {
        setModalOpen(false);
        // If user closes modal without confirming, return them to previous page (dashboard)
        navigate(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, isProcessing, navigate]);

  useEffect(() => {
    // When modal opens, focus the Close button for safety (keyboard users).
    if (modalOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [modalOpen]);

  const handleCancel = () => {
    if (isProcessing) return;
    setModalOpen(false);
    navigate(-1); // go back if they cancel
  };

  const handleConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Clear all auth tokens and user data from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("username");
      localStorage.clear();
    } catch (e) {
      // ignore
    }

    setSuccess(true);

    // Give user a moment to see "Signout success" then navigate to login.
    setTimeout(() => {
      setIsProcessing(false);
      setModalOpen(false);
      navigate("/login");
    }, 1200);
  };

  // If for some reason the modal is closed programmatically and we are still on /logout,
  // navigate back to previous page to avoid leaving a blank route.
  useEffect(() => {
    if (!modalOpen && !success) {
      // navigate back after a small delay to allow UI to close
      const t = setTimeout(() => navigate(-1), 120);
      return () => clearTimeout(t);
    }
  }, [modalOpen, success, navigate]);

  if (!modalOpen && success === false) {
    // Modal closed and not signing out — don't render anything (route will navigate back).
    return null;
  }

  return (
    <>
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
            padding: 20,
          }}
        >
          <div
            style={{
              width: 400,
              maxWidth: "100%",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              padding: "40px 32px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Close X button */}
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "transparent",
                cursor: isProcessing ? "not-allowed" : "pointer",
                fontSize: 28,
                color: "#111",
                padding: 0,
                fontWeight: 300,
              }}
              aria-label="Close"
            >
              ✕
            </button>

            {!success ? (
              <>
                <h2
                  id="logout-dialog-title"
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: 32,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Are you sure you want to quit?
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <button
                    ref={cancelBtnRef}
                    onClick={handleCancel}
                    disabled={isProcessing}
                    style={{
                      padding: "16px 24px",
                      borderRadius: 8,
                      border: "2px solid #0645d6",
                      background: "#fff",
                      color: "#0645d6",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      opacity: isProcessing ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.target.style.background = "#f0f5ff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#fff";
                    }}
                  >
                    Close
                  </button>

                  <button
                    ref={confirmBtnRef}
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    style={{
                      padding: "16px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "#0645d6",
                      color: "#fff",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      opacity: isProcessing ? 0.8 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.target.style.background = "#0534a8";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#0645d6";
                    }}
                  >
                    {isProcessing ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </>
            ) : (
              // Success message
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: 16,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Signout success
                </h2>
                <p
                  style={{
                    marginTop: 12,
                    color: "#666",
                    fontSize: 15,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Redirecting to login…
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}