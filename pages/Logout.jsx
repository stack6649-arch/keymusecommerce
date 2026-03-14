import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Logout.jsx
 *
 * - Opens a compact confirmation modal on mount asking "Are you sure to logout?"
 * - Modal has a top-right Cancel (X) button and two actions: Cancel and OK.
 * - OK button uses a teal gradient to match the supplied screenshot (not the previous blue).
 * - Modal width reduced to approximately half of the viewport (responsive).
 * - If the user clicks OK:
 *    - shows a small spinner and the message "Logout Success" (styled grey)
 *    - clears localStorage username and after a short pause navigates to /login
 * - If the user cancels (X, Cancel button or Escape), modal closes and the route goes back.
 *
 * Styling is inline so you can drop the file in without touching other files.
 */

export default function Logout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // open modal on mount
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const okRef = useRef(null);
  const cancelRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // focus the Cancel button on open for accessibility
    if (open) {
      setTimeout(() => {
        try {
          cancelRef.current?.focus();
        } catch {
          // ignore
        }
      }, 10);
    }

    function onKey(e) {
      if (e.key === "Escape") handleCancel();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCancel = () => {
    if (processing) return;
    setOpen(false);
    // go back one step; if none, go to dashboard
    try {
      navigate(-1);
    } catch {
      navigate("/dashboard");
    }
  };

  const handleConfirm = () => {
    if (processing) return;
    setProcessing(true);

    // try clearing stored username (best-effort)
    try {
      localStorage.removeItem("username");
    } catch {
      // ignore
    }

    // show success state after a short simulated delay
    timeoutRef.current = window.setTimeout(() => {
      setSuccess(true);
      setProcessing(false);

      // hold success message briefly then navigate to login
      timeoutRef.current = window.setTimeout(() => {
        setOpen(false);
        navigate("/login");
      }, 900);
    }, 600);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "50%",            // roughly half the viewport width
          maxWidth: 420,          // keep a reasonable cap
          minWidth: 260,          // don't get too small on small screens
          background: "#ffffff",
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          padding: "16px 18px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Close X */}
        <button
          onClick={handleCancel}
          aria-label="Cancel"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            border: "none",
            background: "transparent",
            fontSize: 18,
            cursor: processing ? "not-allowed" : "pointer",
            color: "#666",
            padding: 6,
            lineHeight: 1,
          }}
          disabled={processing}
        >
          ×
        </button>

        {!success ? (
          <>
            <h2
              id="logout-title"
              style={{
                margin: "6px 0 8px 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#111",
              }}
            >
              Are you sure to logout?
            </h2>

            <p style={{ marginTop: 6, color: "#444", fontSize: 14 }}>
              You will be signed out of your account.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                ref={cancelRef}
                onClick={handleCancel}
                disabled={processing}
                style={{
                  minWidth: 110,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #d0d0d0",
                  background: "#fff",
                  color: "#111",
                  fontWeight: 600,
                  cursor: processing ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>

              <button
                ref={okRef}
                onClick={handleConfirm}
                disabled={processing}
                style={{
                  minWidth: 110,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "none",
                  // teal gradient (matches the screenshot style; not plain blue)
                  background: "linear-gradient(90deg,#278ea5,#21e6c1)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: processing ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 6px rgba(33,230,193,0.12)",
                }}
              >
                {processing ? "Please wait..." : "OK"}
              </button>
            </div>
          </>
        ) : (
          // Success view with spinner and grey message
          <div style={{ padding: "8px 4px" }}>
            <div
              aria-hidden
              style={{
                width: 44,
                height: 44,
                margin: "6px auto 8px auto",
                borderRadius: "50%",
                border: "4px solid #e6e6e6",
                borderTopColor: "#9aa1a8",
                animation: "logout-spin 0.9s linear infinite",
              }}
            />
            <p style={{ marginTop: 6, color: "#777", fontSize: 15, fontWeight: 700 }}>
              Logout Success
            </p>
          </div>
        )}

        {/* spinner keyframes */}
        <style>{`
          @keyframes logout-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}