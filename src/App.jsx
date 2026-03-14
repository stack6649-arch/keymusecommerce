import React from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { TaskRecordsProvider } from "./context/TaskRecordsContext";
import { BalanceProvider } from "./context/balanceContext";
import { ProfileProvider } from "./context/profileContext";
import { TransactionProvider } from "./context/transactionContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";

export default function App() {
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
