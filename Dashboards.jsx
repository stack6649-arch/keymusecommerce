// src/pages/Dashboards.jsx
import React from "react";

import accessIcon from "../assets/images/dashboard/sign.svg";
import rechargeIcon from "../assets/images/dashboard/recharge.png";
import withdrawalIcon from "../assets/images/dashboard/withdrawal.png";
import transactionIcon from "../assets/images/dashboard/record.png";
import accountIcon from "../assets/images/dashboard/myaccount.png";
import referralIcon from "../assets/images/dashboard/invitation.png";
import ordersIcon from "../assets/images/dashboard/order.png";
import fundsIcon from "../assets/images/dashboard/record (2).png";
import walletIcon from "../assets/images/dashboard/reward.png";
import "./Dashboards.css";

// Welcome Card
function WelcomeCard() {
  return (
    <div className="dashboard-welcome-card">
      <h2 className="dashboard-welcome-title">Welcome,</h2>
      <div className="dashboard-welcome-user">MK</div>
      <div className="dashboard-welcome-membership">
        <span className="dashboard-welcome-tier">Membership Tier: VIP2</span>
      </div>
      <div className="dashboard-welcome-credibility-row">
        <span className="dashboard-welcome-credibility-label">Credibility</span>
        <div className="dashboard-welcome-progress-bar">
          <div
            className="dashboard-welcome-progress"
            style={{ width: "100%" }}
          ></div>
        </div>
        <span className="dashboard-welcome-progress-text">100%</span>
      </div>
    </div>
  );
}

// Stat Card Top
function StatCardTop() {
  return (
    <section className="dashboard-stat-card-top">
      <div className="dashboard-stat-value">1081.27</div>
      <div className="dashboard-stat-label">Account Balance (GBP)</div>
      <div className="dashboard-stat-value">0</div>
      <div className="dashboard-stat-label">Frozen Amount (GBP)</div>
      <div className="dashboard-stat-value">166.98</div>
      <div className="dashboard-stat-label">Today's Commission (GBP)</div>
    </section>
  );
}

// Registered working days
function RegisteredDays() {
  return (
    <div className="dashboard-registered-card">
      <div className="dashboard-registered-title-row">
        <span className="dashboard-registered-title">
          Registered working days
        </span>
        <button className="dashboard-signin-btn">
          Sign in immediately (1/1)
        </button>
      </div>
      <div className="dashboard-registered-days-list">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="dashboard-day-item" key={i}>
            <img
              src={accessIcon}
              alt={`Day ${i + 1}`}
              className="dashboard-day-icon"
            />
            <div className="dashboard-day-label">DAY {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Stat Card
function MainStatCard() {
  return (
    <section className="dashboard-stat-card-top">
      <div className="dashboard-stat-value">166.98</div>
      <div className="dashboard-stat-label">Today's Commission(GBP)</div>
      <div className="dashboard-stat-value">1081.27</div>
      <div className="dashboard-stat-label">Account Balance (GBP)</div>
      <div className="dashboard-stat-value">0 / 45</div>
      <div className="dashboard-stat-label">Data</div>
      <div className="dashboard-stat-value">0</div>
      <div className="dashboard-stat-label">Frozen Amount (GBP)</div>
    </section>
  );
}

// Section cards
function Section({ title, items }) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-title">{title}</div>
      {items.map((item, i) => (
        <div className="dashboard-card" key={i}>
          <div className="dashboard-card-icon-wrap">
            <img
              src={item.icon}
              alt={item.title + " icon"}
              className="dashboard-card-icon"
            />
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-title">{item.title}</div>
            <div className="dashboard-card-desc">{item.desc}</div>
            <a href={item.link} className="dashboard-card-link">
              Explore More &gt;
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}

const assetItems = [
  {
    icon: accessIcon,
    title: "Access",
    desc: "Explore your loyalty rewards & track your progress",
    link: "#",
  },
  {
    icon: rechargeIcon,
    title: "Recharge",
    desc: "Recharge to increase your profits",
    link: "#",
  },
  {
    icon: withdrawalIcon,
    title: "Withdrawal",
    desc: "Cash out your funds",
    link: "#",
  },
];

const profileItems = [
  {
    icon: transactionIcon,
    title: "Transaction History",
    desc: "Track your recharges, withdrawals & earnings history",
    link: "#",
  },
  {
    icon: accountIcon,
    title: "My Account",
    desc: "Manage your sign in & password details",
    link: "#",
  },
  {
    icon: referralIcon,
    title: "Referral Code",
    desc: "Get your amazing rewards",
    link: "#",
  },
];

const historyItems = [
  {
    icon: ordersIcon,
    title: "Orders",
    desc: "Track your orders status",
    link: "#",
  },
  {
    icon: fundsIcon,
    title: "Funds",
    desc: "Track your recharges, withdrawals & earnings history",
    link: "#",
  },
  {
    icon: walletIcon,
    title: "Bind Wallet Address",
    desc: "Bind your wallet information",
    link: "#",
  },
];

export default function Dashboards() {
  return (
    <main className="dashboard-main-bg">
      <div className="dashboard-centered-section">
        <h1 className="dashboard-title">Dashboard</h1>
        <hr className="dashboard-title-divider" />
        <WelcomeCard />
        <StatCardTop />
        <RegisteredDays />
        <MainStatCard />
        <Section title="Asset" items={assetItems} />
        <Section title="Profile" items={profileItems} />
        <Section title="History" items={historyItems} />
      </div>
    </main>
  );
}
