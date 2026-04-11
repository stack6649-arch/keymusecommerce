// src/pages/Dashboards.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboards.css";

import { useBalance } from "../context/balanceContext";
import { useTaskRecords } from "../context/TaskRecordsContext";

/*
  Imported userimsnr as requested by the design change for mobile.
  Update the import path if your project keeps images in a different folder.
*/
import userimsnr from "../assets/images/dashboard/userImage.33dfdfb.png";

const vipConfig = {
  1: { taskLimit: 40 },
  2: { taskLimit: 45 },
  3: { taskLimit: 50 },
  4: { taskLimit: 55 },
};

/* --- BEGIN: Copied/Integrated registered-working-days & sign-in helpers --- */

// API base (keeps your existing VITE_API_URL fallback)
const API_BASE = import.meta.env.VITE_API_URL || 'https://keymuse-backend.onrender.com';

// Helper: date key in Europe/London to match backend
function toDateKey(d = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London' }).formatToParts(d);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  } catch (e) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
  }
}

// Safe local currentUser read/write so UI can persist sign state locally if server hasn't updated yet
function readLocalCurrentUser() {
  try {
    const s = localStorage.getItem("currentUser");
    if (!s) return null;
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}
function writeLocalCurrentUser(obj) {
  try {
    localStorage.setItem("currentUser", JSON.stringify(obj));
  } catch (e) {
    // ignore storage failures
  }
}

/* --- END: Copied/Integrated helpers --- */

function TopStatBox({ accountBalance, commissionToday }) {
  return (
    <div className="dashboard-earnings">
      <div className="earn-col">
        <div className="earn-title">Today's earnings</div>
        <div className="earn-value"> {Number(commissionToday || 0).toFixed(2)}</div>
      </div>

      <div className="earn-col">
        <div className="earn-title">Yesterday's earnings</div>
        <div className="earn-value">0.00</div>
      </div>

      <div className="earn-col">
        <div className="earn-title">Total earnings</div>
        <div className="earn-value"> {Number(accountBalance || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}

/*
  RegisteredDays component updated to:
   - Require at least 2 task-sets on the same day before the sign-in button becomes enabled.
   - Show a progress counter (0/2, 1/2, 2/2) immediately before the sign-in button.
   - Sign-in button is greyed/disabled until progress == 2.
   - The small circular "mark" action button that previously allowed marking task-sets has been removed per request.
   - The day ticks (7-day visuals) only update after a successful sign-in (server-confirmed or persisted), so the UI won't flip back after refresh.
*/
function RegisteredDays({ records, userProfile, maxTasks, refreshProfile }) {
  const REQUIRED_SETS = 2;
  const todayKey = toDateKey(new Date());

  // Local persisted currentUser (fallback)
  const localCurrentUser = useMemo(() => readLocalCurrentUser(), []);

  // Server-supplied registeredWorkingDays map (or fallback from local storage)
  const serverRegMap = (userProfile && userProfile.registeredWorkingDays) || (localCurrentUser && localCurrentUser.registeredWorkingDays) || {};

  const serverHasToday = Object.prototype.hasOwnProperty.call(serverRegMap, todayKey);
  const registeredSetsTodayFromServer = serverHasToday ? serverRegMap[todayKey] : null;

  // Fallback: compute completed task count for today from local records (used to compute sets)
  const completedTasksTodayFallback = useMemo(() => {
    if (!records) return 0;
    let cnt = 0;
    records.forEach((r) => {
      const completedAt = r.completedAt || r.completed_at || r.createdAt || r.created || r.updatedAt || r.date;
      if (!completedAt) return;
      try {
        if (toDateKey(new Date(completedAt)) === todayKey && String(r.status).toLowerCase() === "completed") cnt += 1;
      } catch (e) {}
    });
    return cnt;
  }, [records, todayKey]);

  const computedSetsFromRecords = Math.floor((completedTasksTodayFallback || 0) / (maxTasks || 1));

  // Local counter of how many task-sets the user has indicated in this session (kept for progress display when relevant)
  const [tasksCompletedTodayLocal, setTasksCompletedTodayLocal] = useState(0);

  // Sign state from server or local persisted copy (controls the 7-day ticks)
  const initialSignState = (userProfile && userProfile.signState) || (localCurrentUser && localCurrentUser.signState) || { signedCount: 0, lastSignDate: null };
  const [signState, setSignState] = useState(initialSignState);

  // Keep signState synced when userProfile updates
  useEffect(() => {
    const local = readLocalCurrentUser();
    if (userProfile && userProfile.signState) {
      setSignState(userProfile.signState);
    } else if (local && local.signState) {
      setSignState(local.signState);
    } else {
      setSignState((prev) => prev || { signedCount: 0, lastSignDate: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  // Visual completedDays derive from signState.signedCount and update only after sign-in success
  const [completedDays, setCompletedDays] = useState(() =>
    Array.from({ length: 7 }, (_, i) => i < (initialSignState.signedCount || 0))
  );

  useEffect(() => {
    const cnt = signState?.signedCount || 0;
    setCompletedDays(Array.from({ length: 7 }, (_, i) => i < cnt));
  }, [signState?.signedCount]);

  const signedToday = signState.lastSignDate === todayKey;

  // Progress shown to user: combine server-known sets (or computed from records) with local increments
  const baseSets = registeredSetsTodayFromServer !== null ? registeredSetsTodayFromServer : computedSetsFromRecords;
  const progressCount = Math.min(REQUIRED_SETS, baseSets + (tasksCompletedTodayLocal || 0));

  // sign button enabled only when not already signed today and progressCount >= REQUIRED_SETS
  const signEnabled = !signedToday && progressCount >= REQUIRED_SETS;

  // Persist helper for local currentUser (so UI remains after refresh if server lags)
  function persistToLocalCurrentUser(partial = {}) {
    try {
      const cur = readLocalCurrentUser() || {};
      const merged = { ...cur, ...partial };
      writeLocalCurrentUser(merged);
    } catch (e) {
      // ignore
    }
  }

  // POST to server to perform sign-in. Only allowed if progressCount >= REQUIRED_SETS
  const handleSignIn = async () => {
    if (signedToday) return;
    if (progressCount < REQUIRED_SETS) {
      alert(`You must complete ${REQUIRED_SETS} sets to sign in. Progress: ${progressCount}/${REQUIRED_SETS}`);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["x-auth-token"] = token;
      const resp = await fetch(`${API_BASE}/api/sign-in`, { method: "POST", headers, body: JSON.stringify({}) });
      let body;
      try { body = await resp.json(); } catch (e) { body = null; }
      if (!resp.ok) {
        alert((body && body.message) || "Sign-in failed");
        return;
      }

      if (body && body.signState) {
        // server returned authoritative signState
        setSignState(body.signState);
        // persist server response to local currentUser for resilience
        persistToLocalCurrentUser({
          signState: body.signState,
          registeredWorkingDays: { ...(localCurrentUser && localCurrentUser.registeredWorkingDays ? localCurrentUser.registeredWorkingDays : {}), ...(body.registeredWorkingDays || {}) }
        });
        // refresh profile so other data (registeredWorkingDays) is consistent
        try { await refreshProfile?.(); } catch (e) {}
      } else {
        // server may process asynchronously. Create a local signState so UI reflects success persistently.
        const nextSignedCount = (signState.signedCount || 0) + 1;
        const newSignState = { signedCount: nextSignedCount, lastSignDate: todayKey };
        setSignState(newSignState);

        // locally mark today's registered sets as complete
        const localReg = { ...(localCurrentUser && localCurrentUser.registeredWorkingDays ? localCurrentUser.registeredWorkingDays : {}) };
        localReg[todayKey] = REQUIRED_SETS;

        persistToLocalCurrentUser({ signState: newSignState, registeredWorkingDays: localReg });

        // attempt to refresh authoritative profile, ignore errors
        try { await refreshProfile?.(); } catch (e) {}
      }

      // after successful sign-in, reset the local counter (so user can start next day)
      setTasksCompletedTodayLocal(0);
    } catch (err) {
      console.error('Sign-in request failed:', err);
      alert('Sign-in failed (network error). Try again.');
    }
  };

  // Note: the small circular action/mark button was intentionally removed per request.
  // If you later want a different control to increment tasksCompletedTodayLocal, reintroduce a UI element
  // that calls setTasksCompletedTodayLocal(n) appropriately.

  const signedCount = completedDays.filter(Boolean).length;

  const days = Array.from({ length: 7 });

  return (
    <div className="registered-card">
      <div className="registered-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="registered-title">Registered Working Days</div>
          {/* Progress indicator: 0/2, 1/2, 2/2 */}
          <div style={{ fontSize: 13, color: "#7f8b96" }}>
            <span style={{ color: progressCount >= REQUIRED_SETS ? "#0b62ff" : "#7f8b96", fontWeight: 700 }}>{`${progressCount}/${REQUIRED_SETS}`}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Sign-in button with tick/right icon. Disabled/greyed until progressCount >= REQUIRED_SETS */}
          <button
            type="button"
            onClick={handleSignIn}
            disabled={!signEnabled}
            aria-disabled={!signEnabled}
            style={{
              background: signEnabled ? "#0b62ff" : "#bfc2c6",
              color: "#fff",
              fontWeight: 800,
              borderRadius: 20,
              padding: "8px 14px",
              border: "none",
              cursor: signEnabled ? "pointer" : "not-allowed",
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            title={signedToday ? "Already signed today" : (signEnabled ? "Sign in for today" : `Complete ${REQUIRED_SETS} sets to sign in`)}
          >
            {/* tick icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{signedToday ? "Signed" : "Sign in"}</span>
          </button>
        </div>
      </div>

      <div className="registered-sub">
        You've checked in for <span>{signedCount}/7 Days</span>
      </div>

      <div className="days-row">
        {days.map((_, i) => {
          const completed = !!completedDays[i];
          return (
            <div key={i} className="day">
              <div className={`circle ${completed ? "signed" : ""}`}>
                {/* show a white tick when completed */}
                {completed && (
                  <svg
                    className="day-tick"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="day-label">{i + 1}d</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, items, grid }) {
  // Choose icon by section title (case-insensitive)
  const key = String(title || "").trim().toLowerCase();

  let iconSvg = null;

  if (key === "asset") {
    // Magnifier / search icon
    iconSvg = (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21L16.65 16.65" stroke="#WHITE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (key === "profile") {
    // User icon
    iconSvg = (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (key === "history") {
    // Cube / box icon
    iconSvg = (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M21 16.5V7.5C21 6.94772 20.5523 6.5 20 6.5L12 3.5L4 6.5C3.44772 6.5 3 6.94772 3 7.5V16.5C3 17.0523 3.44772 17.5 4 17.5L12 20.5L20 17.5C20.5523 17.5 21 17.0523 21 16.5Z" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 3.5V20.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  return (
    <div className="dash-section">

      <div className="section-header">
        <div className="section-title">{title}</div>

        <div className="section-icon" aria-hidden={iconSvg ? "false" : "true"}>
          {iconSvg}
        </div>
      </div>

      <div className={`section-grid ${grid}`}>
        {items.map((item, i) => (
          <Link key={i} to={item.link} className="dash-card">

            <div>
              <div className="card-title">{item.title}</div>
              <div className="card-desc">{item.desc}</div>
            </div>

            <div className="card-arrow">›</div>

          </Link>
        ))}
      </div>

    </div>
  );
}

const assetItems = [
  { title: "Access", desc: "Explore your loyalty rewards & track your progress", link: "/tasks" },
  { title: "Top Up", desc: "Recharge to increase your profits", link: "/deposit" },
  { title: "My Reward", desc: "Explore your rewards & track your progress", link: "/reward" },
  { title: "Withdrawal", desc: "Cash out your funds", link: "/withdraw" },
];

const profileItems = [
  { title: "My Account", desc: "Manage your sign in & password details", link: "/profile" },
  { title: "Referral Code", desc: "Get your amazing rewards", link: "/referral" },
];

const historyItems = [
  { title: "Orders", desc: "Track your orders status", link: "/records" },
  { title: "Funds", desc: "Track your recharges, withdrawals & earnings history", link: "/transaction-history" },
];

export default function Dashboards() {

  const { balance, commissionToday, vipLevel, refreshProfile, userProfile } = useBalance();
  const { records, fetchTaskRecords } = useTaskRecords();

  const displayName =
    userProfile?.username ||
    userProfile?.name ||
    "User";

  const frozenAmount = userProfile?.frozenAmount || 0;

  useEffect(() => {
    refreshProfile?.();
    fetchTaskRecords?.();
  }, []);

  // Map vip levels to names required by the product (1..4).
  // 1 => Basic, 2 => Premium, 3 => Elite, 4 => VIP
  const vipNames = {
    1: "Basic",
    2: "Premium",
    3: "Elite",
    4: "VIP",
  };

  // Determine label based on vipLevel; fallback to "Basic" if missing/invalid.
  const tierLabel = vipNames[vipLevel] || "Basic";

  // compute maxTasks (used by the registered-days logic for fallback set calculation)
  const maxTasks = (userProfile && userProfile.maxTasks) || vipConfig[Number(vipLevel)]?.taskLimit || 40;

  return (
    <main className="dashboard-wrap">

      <div className="dashboard-container">

        <div className="dashboard-header">

          <h1>Welcome in, {displayName}</h1>

          <div className="cred-box">
            <span className="tier">{tierLabel} ★</span>
            <span>Credibility: <b>100</b></span>
          </div>

        </div>

        <div className="top-cards">

          <div className="balance-card">

            {/* Desktop avatar uses imported image */}
            <div className="avatar-box">
              <img src={userimsnr} alt="user avatar" className="avatar-img" />
              <div className="avatar-plus">+</div>
            </div>

            {/* Mobile avatar (kept for mobile only) */}
            <div className="dashboard-avatar">
              <img src={userimsnr} alt="user avatar" />
              <div className="dashboard-avatar-add">+</div>
            </div>

            <div className="balance-info">

              <div className="balance-title">My Balance</div>
              <div className="balance-amount">
                 {Number(balance || 0).toFixed(2)}
              </div>

              <div className="balance-row">

                <div className="balance-mini">
                  <div>Frozen Balance</div>
                  <span> {Number(frozenAmount).toFixed(2)}</span>
                </div>

                <div className="balance-mini">
                  <div>Balance Due</div>
                  <span> 0.00</span>
                </div>

              </div>

            </div>

          </div>

          {/* RegisteredDays now uses the authoritative sign-in logic (server-first) while preserving your UI */}
          <RegisteredDays
            records={records}
            userProfile={userProfile}
            maxTasks={maxTasks}
            refreshProfile={refreshProfile}
          />

        </div>

        <TopStatBox
          accountBalance={balance}
          commissionToday={commissionToday}
        />

        <Section title="Asset" items={assetItems} grid="grid-4" />
        <Section title="Profile" items={profileItems} grid="grid-2" />
        <Section title="History" items={historyItems} grid="grid-2" />

      </div>

    </main>
  );
}
