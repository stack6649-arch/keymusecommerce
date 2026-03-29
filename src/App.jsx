import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { TaskRecordsProvider } from "./context/TaskRecordsContext";
import { BalanceProvider } from "./context/balanceContext";
import { ProfileProvider } from "./context/profileContext";
import { TransactionProvider } from "./context/transactionContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";
import SettingsProvider from "./context/SettingsContext";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const base = "/keymusecommerce";
    const { pathname, search, hash } = window.location;

    // 1) If the site was requested as /keymusecommerce/<route> (no hash),
    //    rewrite the URL to use the hash form: /keymusecommerce/#/<route>
    //    This avoids GitHub Pages 404 issues and lets HashRouter (or BrowserRouter with basename)
    //    match the route correctly without touching other app logic.
    if (pathname.indexOf(base) === 0) {
      const afterBase = pathname.slice(base.length) || "/";
      const hasNonRootRoute = afterBase !== "/" && afterBase !== "";
      const hasHash = hash && hash.length > 0;

      // Only rewrite when there is a route after the base and no hash present.
      if (hasNonRootRoute && !hasHash) {
        const targetHash = encodeURI((afterBase === "/" ? "/" : afterBase) + (search || "") + (hash || ""));
        const target = base + "/#" + targetHash;

        // Avoid replacing if the URL is already the same we want
        const current = window.location.pathname + window.location.search + window.location.hash;
        if (current !== target) {
          // Use history.replaceState so we don't trigger a full reload.
          window.history.replaceState({}, document.title, target);
        }
      }
    }

    // 2) Support the older redirect flow that used ?redirect=... (index.html?redirect=...)
    //    If present, convert it into a hash route too.
    try {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect");
      if (redirectParam) {
        // Normalize and remove any leading base
        let clean = redirectParam;
        if (clean.indexOf(base) === 0) {
          clean = clean.slice(base.length);
        }
        if (!clean.startsWith("/")) clean = "/" + clean;
        const target = base + "/#" + encodeURI(clean + (window.location.hash || ""));
        const current = window.location.pathname + window.location.search + window.location.hash;
        if (current !== target) {
          window.history.replaceState({}, document.title, target);
        }
      }
    } catch (e) {
      // ignore malformed URLSearchParams
      // console.warn("redirect handling failed", e);
    }

    // 3) Restore auth/profile events if token & user are in localStorage
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");
    if (token && currentUser) {
      try {
        const user = JSON.parse(currentUser);
        window.dispatchEvent(new CustomEvent("authChanged", { detail: { username: user.username } }));
        window.dispatchEvent(new CustomEvent("userProfileLoaded", { detail: user }));
      } catch (e) {
        console.warn("Failed to parse stored user:", e);
      }
    }

    // Mark initialized so app can render routes
    setIsInitialized(true);
  }, []);

  // Don't render until we've checked/rewritten the URL and restored session
  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <ToastProvider>
      <SettingsProvider>
        <ProfileProvider>
          <BalanceProvider>
            <TaskRecordsProvider>
              <TransactionProvider>
                <div className="min-h-screen bg-gray-100">
                  <AppRoutes />
                </div>
              </TransactionProvider>
            </TaskRecordsProvider>
          </BalanceProvider>
        </ProfileProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
