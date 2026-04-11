// src/context/balanceContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const BASE_URL = "https://keymuse-backend.onrender.com";

export const BalanceContext = createContext();

function getStoredToken() {
  try {
    return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
  } catch (e) {
    return "";
  }
}

function readProfileFromStorage() {
  try {
    const raw = localStorage.getItem("userProfile") || localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function BalanceProvider({ children }) {
  const stored = readProfileFromStorage();

  const [balance, setBalance] = useState(() => (stored && typeof stored.balance !== "undefined" ? stored.balance : 0));
  const [commissionToday, setCommissionToday] = useState(() => (stored && typeof stored.commissionToday !== "undefined" ? stored.commissionToday : 0));
  const [taskCountToday, setTaskCountToday] = useState(() => (stored && (typeof stored.taskCountThisSet === "number" ? stored.taskCountThisSet : (stored.taskCountToday ?? 0))));
  const [username, setUsername] = useState(() => (stored && stored.username ? stored.username : ""));
  const [vipLevel, setVipLevel] = useState(() => (stored && stored.vipLevel ? stored.vipLevel : "VIP1"));
  const [userProfile, setUserProfile] = useState(() => (stored || null));
  const [frozenAmount, setFrozenAmount] = useState(() => (stored && typeof stored.frozenAmount !== "undefined" ? stored.frozenAmount : 0));

  // fetchProfile: background fetch to reconcile server
  const fetchProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_URL}/api/user-profile`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.success && data.user) {
        const u = data.user;
        setUsername(u.username || "");
        setBalance(u.balance ?? 0);
        setVipLevel(u.vipLevel || "VIP1");
        setCommissionToday(u.commissionToday ?? 0);
        setTaskCountToday(typeof u.taskCountThisSet === "number" ? u.taskCountThisSet : (u.taskCountToday ?? 0));
        setUserProfile(u);
        if (typeof u.frozenAmount !== "undefined") {
          setFrozenAmount(Number(u.frozenAmount || 0));
        }
        try {
          localStorage.setItem("userProfile", JSON.stringify(u));
          localStorage.setItem("currentUser", JSON.stringify(u));
          window.dispatchEvent(new CustomEvent("profile:updated", { detail: u }));
        } catch (e) {}
        return u;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      return null;
    }
  }, []);

  useEffect(() => {
    // run background reconciliation but do not block UI
    let mounted = true;
    (async () => {
      try {
        await fetchProfile();
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, [fetchProfile]);

  // alias
  const refreshProfile = fetchProfile;

  // Deposit
  const deposit = async (amount) => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data && data.success) {
        // best-effort: refresh in background
        await refreshProfile();
      }
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
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data && data.success) await refreshProfile();
      return data && data.success;
    } catch (err) {
      console.error("Failed to withdraw", err);
      return false;
    }
  };

  // Optimistic helpers

  // applyStartDeduction: deduct price from visible balance and add to frozenAmount
  const applyStartDeduction = (price = 0) => {
    const p = Number(price) || 0;
    if (p === 0) return;
    setBalance(prev => {
      const next = Math.round(((Number(prev || 0) - p) + Number.EPSILON) * 100) / 100;
      return next;
    });
    setFrozenAmount(prev => {
      const next = Math.round(((Number(prev || 0) + p) + Number.EPSILON) * 100) / 100;
      return next;
    });
  };

  // applySubmitRefund: add refund and commission back to balance and reduce frozen
  const applySubmitRefund = ({ refundAmount = 0, commissionAmount = 0 } = {}) => {
    const r = Number(refundAmount) || 0;
    const c = Number(commissionAmount) || 0;
    if (r === 0 && c === 0) return;
    setBalance(prev => {
      const next = Math.round(((Number(prev || 0) + r + c) + Number.EPSILON) * 100) / 100;
      return next;
    });
    setFrozenAmount(prev => {
      const next = Math.max(0, Math.round(((Number(prev || 0) - r) + Number.EPSILON) * 100) / 100);
      return next;
    });
    setCommissionToday(prev => {
      const next = Math.round(((Number(prev || 0) + c) + Number.EPSILON) * 100) / 100;
      return next;
    });
  };

  // applyServerProfile: used when API returns currentBalance/frozenAmount explicitly
  const applyServerProfile = ({ balance: b, frozenAmount: f, commissionToday: ct, taskCountThisSet: tc } = {}) => {
    if (typeof b !== "undefined") setBalance(Number(b || 0));
    if (typeof f !== "undefined") setFrozenAmount(Number(f || 0));
    if (typeof ct !== "undefined") setCommissionToday(Number(ct || 0));
    if (typeof tc !== "undefined") setTaskCountToday(Number(tc || 0));
  };

  // Listen to profile updates (dispatched by ProfileProvider or other parts of app) and storage events
  useEffect(() => {
    function onProfileUpdated(evt) {
      try {
        const payload = evt?.detail;
        if (payload && typeof payload === "object") {
          setUserProfile(payload);
          setUsername(payload.username || "");
          setBalance(payload.balance ?? 0);
          setVipLevel(payload.vipLevel || "VIP1");
          setCommissionToday(payload.commissionToday ?? 0);
          setTaskCountToday(typeof payload.taskCountThisSet === "number" ? payload.taskCountThisSet : (payload.taskCountToday ?? 0));
          if (typeof payload.frozenAmount !== "undefined") setFrozenAmount(Number(payload.frozenAmount || 0));
        } else {
          const re = readProfileFromStorage();
          if (re) {
            setUserProfile(re);
            setUsername(re.username || "");
            setBalance(re.balance ?? 0);
            setVipLevel(re.vipLevel || "VIP1");
            setCommissionToday(re.commissionToday ?? 0);
            setTaskCountToday(typeof re.taskCountThisSet === "number" ? re.taskCountThisSet : (re.taskCountToday ?? 0));
            if (typeof re.frozenAmount !== "undefined") setFrozenAmount(Number(re.frozenAmount || 0));
          }
        }
      } catch (e) {}
    }

    function onStorage(e) {
      if (!e) return;
      if (e.key === "userProfile" || e.key === "currentUser" || e.key === "user") {
        try {
          const raw = e.newValue;
          if (raw) {
            const parsed = JSON.parse(raw);
            setUserProfile(parsed);
            setUsername(parsed.username || "");
            setBalance(parsed.balance ?? 0);
            setVipLevel(parsed.vipLevel || "VIP1");
            setCommissionToday(parsed.commissionToday ?? 0);
            setTaskCountToday(typeof parsed.taskCountThisSet === "number" ? parsed.taskCountThisSet : (parsed.taskCountToday ?? 0));
            if (typeof parsed.frozenAmount !== "undefined") setFrozenAmount(Number(parsed.frozenAmount || 0));
          } else {
            setUserProfile(null);
            setUsername("");
            setBalance(0);
            setVipLevel("VIP1");
            setCommissionToday(0);
            setTaskCountToday(0);
            setFrozenAmount(0);
          }
        } catch (_) {}
      }
      if (e.key === "authToken" && !e.newValue) {
        setUserProfile(null);
        setUsername("");
        setBalance(0);
        setCommissionToday(0);
        setTaskCountToday(0);
        setVipLevel("VIP1");
        setFrozenAmount(0);
      }
    }

    window.addEventListener("profile:updated", onProfileUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("profile:updated", onProfileUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

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
