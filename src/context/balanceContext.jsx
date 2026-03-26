// src/context/balanceContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = "https://stacksapp-backend-main.onrender.com";

export const BalanceContext = createContext();

function getStoredToken() {
  // Support both storage keys used across the app ("token" and "authToken")
  try {
    return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
  } catch (e) {
    return "";
  }
}

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [commissionToday, setCommissionToday] = useState(0);
  const [taskCountToday, setTaskCountToday] = useState(0);
  const [username, setUsername] = useState("");
  const [vipLevel, setVipLevel] = useState("VIP1");
  const [userProfile, setUserProfile] = useState(null);
  // NEW: frontend-visible frozen amount (for displaying deducted/frozen balance while tasks pending)
  const [frozenAmount, setFrozenAmount] = useState(0);

  // Fetch user profile from backend on mount or after login
  const fetchProfile = async () => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/user-profile`, {
        headers: {
          "Content-Type": "application/json",
          // backend accepts lowercase or uppercase, use lowercase for consistency
          "x-auth-token": token,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.user) {
        setUsername(data.user.username || "");
        setBalance(data.user.balance ?? 0);
        setVipLevel(data.user.vipLevel || "VIP1");
        setCommissionToday(data.user.commissionToday ?? 0);
        setTaskCountToday(
          typeof data.user.taskCountThisSet === "number"
            ? data.user.taskCountThisSet
            : (data.user.taskCountToday ?? 0)
        );
        setUserProfile(data.user);
        // If backend exposes frozenAmount, use it to reconcile frontend
        if (typeof data.user.frozenAmount !== "undefined") {
          setFrozenAmount(Number(data.user.frozenAmount || 0));
        }
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Helper: call this after task start or submit to update balance etc from backend
  const refreshProfile = fetchProfile;

  // Deposit
  const deposit = async (amount) => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) await refreshProfile();
    } catch (err) {
      console.error("Failed to deposit", err);
    }
  };

  // Withdraw
  const withdraw = async (amount) => {
    const token = getStoredToken();
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_URL}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) await refreshProfile();
      return data.success;
    } catch (err) {
      console.error("Failed to withdraw", err);
      return false;
    }
  };

  // -------------------------
  // Optimistic / immediate UI updates helpers
  // -------------------------
  // Use these from UI immediately after a successful start-task / submit-task API call
  // (or even before for optimistic UX). They update local state right away; refreshProfile()
  // should be called to reconcile with server authoritative values.

  /**
   * Immediately apply a deduction when a task is started.
   * - price: number (deducted from balance and added to frozenAmount)
   * Example usage in Tasks.jsx after start-task success:
   *   applyStartDeduction(price);
   */
  const applyStartDeduction = (price = 0) => {
    const p = Number(price) || 0;
    if (p === 0) return;
    setBalance(prev => {
      // ensure we keep two decimals precision
      const next = Math.round(((Number(prev || 0) - p) + Number.EPSILON) * 100) / 100;
      return next;
    });
    setFrozenAmount(prev => {
      const next = Math.round(((Number(prev || 0) + p) + Number.EPSILON) * 100) / 100;
      return next;
    });
  };

  /**
   * Immediately apply a refund when a task is submitted/completed.
   * - refundAmount: number (amount returned to user balance, e.g. price)
   * - commissionAmount: number (commission also credited)
   *
   * After calling this the UI will show updated balance/frozen immediately.
   * Example usage after submit-task success:
   *   applySubmitRefund({ refundAmount: price, commissionAmount: commission });
   */
  const applySubmitRefund = ({ refundAmount = 0, commissionAmount = 0 } = {}) => {
    const r = Number(refundAmount) || 0;
    const c = Number(commissionAmount) || 0;
    if (r === 0 && c === 0) return;

    setBalance(prev => {
      const next = Math.round(((Number(prev || 0) + r + c) + Number.EPSILON) * 100) / 100;
      return next;
    });

    setFrozenAmount(prev => {
      // frozen amount should be reduced by the refunded part (r). Do not allow below 0.
      const next = Math.max(0, Math.round(((Number(prev || 0) - r) + Number.EPSILON) * 100) / 100);
      return next;
    });

    // Also adjust commissionToday locally (optimistic)
    setCommissionToday(prev => {
      const next = Math.round(((Number(prev || 0) + c) + Number.EPSILON) * 100) / 100;
      return next;
    });
  };

  // A convenience function to set both balance and frozen amount from an authoritative payload,
  // e.g., when start-task response returns currentBalance and frozenAmount.
  const applyServerProfile = ({ balance: b, frozenAmount: f, commissionToday: ct, taskCountThisSet: tc } = {}) => {
    if (typeof b !== "undefined") setBalance(Number(b || 0));
    if (typeof f !== "undefined") setFrozenAmount(Number(f || 0));
    if (typeof ct !== "undefined") setCommissionToday(Number(ct || 0));
    if (typeof tc !== "undefined") setTaskCountToday(Number(tc || 0));
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance,
        frozenAmount,
        setFrozenAmount,
        deposit,
        withdraw,
        commissionToday,
        setCommissionToday,
        taskCountToday,
        setTaskCountToday,
        username,
        vipLevel,
        setVipLevel,
        refreshProfile,
        userProfile,
        // optimistic helpers & server-apply helper
        applyStartDeduction,
        applySubmitRefund,
        applyServerProfile,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  return useContext(BalanceContext);
}
