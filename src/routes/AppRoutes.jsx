import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

// Public pages
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import TermsAndConditions from "../pages/TermsAndConditions.jsx";
import PrivatePolicy from "../pages/PrivatePolicy.jsx";
import JoinUs from "../pages/JoinUs.jsx";
import ContactUs from "../pages/ContactUs.jsx";

// Pages / Protected pages
import Dashboard from "../pages/Dashboard.jsx";
import Dashboards from "../pages/Dashboards.jsx";
import Deposit from "../pages/Deposit.jsx";
import Withdraw from "../pages/Withdraw.jsx";
import Tasks from "../pages/Tasks.jsx";
import VIP from "../pages/VIP.jsx";
import Profile from "../pages/Profile.jsx";
import About from "../pages/About.jsx";
import Events from "../pages/Events.jsx";
import FAQ from "../pages/FAQ.jsx";
import WalletBinding from "../pages/WalletBinding.jsx";
import Certificate from "../pages/Certificate.jsx";
import Records from "../pages/Records.jsx";
import PersonalInfo from "../pages/PersonalInfo.jsx";
import BindWallet from "../pages/BindWallet.jsx";
import Notifications from "../pages/Notifications.jsx";
import Watches from "../pages/Watches.jsx";
import Jewelry from "../pages/Jewelry.jsx";
import Electronics from "../pages/Electronics.jsx";
import Furniture from "../pages/Furniture.jsx";
import Commodities from "../pages/Commodities.jsx";
import Apparel from "../pages/Apparel.jsx";
import Accessories from "../pages/Accessories.jsx";
import Referral from "../pages/Referral.jsx";
import TransactionHistory from "../pages/TransactionHistory.jsx";
import Logout from "../pages/Logout.jsx";
import UpdatePassword from "../pages/UpdatePassword.jsx";
import UpdateWithdrawPassword from "../pages/UpdateWithdrawPassword.jsx";
import Shoes from "../pages/Shoes.jsx";

// Components
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Layout from "../components/Layout.jsx";

/*
  Lightweight wrapper that dispatches an event when a product route is visited.
  Layout (or another global component) can listen for "openProduct" and show a modal.
*/
function ProductWrapper() {
  const { id } = useParams();

  useEffect(() => {
    const product = { id, name: `Product ${id}`, description: "", price: "" };
    try {
      window.dispatchEvent(new CustomEvent("openProduct", { detail: product }));
    } catch (e) {
      // noop
    }
  }, [id]);

  return null;
}

/* Public wrapper that triggers the global customer service modal */
function CustomerServiceWrapper() {
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (e) {
      // noop
    }
  }, []);

  return null;
}

export default function AppRoutes() {
  /*
    Use HashRouter for GitHub Pages compatibility.

    - URLs will look like:
        https://stack6649-arch.github.io/keymusecommerce/#/shoes
      which avoids 404/file-path issues on refresh.
    - Root (/) now redirects to the public Dashboard page per your request.
  */
  return (
    <Router>
      <Routes>
        {/* Root redirect: always go to public Dashboard page */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public auth pages (no Layout so they don't show header/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages rendered inside Layout: header/footer/sidebar handled by Layout */}
        <Route element={<Layout />}>
          {/* Dashboard is PUBLIC (not protected) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* PUBLIC FOOTER/PUBLIC PAGES (No protection) */}
          <Route path="/JoinUs" element={<JoinUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/PrivatePolicy" element={<PrivatePolicy />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />

          {/* PUBLIC PRODUCT PAGES (No protection) */}
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/jewelry" element={<Jewelry />} />

          {/* PROTECTED PAGES (Require authentication) */}
          <Route path="/dashboards" element={<ProtectedRoute><Dashboards /></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/vip" element={<ProtectedRoute><VIP /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
          <Route path="/wallet-binding" element={<ProtectedRoute><WalletBinding /></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
          <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
          <Route path="/personal-info" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
          <Route path="/bindwallet" element={<ProtectedRoute><BindWallet /></ProtectedRoute>} />
          <Route path="/bind-wallet" element={<ProtectedRoute><BindWallet /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
          <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />

          {/* PROTECTED PASSWORD UPDATE ROUTES */}
          <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="/update-withdraw-password" element={<ProtectedRoute><UpdateWithdrawPassword /></ProtectedRoute>} />

          {/* Product modal wrapper routes (PUBLIC) */}
          <Route path="/product/:id" element={<ProductWrapper />} />
          <Route path="/shoes/:id" element={<ProductWrapper />} />
          <Route path="/apparel/:id" element={<ProductWrapper />} />
          <Route path="/accessories/:id" element={<ProductWrapper />} />
          <Route path="/electronics/:id" element={<ProductWrapper />} />
          <Route path="/jewelry/:id" element={<ProductWrapper />} />
          <Route path="/furniture/:id" element={<ProductWrapper />} />
          <Route path="/commodities/:id" element={<ProductWrapper />} />
          <Route path="/watches/:id" element={<ProductWrapper />} />

          {/* Customer Service route - dispatches global event to open service modal */}
          <Route path="/customer-service" element={<CustomerServiceWrapper />} />
        </Route>

        {/* Fallback: point unknown routes to Dashboard (so users land on Dashboard, not Login) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
