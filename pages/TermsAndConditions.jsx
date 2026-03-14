// src/pages/TermsAndConditions.jsx
import React from "react";

/*
  TermsAndConditions.jsx

  - Renders only the Terms & Conditions content area.
  - Do NOT include global header/footer/return buttons here — the app provides those.
  - This version sets all text to bold as requested.
*/

export default function TermsAndConditions() {
  return (
    <div
      style={{
        background: "#ffffff",
        color: "#111",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: "28px 20px",
        display: "flex",
        justifyContent: "center",
        fontWeight: 700, // make all fonts bold
      }}
    >
      <div style={{ width: "100%", maxWidth: 980 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px 0" }}>Terms and Conditions</h1>
        <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "8px 0 20px 0" }} />

        <div style={{ fontSize: 13.5, lineHeight: 1.45, color: "#111", fontWeight: 700 }}>
          <p style={{ marginTop: 0, marginBottom: 8, fontWeight: 700 }}>I. Starting Optimization Tasks</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Account Restart Requirement:</strong> Accounts need a minimum of 100 GBP to start new optimization
            tasks. Reset tasks must be processed by contacting Customer Service.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Post-Task Withdrawal Protocol:</strong> Users must complete all required tasks before withdrawing funds;
            withdrawals are not permitted mid-task.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>II. Withdrawal Policies</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Large Withdrawals and VIP Limits:</strong> Contact customer service for withdrawals over 10,000 GBP.
            Withdrawal limits vary by VIP level:
          </p>

          <ul style={{ margin: "6px 0 6px 20px", fontWeight: 700 }}>
            <li>VIP1: Up to 5,000 GBP</li>
            <li>VIP2: Up to 10,000 GBP</li>
            <li>VIP3: Up to 20,000 GBP</li>
            <li>VIP4: Up to 100,000 GBP</li>
          </ul>

          <p style={{ margin: "6px 0" }}>
            <strong>Withdrawal Frequency by VIP Level:</strong>
          </p>
          <ul style={{ margin: "6px 0 6px 20px", fontWeight: 700 }}>
            <li>VIP1: 1 withdrawals per day</li>
            <li>VIP2: 2 withdrawals per day</li>
            <li>VIP3: 3 withdrawals per day</li>
            <li>VIP4: 4 withdrawals per day</li>
          </ul>

          <p style={{ margin: "6px 0" }}>
            <strong>Withdrawal After Task Completion:</strong> Withdrawals can be made upon completion of all tasks.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Task Completion for Withdrawal:</strong> Must complete all tasks before withdrawal request.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>No Withdrawal for Incomplete or Abandoned Tasks:</strong> Forfeiture of withdrawal and refund rights if
            tasks are abandoned or withdrawn from prematurely.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>User-Initiated Withdrawal Requests:</strong> Withdrawals processed only upon direct user request.
            Withdrawal cannot be processed while the task is in progress.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>III. Fund Management and Security</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Secure Funds Holding:</strong> Funds safely stored and fully accessible post-product optimization.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Automated Transaction Processing:</strong> To prevent fund loss.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Platform's Responsibility for Fund Loss:</strong> Liability for accidental loss of funds.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>IV. Account Security</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Keeping Login Details Confidential:</strong> Non-disclosure of login password and security code.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Password and Security Code Advice:</strong> Avoid predictable information.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Resetting Forgotten Credentials:</strong> Contact customer service for assistance.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>V. Product Earnings and Task Assignment</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Earnings Categories:</strong> Regular and six-fold categories. Daily tasks offer 1-8 chances for
            six-fold earnings.
          </p>

          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP1 Standard Product Earnings: <span style={{ fontWeight: 700 }}>0.5% profit per standard optimization product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP1 Combined Product Earnings: <span style={{ fontWeight: 700 }}>3% profit per combined product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP2 Standard Product Earnings: <span style={{ fontWeight: 700 }}>1% profit per standard optimization product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP2 Combined Product Earnings: <span style={{ fontWeight: 700 }}>6% profit per combined product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP3 Standard Product Earnings: <span style={{ fontWeight: 700 }}>1.5% profit per standard optimization product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP3 Combined Product Earnings: <span style={{ fontWeight: 700 }}>9% profit per combined product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP4 Standard Product Earnings: <span style={{ fontWeight: 700 }}>2% profit per standard optimization product.</span></p>
          <p style={{ margin: "6px 0", fontWeight: 700 }}>VIP4 Combined Product Earnings: <span style={{ fontWeight: 700 }}>12% profit per combined product.</span></p>

          <p style={{ margin: "6px 0" }}>
            <strong>Earnings and Funds Crediting:</strong> Post-task completion.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Random Task Assignments:</strong> Based on total account balance.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Non-Cancellable Tasks:</strong> Once a task is assigned, it cannot be canceled or transferred to others.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>VI. Combined Task Specifics</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Nature of Combined Products:</strong> 1 to 3 items, assigned randomly.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Number of orders for a combination of tasks:</strong> it is within the normal range to receive 1-8 high commission combinations in a group of tasks.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Increased Commissions for Combined Products:</strong> Six-fold commission compared to regular products.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Handling of Funds for Combined Products:</strong> Used for product trade submissions, reimbursed upon completion.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Balance-Based Product Allocation:</strong> Allocation based on total account balance.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Irrevocable Product Assignments:</strong> Cannot be canceled or skipped once assigned.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>VII. Deposit Conditions</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Verifying Deposit Addresses:</strong> Confirm addresses with customer service.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Incorrect Deposit Responsibility:</strong> User bears responsibility for losses due to incorrect deposits if not verified.
          </p>

          <p style={{ margin: "6px 0", fontWeight: 700 }}>Additional Deposit Details:</p>
          <ul style={{ margin: "6px 0 6px 20px", fontWeight: 700 }}>
            <li>4.1: Deposits align with financial ability; more deposits lead to higher profits.</li>
            <li>4.2: Deposits according to the negative balance for product portfolio.</li>
            <li>4.3: Daily updated valid address for deposits; confirm with customer service.</li>
            <li>4.4: No platform-merchant conflict for unverified deposit addresses; user bears loss.</li>
          </ul>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>VIII. Merchant Task Cooperation</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Impact of Delayed Task Completion:</strong> Affects merchant operations; timely completion crucial.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Merchant Deposit Details:</strong> Specific instructions provided by merchants.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Consequences of Task Delays:</strong> Negatively impacts merchants; risk of credit score deduction.
          </p>
          <ul style={{ margin: "6px 0 6px 20px", fontWeight: 700 }}>
            <li>8.1: Complete optimization within 8 hours</li>
            <li>8.2: Delay leads to merchant complaints and reputation score reduction.</li>
          </ul>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>IX. Invitations and User Eligibility</p>
          <p style={{ margin: "6px 0" }}>
            <strong>VIP4 Invitation Rights:</strong> Exclusive to VIP4 users with 30+ working days on the platform.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Restrictions on Inviting New Users:</strong> Users must complete all product optimizations to invite new users.
          </p>

          <p style={{ margin: "6px 0", fontWeight: 700 }}>Additional Invitation Details:</p>
          <ul style={{ margin: "6px 0 6px 20px", fontWeight: 700 }}>
            <li>9.1: No new user invitations if unable to complete tasks.</li>
            <li>9.2: Invitation quota will be allocated every month based on the user's performance.</li>
            <li>9.3: 20% profit reward from subordinate's account for successful invitations.</li>
          </ul>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>X. Operational Hours</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Platform Operations:</strong> 10:00 to 21:59:59 (UTC-00:00).
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Customer Service Availability:</strong> 10:00 to 21:59:59 (UTC-00:00).
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Withdrawal Operations Time:</strong> 10:00 to 21:59:59 (UTC-00:00).
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>XI. Personal Income Tax Compliance</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Tax Compliance:</strong> The Platform operates in compliance with local country tax laws. All financial
            transactions conducted through the Platform are subject to applicable tax regulations imposed by the authorities.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Withholding and Reporting:</strong> It is the responsibility of the user to declare and pay taxes on any
            income or profits derived from transactions through the Platform in accordance with local country tax laws.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Tax Thresholds:</strong> Users should be aware that their account balances and transaction volumes may
            be subject to different tax thresholds and reporting requirements under local country tax laws.
          </p>

          <p style={{ marginTop: 12, marginBottom: 6, fontWeight: 700 }}>XII. Confidentiality and Non-Disclosure Agreement</p>
          <p style={{ margin: "6px 0" }}>
            Upon registering an account with sequence, you agree to maintain the utmost confidentiality regarding all
            operations and merchant data encountered on the platform. This commitment is vital to protect our merchant
            partners and the integrity of Sequence.
          </p>

          <p style={{ margin: "6px 0", fontWeight: 700 }}>Key Provisions:</p>
          <p style={{ margin: "6px 0" }}>
            <strong>Non-Disclosure:</strong> You shall not disclose, imply, or suggest the existence of product optimization
            activities on Sequence, as such disclosure could inaccurately portray platform data as inauthentic, causing
            substantial harm to our merchant community.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Automatic Consent:</strong> Account registration on sequence is deemed as your express agreement to this
            confidentiality clause, binding you to its terms.
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Duration of Confidentiality:</strong> Your confidentiality obligation persists indefinitely, extending
            beyond account deactivation or termination, unless explicitly released in writing by Sequence.
          </p>

          <p style={{ margin: "6px 0" }}>
            By using Sequence you acknowledge and consent to uphold these confidentiality terms, understanding that failure
            to comply may lead to account termination and potential legal action for damages incurred.
          </p>
        </div>
      </div>
    </div>
  );
}