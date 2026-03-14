import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

// Public pages
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import TermsAndConditions from "../pages/TermsAndConditions.jsx";
import PrivatePolicy from "../pages/PrivatePolicy.jsx"; // <-- ADDED import
import JoinUs from "../pages/JoinUs.jsx"; // <-- ADDED import
import ContactUs from "../pages/ContactUs.jsx"; // <-- ADDED import

// Protected pages
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
import Watches from "../pages/Watches.jsx"; // <-- existing import
import Jewelry from "../pages/Jewelry.jsx"; // <-- ADDED import
import Electronics from "../pages/Electronics.jsx"; // <-- ADDED import
import Furniture from "../pages/Furniture.jsx"; // <-- ADDED import
import Commodities from "../pages/Commodities.jsx"; // <-- ADDED import
import Apparel from "../pages/Apparel.jsx"; // <-- ADDED import
import Accessories from "../pages/Accessories.jsx"; // <-- ADDED import
import Referral from "../pages/Referral.jsx"; // <-- NEW import

// Password update pages
import UpdatePassword from "../pages/UpdatePassword.jsx";
import UpdateWithdrawPassword from "../pages/UpdateWithdrawPassword.jsx";

// Custom page
import Shoes from "../pages/Shoes.jsx";

// Transaction History page
import TransactionHistory from "../pages/TransactionHistory.jsx"; // <-- ADDED

// Components
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Layout from "../components/Layout.jsx";
import Footer from "../components/Footer.jsx"; // add global Footer to show on Dashboard

/*
  ProductWrapper
  - Lightweight component that opens the global product modal by dispatching the "openProduct" CustomEvent.
  - IMPORTANT: product routes use this wrapper as a PUBLIC route (not wrapped in ProtectedRoute)
    so clicking product links like /shoes/33 will not trigger a redirect to /login when auth checks run.
  - Any category page can link to /<category>/<id> and this wrapper will open the global modal.
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
    // Keep user on same route; Layout's ProductModal will display the product.
  }, [id]);

  return null;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public auth pages: placed OUTSIDE Layout so they don't show the global header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Dashboard: keep its local header (Dashboard renders its own header),
            but render the global footer underneath by composing Footer here.
            The Dashboard path remains OUTSIDE Layout (so Layout doesn't inject the global header),
            and we explicitly render the global Footer component after the Dashboard component.
        */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Dashboard />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />

        {/* Public + other protected routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/terms" element={<TermsAndConditions />} />
          {/* Added routes to match footer links and avoid redirects to /login when clicked */}
          <Route path="/TermsAndConditions" element={<ProtectedRoute><TermsAndConditions /></ProtectedRoute>} />
          <Route path="/PrivatePolicy" element={<ProtectedRoute><PrivatePolicy /></ProtectedRoute>} />
          <Route path="/privatepolicy" element={<ProtectedRoute><PrivatePolicy /></ProtectedRoute>} />

          <Route
            path="/dashboards"
            element={<ProtectedRoute><Dashboards /></ProtectedRoute>}
          />
          <Route
            path="/deposit"
            element={<ProtectedRoute><Deposit /></ProtectedRoute>}
          />
          <Route
            path="/withdraw"
            element={<ProtectedRoute><Withdraw /></ProtectedRoute>}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute><Tasks /></ProtectedRoute>}
          />
          <Route
            path="/vip"
            element={<ProtectedRoute><VIP /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route
            path="/about"
            element={<ProtectedRoute><About /></ProtectedRoute>}
          />
          <Route
            path="/events"
            element={<ProtectedRoute><Events /></ProtectedRoute>}
          />
          <Route
            path="/faq"
            element={<ProtectedRoute><FAQ /></ProtectedRoute>}
          />
          <Route
            path="/wallet-binding"
            element={<ProtectedRoute><WalletBinding /></ProtectedRoute>}
          />
          <Route
            path="/certificate"
            element={<ProtectedRoute><Certificate /></ProtectedRoute>}
          />
          <Route
            path="/records"
            element={<ProtectedRoute><Records /></ProtectedRoute>}
          />
          <Route
            path="/referral"
            element={<ProtectedRoute><Referral /></ProtectedRoute>} // <-- NEW route
          />
          <Route
            path="/personal-info"
            element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>}
          />
          <Route
            path="/bind-wallet"
            element={<ProtectedRoute><BindWallet /></ProtectedRoute>}
          />
          <Route
            path="/notifications"
            element={<ProtectedRoute><Notifications /></ProtectedRoute>}
          />
          <Route
            path="/shoes"
            element={<ProtectedRoute><Shoes /></ProtectedRoute>}
          />

          <Route
            path="/apparel"
            element={<ProtectedRoute><Apparel /></ProtectedRoute>}
          />

          <Route
            path="/electronics"
            element={<ProtectedRoute><Electronics /></ProtectedRoute>}
          />

          <Route
            path="/furniture"
            element={<ProtectedRoute><Furniture /></ProtectedRoute>}
          />

          <Route
            path="/commodities"
            element={<ProtectedRoute><Commodities /></ProtectedRoute>}
          />

          <Route
            path="/accessories"
            element={<ProtectedRoute><Accessories /></ProtectedRoute>}
          />

          <Route
            path="/watches"
            element={<ProtectedRoute><Watches /></ProtectedRoute>}
          />
          <Route
            path="/jewelry"
            element={<ProtectedRoute><Jewelry /></ProtectedRoute>}
          />

          {/* Transaction History route */}
          <Route
            path="/transaction-history"
            element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>}
          />

          {/* Public Join Us page (linked from the footer) */}
          <Route path="/JoinUs" element={<JoinUs />} />

          {/* Public Contact Us page (linked from the footer) */}
          <Route path="/ContactUs" element={<ContactUs />} />

          /* -----------------------------------------------------------------
             Product routes for category item clicks:
             - These are PUBLIC routes (not wrapped in ProtectedRoute) so opening
               /shoes/:id (or other categories) won't redirect to /login.
             - They dispatch the global "openProduct" event which Layout mounts
               a global ProductModal listens for and displays.
             ----------------------------------------------------------------- */
          <Route path="/product/:id" element={<ProductWrapper />} />
          <Route path="/shoes/:id" element={<ProductWrapper />} />
          <Route path="/apparel/:id" element={<ProductWrapper />} />
          <Route path="/accessories/:id" element={<ProductWrapper />} />
          <Route path="/electronics/:id" element={<ProductWrapper />} />
          <Route path="/jewelry/:id" element={<ProductWrapper />} />
          <Route path="/furniture/:id" element={<ProductWrapper />} />
          <Route path="/commodities/:id" element={<ProductWrapper />} />
          <Route path="/watches/:id" element={<ProductWrapper />} />

          {/* Password update routes */}
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/update-withdraw-password" element={<UpdateWithdrawPassword />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}