// src/components/FAQ.jsx
import React from "react";
import csImg from "../assets/images/dashboard/Cs.jpg"; // hero image (from your assets as in the screenshot)

/*
  FAQ.jsx

  - Uses the same page gradient / colour treatment as the VIP page.
  - Renders a responsive hero/banner image with centered "FAQs" heading (no local header / return / footer).
  - FAQ content area uses a dark panel (matching the VIP page) with white text.
  - Each Q&A block has extra spacing after it as requested.
  - The hero image is rendered with an <img> and styled to always fit (object-fit: cover) while respecting max height,
    so it remains contained within its card even when the viewport is maximized.
  - Do not modify other files.
*/

export default function FAQ() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background:
          "linear-gradient(120deg, #071e2f 0%, #1f4287 50%, #278ea5 85%, #21e6c1 100%)",
        color: "#fff",
      }}
    >
      {/* Hero/banner image (sits below the global header) */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: 6,
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <img
            src={csImg}
            alt="FAQs hero"
            style={{
              width: "100%",
              height: 320,
              maxHeight: 360,
              display: "block",
              objectFit: "cover", // ensures the image fills and is cropped appropriately but never overflows
            }}
          />
          {/* overlay + centered text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(7,30,47,0.45) 0%, rgba(7,30,47,0.65) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              color: "#fff",
              padding: "18px 12px",
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.95, marginBottom: 6 }}>Frequently Asked Questions</div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 0.6 }}>FAQs</div>
          </div>
        </div>
      </div>

      {/* Content container - centered and constrained like VIP */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 80px" }}>
        {/* Dark panel holding the FAQs (matches VIP page styling) */}
        <div
          style={{
            background: "#072033", // deep navy matching VIP inner panel
            borderRadius: 6,
            padding: "22px 22px 36px",
            color: "#ffffff",
            boxSizing: "border-box",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.04)",
            marginTop: 18,
          }}
        >
          <div style={{ fontSize: 15, lineHeight: 1.9, color: "#fff" }}>
            {/* Each Q&A pair is wrapped and spaced more generously */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: What is the minimum account balance required to start driving data?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> For the first and second data sets, a minimum account balance of 50 GBP and 100 GBP,
                respectively, is required.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: Can users request a reset of their account?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Yes, users can request an account reset from Customer Service after completing the first
                data set.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: Can users request a withdrawal after completing all required tasks?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Yes, users must complete all required tasks before they can apply for a withdrawal;
                withdrawals are not permitted mid-task.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>
                  Q: Can a withdrawal or refund be requested if a user gives up or withdraws in the middle of driving data?
                </strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> No, withdrawals or refunds cannot be requested in such cases. Users must complete all
                data sets before being eligible to request a withdrawal.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: How are funds held in the user's account?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> All funds are securely held in the user's account and can be withdrawn in full with no
                processing fee once all data has been completed.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: What precautions should users take regarding account security?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Users should not disclose their login or withdrawal passwords to others, as the platform
                is not responsible for any losses in such cases. It is recommended not to use easily guessable passwords,
                such as those including birthdays, ID card numbers, or mobile phone numbers.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: What should users do if they forget their login or withdrawal password?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Users should contact Customer Service to request a password reset if they forget their
                login or withdrawal password.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: Can data that has been dispatched to the user's account be cancelled or edited?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> No, once data has been dispatched to the user's account, it cannot be cancelled or edited.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: What is Merged data and Merged product?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Merged data consists of one to three merged products, which are randomly allocated to the
                user's account based on the availability of merged data at that time. This allocation considers the supply
                and demand of merged data, increasing the chance of receiving up to three merged data within a product data
                set.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: What is the commission rate for merged data compared to normal product data?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Users receive six times plus the commission rate for each product in the merged data
                compared to the normal data.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: Can the combined data be cancelled or edited after allocation? Why?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> No, once merged data is allocated to a user's account, it cannot be cancelled or edited
                due to contractual obligations with merchants/vendors. The platform must maintain the assigned product data as
                is to ensure the integrity of the contract.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: Is the recharge amount determined by the platform?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> No, the recharge amount is chosen by the user based on their ability and familiarity with
                the platform.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: How can users ensure the accuracy of recharge details?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Users must always request and confirm recharge details from Customer Service before making
                a recharge.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: What happens if a user makes a recharge to the wrong recharge details?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> The platform is not responsible for any recharges made to incorrect recharge details.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: How does delaying data completion affect the merchant?</strong>
              </p>
              <p style={{ margin: "6px 0 12px 0" }}>
                <strong>A:</strong> Delays in completing data can harm merchants' progress, affect product sales, and impact
                user credibility. Timely completion is vital for maintaining a positive reputation and ensuring a smooth workflow.
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "6px 0" }}>
                <strong>Q: Can users invite others to join their team?</strong>
              </p>
              <p style={{ margin: "6px 0 6px 0" }}>
                <strong>A:</strong> Users can invite others to join their team using an invitation code once they become a
                PLATINUM MEMBER. The referrer receives 20% of the referee's total earnings for the day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}