import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/**
 * ErrorBoundary - shows a fallback UI with error message + stack.
 * This makes runtime errors visible instead of a white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // send to logging endpoint if you have one:
    // fetch('/log', { method: 'POST', body: JSON.stringify({error: String(error), stack: error.stack, info}) });
    console.error("Captured by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      const err = this.state.error;
      const stack = err?.stack || (this.state.info && this.state.info.componentStack) || "No stack available";
      const message = err?.message || String(err);
      return (
        <div style={{ padding: 24, background: "#fff", color: "#111", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ color: "#b91c1c" }}>Application error</h1>
          <p style={{ whiteSpace: "pre-wrap" }}><strong>{message}</strong></p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#fff", padding: 12, borderRadius: 6 }}>{stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Global error overlay for errors that happen before React mounts or outside React.
 * It appends a visible red banner with message + stack to document.body.
 */
function mountGlobalErrorOverlay() {
  function showOverlay(title, msg) {
    try {
      const existing = document.getElementById("__global_error_overlay__");
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.id = "__global_error_overlay__";
      overlay.style.position = "fixed";
      overlay.style.right = "12px";
      overlay.style.top = "12px";
      overlay.style.zIndex = "999999";
      overlay.style.maxWidth = "45%";
      overlay.style.padding = "12px";
      overlay.style.background = "#fff1f2";
      overlay.style.border = "1px solid #fecaca";
      overlay.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
      overlay.style.color = "#7f1d1d";
      overlay.style.fontFamily = "system-ui, sans-serif";
      overlay.style.fontSize = "13px";
      overlay.style.lineHeight = "1.4";
      overlay.style.whiteSpace = "pre-wrap";
      overlay.innerText = `${title}\n\n${msg}`;
      document.body.appendChild(overlay);
    } catch (e) {
      // ignore
      console.error("Failed to show overlay", e);
    }
  }

  window.addEventListener("error", (ev) => {
    const err = ev.error || ev.message || "Unknown error";
    const stack = ev.error?.stack || ev.filename || "";
    console.error("Global error:", ev);
    showOverlay("Uncaught Error", `${String(err)}\n\n${stack}`);
  });

  window.addEventListener("unhandledrejection", (ev) => {
    const reason = ev.reason || "Unhandled rejection";
    const stack = ev.reason?.stack || "";
    console.error("Unhandled rejection:", ev);
    showOverlay("Unhandled Promise Rejection", `${String(reason)}\n\n${stack}`);
  });
}

mountGlobalErrorOverlay();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
