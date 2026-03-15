import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { TaskRecordsProvider } from "./context/TaskRecordsContext";
import { BalanceProvider } from "./context/balanceContext";
import { ProfileProvider } from "./context/profileContext";
import { TransactionProvider } from "./context/transactionContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // On app load, check if user is already logged in
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    if (token && currentUser) {
      // User is already logged in, dispatch event to notify components
      try {
        const user = JSON.parse(currentUser);
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { username: user.username } }));
        window.dispatchEvent(new CustomEvent('userProfileLoaded', { detail: user }));
      } catch (e) {
        console.warn("Failed to parse stored user:", e);
      }
    }

    // Handle redirect from 404.html
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('redirect');
    
    if (redirectPath && window.location.pathname.includes('index.html')) {
      // Clean up the URL and redirect to the actual path
      const cleanPath = redirectPath.replace('/keymusecommerce/', '').replace('/index.html', '');
      window.history.replaceState({}, document.title, '/keymusecommerce' + cleanPath);
    }

    setIsInitialized(true);
  }, []);

  // Don't render until we've checked the session
  if (!isInitialized) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}
