// src/pages/TermsAndConditions.jsx
import React from "react";
// imported hero image from assets (as shown in your screenshot)
import contactImg from "../assets/images/dashboard/contact-us.png";

/*
  TermsAndConditions.jsx

  - Renders only the Terms & Conditions content area.
  - Do NOT include global header/footer/return buttons here — the app provides those.
  - This version imports the hero image, keeps the heading underlined, removes the second decorative line,
    and increases spacing after each section so sections are more separated.
*/

export default function TermsAndConditions() {
  const BLUE = "#1f4de6";
  const CARD_BG = "#efeae7";
  const PAGE_BG = "#ffffff";
  const TEXT_COLOR = "#111";

  return (
    <div
      style={{
        background: PAGE_BG,
        color: TEXT_COLOR,
        minHeight: "100%",
        boxSizing: "border-box",
        padding: "28px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 980 }}>
        {/* Top hero area: image on left, title on right (stacked on narrow screens) */}
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Left decorative hero image (imported from assets as requested) */}
          <div style={{ flex: "0 0 360px", maxWidth: "100%" }}>
            <img
              src={contactImg}
              alt="hero"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 6,
                objectFit: "cover",
              }}
            />
          </div>

          {/* Right title */}
          <div style={{ flex: "1 1 240px", minWidth: 220 }}>
            <h2
              style={{
                color: BLUE,
                margin: 0,
                fontSize: 28,
                letterSpacing: 0.6,
                fontWeight: 800,
                textTransform: "uppercase",
                // heading underline (keeps the heading underlined)
                textDecoration: "underline",
                textDecorationColor: BLUE,
                textDecorationThickness: "3px",
                textUnderlineOffset: "6px",
                textDecorationSkipInk: "none",
                display: "inline-block",
                paddingBottom: 4,
              }}
            >
              TERMS &amp; CONDITION
            </h2>

            {/* NOTE: the second decorative bar (previously a separate div) was removed per request */}
          </div>
        </div>

        {/* Content card */}
        <div
          style={{
            background: CARD_BG,
            borderRadius: 8,
            padding: 28,
            boxSizing: "border-box",
            color: TEXT_COLOR,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <div style={{ marginBottom: 20, fontWeight: 700 }}>Important Notice:</div>

          <p style={{ marginTop: 0, marginBottom: 20 }}>
            Before registering, we want to emphasize that our platform is in no way affiliated with pyramid schemes.
            We operate as a legitimate data-driven platform, assisting our clients in optimizing product exposure
            through our marketing services. It's important to understand that the referral commissions provided to our
            users are solely for quality control purposes, ensuring a smooth work-flow for all parties involved. We do
            not endorse leaving pending product data submissions, as the responsibility falls back on the referrer.
            KEYMUS-Ecommerce eagerly awaits your presence on our working platform and sincerely appreciates your choice to
            join us.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 18, fontSize: 16 }}>Terms and Conditions:</h3>

          <h4 style={{ margin: "8px 0 14px 0", fontSize: 15 }}>Acceptance of Terms:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            By accessing and using our services, you agree to be bound by these terms and conditions.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Use of Services:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            Our services are provided for informational and/or transactional purposes only. You agree to use our
            services in compliance with all applicable laws and regulations.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Intellectual Property:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            All intellectual property rights related to our services, including but not limited to trademarks,
            copyrights, and patents, belong to our company. Unauthorized use or reproduction of our intellectual
            property is strictly prohibited.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Privacy and Data Protection:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            We value your privacy and handle your personal information following our Privacy Policy. By using our
            services, you consent to the collection, use, and disclosure of your data as outlined in the Privacy Policy.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Limitation of Liability:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            We strive to provide accurate and reliable information, but we do not guarantee the completeness or accuracy
            of the content on our platform. We shall not be held liable for any direct or indirect damages arising from
            the use of our services.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Third-Party Links:</h4>
          <p style={{ margin: "6px 0 18px 0" }}>
            Please be aware that our platform includes links to external websites and resources owned by third parties.
            While these links are provided for your convenience, it's important to note that we do not explicitly endorse
            the content, products, or services offered on these external sites. Additionally, we cannot be held
            responsible for the accuracy, legality, or content of these third-party websites.
          </p>
          <p style={{ margin: "6px 0 20px 0" }}>
            We encourage you to exercise caution and discretion when accessing and utilizing these links. Your engagement
            with any third-party resources is solely at your own risk. Please ensure that you are familiar with and
            comfortable with the practices and policies of these external sites before proceeding.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Termination:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            We reserve the right to terminate or suspend your access to our services at any time, without prior notice,
            for any reason deemed necessary.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Modifications:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            We may modify or update these terms and conditions from time to time. Any changes will be effective
            immediately upon posting on our platform. It is your responsibility to review the terms periodically and
            comply with the most recent version.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Governing Law:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            These terms and conditions are governed by the law of the United Kingdom of UK. Any disputes arising from the
            use of our services shall be subject to the exclusive jurisdiction of the courts in the United Kingdom of UK.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Severability:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            If any provision of these terms and conditions is deemed invalid or unenforceable, the remaining provisions
            shall continue to be valid and enforceable to the fullest extent permitted by law.
          </p>

          <p style={{ margin: "12px 0 20px 0" }}>
            By accessing and using our services, you acknowledge that you have read, understood, and agreed to be bound
            by these terms and conditions.
          </p>

          {/* Membership sections */}
          <h3 style={{ marginTop: 16, marginBottom: 18 }}>Membership:</h3>

          <div style={{ marginBottom: 16 }}>
            <strong>Basic:</strong>
            <div style={{ marginTop: 6 }}>
              <div>Commission/Data = 0.5%</div>
              <div>No. of Data = 40</div>
              <div>Basic Salary = 1,400 </div>
              <div>Unlock Condition = Initial Recharge of 50 ~ 1,499 </div>
              <div>Withdrawal limit per day: 10 ~ 2,000 </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>Premium:</strong>
            <div style={{ marginTop: 6 }}>
              <div>Commission/Data = 1.0%</div>
              <div>No. of Data = 43</div>
              <div>Basic Salary = 2,000 </div>
              <div>Upgrade Condition = Initial Recharge of 1,500 ~ 2,999 </div>
              <div>Withdrawal limit per day: 10 ~ 10,000 </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>Elite :</strong>
            <div style={{ marginTop: 6 }}>
              <div>Commission/Data = 1.5%</div>
              <div>No. of Data = 45</div>
              <div>Basic Salary = 2,600 </div>
              <div>Upgrade Condition = Initial Recharge of 3,000 ~ 4,999 </div>
              <div>Withdrawal limit per day: 10 ~ 50,000 </div>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <strong>VIP:</strong>
            <div style={{ marginTop: 6 }}>
              <div>Commission/Data = 2%</div>
              <div>No. of Data = 50</div>
              <div>Basic Salary = 3,400 </div>
              <div>Upgrade Condition = Initial Recharge of 5,000  or above</div>
              <div>Withdrawal limit per day: 10  or above.</div>
            </div>
          </div>

          <p style={{ margin: "6px 0 20px 0" }}>
            If the withdrawal amount exceeds the current membership level of the account, the user is required to
            recharge and upgrade to the corresponding membership level to get approval from the platform and financial
            department.
          </p>
          <p style={{ margin: "6px 0 20px 0" }}>
            The recharge for upgrading one level of membership is 5,000 . All the recharge made will be able to be
            returned to the binding address with the withdrawal amount after the required upgrading recharge.
          </p>

          <h4 style={{ margin: "12px 0 14px 0", fontSize: 15 }}>Withdrawal Eligibility Verification</h4>
          <p style={{ margin: "6px 0 18px 0" }}>
            Before any user’s first withdrawal request is processed, the user must complete a one-time Withdrawal
            Eligibility Verification.
          </p>

          <p style={{ margin: "6px 0 18px 0" }}>
            This verification is conducted to:
          </p>
          <ul style={{ margin: "10px 0 20px 22px" }}>
            <li>Validate completed task activity</li>
            <li>Protect users and the platform from errors or irregular activity</li>
            <li>Ensure accuracy and integrity within our payout process</li>
            <li>Maintain operational compliance and platform security</li>
          </ul>
          <p style={{ margin: "6px 0 20px 0" }}>
            This verification is conducted via a brief confirmation process and does not require submission of identity
            documents unless otherwise required by applicable law.
          </p>

          <p style={{ margin: "6px 0 22px 0" }}>
            Withdrawal requests will only proceed upon successful completion of this verification.
          </p>

          <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.06)", margin: "18px 0" }} />

          <div style={{ marginTop: 6 }}>
            <div style={{ marginBottom: 6 }}>
              To resolve a complaint regarding the Site or to receive further information regarding the use of the Site,
              please contact us at: <strong>customer-support@keymus-ecommerce-uk.cc</strong>
            </div>

            <div style={{ marginTop: 12 }}>
              <div>© KEYMUS-Ecommerce</div>
              <div>33 Broadwick Street, Soho, W1F 0DQ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
