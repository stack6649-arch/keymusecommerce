import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import chatIcon from "../assets/images/header/chat.png";
import "./Login.css";
import Footer from "../components/Footer.jsx"; // import shared Footer
import Header from "../components/Header.jsx"; // use the global Header component
import Sidebar from "../components/Sidebar.jsx"; // import shared Sidebar

// FadeMessage overlay matches screenshot (centered, black, rounded)
function FadeMessage({ message, onDone, duration = 1200 }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);
  return (
    <div className="fade-message-center">
      <div className="fade-message-content">{message}</div>
      <style>
        {`
        .fade-message-center {
          position: fixed;
          left: 0; right: 0; top: 48%; z-index: 10000;
          display: flex; justify-content: center; pointer-events: none;
        }
        .fade-message-content {
          background: #181a1f;
          color: #fff;
          border-radius: 8px;
          padding: 0.7rem 2.2rem;
          font-weight: 600;
          font-size: 1.09rem;
          box-shadow: 0 2px 16px 0 #0003;
          text-align: center;
          min-width: 180px;
          max-width: 80vw;
          letter-spacing: 0.01em;
          opacity: 0.98;
          animation: fade-in-out-anim 1.2s linear;
        }
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

// Spinner overlay (unchanged)
function SpinnerOverlay({ duration = 500, onDone }) {
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
        background: "rgba(245,247,251,0.75)",
        pointerEvents: "none"
      }}
    >
      <div className="spinner" style={{
        width: 44, height: 44, border: "4px solid #ddd", borderTop: "4px solid #216378",
        borderRadius: "50%", animation: "spin 0.8s linear infinite"
      }} />
      <style>
        {`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}

/* LOGIN SUCCESS MODAL
   Matches screenshots on mobile + desktop:
   - Centered overlay
   - White rounded card with large "LOGIN SUCCESSFUL" title
   - small blue underline accent
   - message text and large black "Continue" button
*/
function LoginSuccessModal({ username, open, onClose }) {
  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" className="login-success-modal-overlay">
      <div className="login-success-modal" role="document" aria-labelledby="login-success-title">
        <h2 id="login-success-title" className="login-success-title">LOGIN SUCCESSFUL</h2>
        <div className="login-success-underline" aria-hidden />
        <p className="login-success-msg">Your account has been successfully logged in.</p>

        <button
          className="login-success-continue"
          onClick={onClose}
          aria-label="Continue"
        >
          Continue
        </button>
      </div>

      <style>{`
        /* overlay */
        .login-success-modal-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(11,18,25,0.45);
          z-index: 10050;
          padding: 24px;
          box-sizing: border-box;
        }

        .login-success-modal {
          width: 100%;
          max-width: 560px;
          background: #fbf9f8;
          border-radius: 14px;
          padding: 28px 30px;
          box-shadow: 0 20px 60px rgba(11,18,25,0.28);
          text-align: center;
        }

        .login-success-title {
          font-size: 28px;
          margin: 8px 0 12px;
          font-weight: 900;
          color: #0b0b0b;
          letter-spacing: 0.02em;
        }

        .login-success-underline {
          width: 56px;
          height: 6px;
          margin: 0 auto 18px;
          background: #1436c7; /* vivid blue */
          border-radius: 6px;
          box-shadow: 0 2px 0 rgba(20,54,199,0.08);
        }

        .login-success-msg {
          color: #0b0b0b;
          opacity: 0.9;
          margin-bottom: 22px;
          line-height: 1.6;
          font-size: 15px;
        }

        .login-success-continue {
          display: inline-block;
          width: 76%;
          max-width: 420px;
          background: #000;
          color: #fff;
          border: none;
          padding: 14px 18px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        @media (max-width: 520px) {
          .login-success-modal { padding: 20px 18px; max-width: 92vw; border-radius: 12px; }
          .login-success-title { font-size: 20px; }
          .login-success-continue { width: 100%; }
        }
      `}</style>
    </div>
  );
}

const API_URL = "https://keymuse-backend.onrender.com";

export default function Login({ refreshRecords }) {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [fadeMsg, setFadeMsg] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedUsername, setLoggedUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // helper: fetch profile and other user data immediately after login
  async function fetchAndCacheUserData(token) {
    if (!token) return null;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      // Fetch the main profile; other endpoints may depend on it
      const profileReq = fetch(`${API_URL}/api/user-profile`, { method: "GET", headers });
      // Optional: other data you might want eagerly: task-records, transactions
      const tasksReq = fetch(`${API_URL}/api/task-records`, { method: "GET", headers });
      const txReq = fetch(`${API_URL}/api/transactions`, { method: "GET", headers });

      // Run in parallel and ignore failures for non-critical endpoints
      const [profileRes, tasksRes, txRes] = await Promise.allSettled([profileReq, tasksReq, txReq]);

      let profile = null;
      if (profileRes.status === "fulfilled" && profileRes.value.ok) {
        try {
          const json = await profileRes.value.json();
          if (json && json.success && json.user) {
            profile = json.user;
            // Save main canonical user profile in localStorage
            localStorage.setItem("currentUser", JSON.stringify(profile));
            localStorage.setItem("user", profile.username || "");
            // Also keep token keys for compatibility across the app
            localStorage.setItem("authToken", token);
            localStorage.setItem("token", token);
          }
        } catch (e) {
          // ignore parse errors
          console.warn("Failed to parse profile response:", e);
        }
      }

      // tasks
      if (tasksRes.status === "fulfilled" && tasksRes.value.ok) {
        try {
          const json = await tasksRes.value.json();
          if (json && json.success && json.records) {
            localStorage.setItem("taskRecords", JSON.stringify(json.records));
          }
        } catch (e) { /* ignore */ }
      }

      // transactions
      if (txReq && txRes.status === "fulfilled" && txRes.value.ok) {
        try {
          const json = await txRes.value.json();
          if (json && json.success) {
            localStorage.setItem("transactions", JSON.stringify({ deposits: json.deposits, withdrawals: json.withdrawals }));
          }
        } catch (e) { /* ignore */ }
      }

      // notify other parts of the app
      if (profile) {
        try {
          window.dispatchEvent(new CustomEvent('userProfileLoaded', { detail: profile }));
          // Also fire a small authChanged event so Header or other components may pick username
          window.dispatchEvent(new CustomEvent('authChanged', { detail: { username: profile.username } }));
        } catch (e) { /* ignore */ }
      }

      return profile;
    } catch (err) {
      console.warn("fetchAndCacheUserData error:", err);
      return null;
    }
  }

  // Modified login flow:
  // - POST login
  // - If success: store token & user, call fetchAndCacheUserData to populate localStorage
  // - Show the "Login Successful" modal (do NOT auto-navigate)
  // - When user clicks Continue in the modal, close modal and navigate to /dashboard
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        // token can be returned either as data.token or data.user.token
        const token = data.token || (data.user && data.user.token) || (data.user && data.user?.token);

        // Save initial user object & token quickly so other sync code can read them
        if (data.user) {
          // store the raw user returned by login (may be partial)
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          localStorage.setItem("user", data.user.username || "");
          setLoggedUsername(data.user.username || input.trim());

          // IMMEDIATE notification so header updates as soon as modal appears
          try {
            window.dispatchEvent(new CustomEvent('authChanged', { detail: { username: data.user.username || input.trim() } }));
            window.dispatchEvent(new CustomEvent('userProfileLoaded', { detail: data.user }));
          } catch (e) {
            // ignore
          }
        } else {
          // fallback to input as username
          localStorage.setItem("user", input.trim());
          setLoggedUsername(input.trim());

          try {
            window.dispatchEvent(new CustomEvent('authChanged', { detail: { username: input.trim() } }));
          } catch (e) {}
        }
        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("token", token);
        }

        // fetch & cache profile + other data (may dispatch again when complete)
        fetchAndCacheUserData(token).catch(() => {});

        // show success modal and do not navigate automatically — user will click Continue
        setShowSuccessModal(true);

        // notify parent if needed
        if (typeof refreshRecords === "function") {
          try { refreshRecords(); } catch (e) { console.warn('refreshRecords failed', e); }
        }
      } else {
        setFadeMsg(data.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setFadeMsg("Server error. Please try again later.");
    }
  };

  // Called when modal Continue is clicked
  const onModalContinue = () => {
    setShowSuccessModal(false);
    // Ensure header components update: dispatch authChanged (again) with current username
    const uname = loggedUsername || (JSON.parse(localStorage.getItem("currentUser") || "null") || {}).username || localStorage.getItem("user") || "";
    try {
      window.dispatchEvent(new CustomEvent('authChanged', { detail: { username: uname } }));
      window.dispatchEvent(new CustomEvent('userProfileLoaded', { detail: JSON.parse(localStorage.getItem("currentUser") || "null") }));
    } catch (e) {}
    // Navigate after user acknowledges
    navigate("/dashboard");
  };

  React.useEffect(() => {
    if (fadeMsg && fadeMsg !== "Login Success") {
      const timer = setTimeout(() => setFadeMsg(""), 1200);
      return () => clearTimeout(timer);
    }
  }, [fadeMsg]);

  return (
    <div>
      <Header onMenuClick={() => setSidebarOpen(true)} isLoginPage={true} />
      {fadeMsg && <FadeMessage message={fadeMsg} />}
      {showSpinner && <SpinnerOverlay />}

      {/* Success modal */}
      <LoginSuccessModal username={loggedUsername} open={showSuccessModal} onClose={onModalContinue} />

      {/* Use shared Sidebar component */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Local styles to match the screenshot look - cream hero area with centered form */}
      <style>{`
        .login-hero {
          background: #efece9; /* light cream from screenshot */
          min-height: 56vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 16px 36px;
          box-sizing: border-box;
        }

        .login-card {
          width: 100%;
          max-width: 520px;
          background: transparent; /* keep background transparent so cream shows through */
          padding: 12px 18px 28px;
          box-sizing: border-box;
          text-align: center;
        }

        .welcome-title {
          font-size: 44px;
          line-height: 1;
          font-weight: 900;
          color: #111;
          margin: 0 0 22px;
          letter-spacing: 0.02em;
        }

        .back-btn {
          position: absolute;
          left: 18px;
          top: calc(56px + 16px); /* below header */
          background: #dcd8d4;
          border: none;
          color: #222;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .login-form {
          margin-top: 8px;
          text-align: left;
        }

        .login-label {
          font-size: 13px;
          color: #222;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .login-input {
          border-radius: 8px;
          border: 1px solid #eee;
          padding: 12px 14px;
          font-size: 14px;
          background: #fff;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 14px;
        }

        .remember-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          color: #222;
          font-size: 14px;
        }

        .login-btn-primary {
          display: block;
          width: 100%;
          background: linear-gradient(90deg,#0631d6,#0a4bf0);
          color: #fff;
          border: none;
          padding: 14px 16px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(8,76,214,0.16);
          margin-bottom: 14px;
        }

        .link-row {
          text-align: center;
          margin-top: 6px;
        }
        .link-small {
          color: #0645d6;
          text-decoration: underline;
          font-weight: 600;
          font-size: 13px;
        }

        /* Footer wrapper: make the Footer appear as the screenshot (large white footer) but keep pointer-event restrictions applied later */
        .login-footer-wrapper {
          background: #fff;
        }

        /* Responsive adjustments */
        @media (max-width: 520px) {
          .welcome-title { font-size: 28px; text-align: left; }
          .login-card { padding: 10px 12px 22px; }
          .back-btn { left: 10px; top: calc(56px + 10px); }
          .login-hero { padding-top: 20px; padding-bottom: 20px; min-height: 60vh; }
        }
      `}</style>

      {/* Main hero area */}
      <main className="login-hero" role="main" aria-labelledby="welcome-back">
        <button className="back-btn" aria-label="Back" onClick={() => window.history.back()}>
          ← BACK
        </button>

        <div className="login-card" aria-label="Login card">
          <h1 id="welcome-back" className="welcome-title">WELCOME BACK</h1>

          <section className="login-form" role="region" aria-label="Member Login">
            <form onSubmit={handleLogin}>
              <label className="login-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="login-input"
                placeholder="Username"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                autoComplete="username"
              />

              <label className="login-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <div className="remember-row">
                <input id="remember" type="checkbox" style={{ width: 16, height: 16 }} />
                <label htmlFor="remember" style={{ fontSize: 14 }}>Remember Me</label>
              </div>

              <button type="submit" className="login-btn-primary">SIGN IN</button>

              <div className="link-row">
                <a href="/forgot" className="link-small">Forgot your password?</a>
              </div>

              <div style={{ textAlign: "center", marginTop: 14 }}>
                <span style={{ color: "#444", fontSize: 13 }}>Don't Have An Account? </span>
                <Link to="/register" style={{ color: "#0645d6", fontWeight: 700, textDecoration: "underline" }}>Create an account</Link>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* Render shared Footer but keep the previous pointer-events restrictions for login page.
          The wrapper's background is white to match screenshots; Footer content remains the same component. */}
      <div className="login-footer-wrapper">
        <style>
          {`
            /* disable all interactions within the footer on the login page */
            .login-footer-wrapper .footer * {
              pointer-events: none !important;
            }

            /* enable interaction for the floating chat button and its children */
            .login-footer-wrapper .footer .footer-chat-btn,
            .login-footer-wrapper .footer .footer-chat-btn * {
              pointer-events: auto !important;
              cursor: pointer;
            }

            /* enable interaction for the customer service modal (mounted inside footer) */
            .login-footer-wrapper .footer [role="dialog"],
            .login-footer-wrapper .footer [role="dialog"] * {
              pointer-events: auto !important;
              cursor: auto;
            }

            /* ensure the chat button and modal overlay sit above other things */
            .login-footer-wrapper .footer .footer-chat-btn {
              z-index: 10001;
            }
            .login-footer-wrapper .footer [role="dialog"] {
              z-index: 10002;
            }

            /* Keep footer background white and spacious to match screenshot */
            .login-footer-wrapper .footer {
              background: #fff !important;
              color: #111 !important;
            }
          `}
        </style>

        <Footer />
      </div>
    </div>
  );
}
