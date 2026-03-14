// src/pages/PrivatePolicy.jsx
import React from "react";

/*
  PrivatePolicy.jsx

  - Renders the Privacy Policy content only.
  - Do NOT include global header/footer/return buttons — the app provides those.
  - Content and layout are constrained and scrollable so it sits correctly under the app header.
*/

export default function PrivatePolicy() {
  return (
    <div
      style={{
        background: "#ffffff",
        color: "#111",
        minHeight: "100%",
        boxSizing: "border-box",
        padding: "28px 21px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 980 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px 0" }}>Privacy Policy</h1>
        <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "8px 0 20px 0" }} />

        <div style={{ fontSize: 14, lineHeight: 1.6, color: "#111" }}>
          <p style={{ marginTop: 0 }}>
            <strong>Sequence Commerce Privacy Policy</strong>
          </p>

          <p>
            This Privacy Policy applies to Sequence Commerce, a company registered in Canada, with its headquarters located at 108 Summerdale Rd, Brampton, ON L6T 4X3, Canada.
          </p>

          <p>
            This Privacy Policy covers our website (https://sequencecommerce.com/) our brand marketing activities, our interactions with members of the public (e.g., during the recruitment process), and engagements with individuals acting in a professional capacity (e.g., in relation to enquiries, research, reporting, evaluation or business discussions). This Privacy Policy sets out the types of personal information we may collect about you when you interact with us on any website where this Privacy Policy is displayed.
          </p>

          <p style={{ marginTop: 12, fontWeight: 700 }}>Exercising Your Privacy Rights:</p>
          <p>
            You may make the following more specific requests in relation to your personal information. Depending on where you reside and the nature of your request, we may or may not be legally required to comply, and the time required to fulfil such requests may vary:
          </p>

          <p style={{ marginTop: 12, fontWeight: 700 }}>Sources of Personal Information</p>

          <p>
            We use tracking tools such as browser cookies and web beacons to automatically or passively collect information about you. This includes data gathered when you interact with our websites, applications, advertisements, or emails sent by us or our vendors.
          </p>

          <p style={{ marginTop: 8, fontWeight: 700 }}>We receive personal information from service providers we engage to operate on our behalf:</p>
          <p>
            For instance, vendors who host or maintain our websites and applications, or those who send promotional emails on our behalf, may provide us with information. Likewise, our recruitment agencies, marketing partners, advertising tech vendors and analytics providers may also share information with us.
          </p>

          <p style={{ marginTop: 8, fontWeight: 700 }}>We receive personal information from other businesses:</p>
          <p>
            We may receive information from joint marketing partners and other business associates with whom we have a relationship. Mobile service providers may also supply data based on the device used to access our services.
          </p>

          <p style={{ marginTop: 8, fontWeight: 700 }}>We receive personal information from social media platforms:</p>
          <p>
            If you post on one of our social media pages or connect your social media account to our website, we may receive information including details from your social media profile. We may also receive information about you if another user grants us access to their profile and you are one of their ‘connections’.
          </p>

          <p style={{ marginTop: 8, fontWeight: 700 }}>We receive information from other sources:</p>
          <p>
            Other third parties may provide us with information about you, including clients and business or marketing partners who collect information directly or indirectly from you. We may also receive employment-related information from job networks or social platforms if you choose to import your data when applying for a position with us.
          </p>

          <p style={{ marginTop: 12, fontWeight: 700 }}>Combining Information</p>
          <p>
            We combine information collected offline with data gathered online. Additionally, we may merge information obtained from third parties with the data we already hold. We may also aggregate your data with that of other users to identify preferences and trends over time. Furthermore, we consolidate data collected across devices such as desktop computers and mobile devices.
          </p>

          <p style={{ marginTop: 12 }}>
            <strong>How We Share Your Information</strong>
          </p>
          <p>
            We will share your personal information if we believe it is necessary to comply with the law or to protect ourselves, our customers, or others.
          </p>
          <p>
            We may share any or all categories of personal information in response to a court order or subpoena. We may also share such information if requested by a government agency or investigative body. Additionally, we may share your personal information in order to enforce our agreements and protect our rights and/or the rights of others. We may share your personal information when investigating potential fraud, including fraud suspected to have occurred during promotional campaigns. Where required by law, if you win a sweepstake or competition, we may also share certain contact information with parties entitled to request a list of winners.
          </p>
          <p>
            We may share your personal information in the context of a business transaction, financing arrangement, or for other commercial needs.
          </p>
          <p>
            For example, if Sequence Commerce sells or merges any of its businesses (including affiliates, divisions and business units) or assets, applies for loans or opens bank accounts, we may disclose your personal information as part of that transaction, including to prospective buyers, partners, lenders or financial institutions. We may also share your personal information in the event of a similar change to our corporate structure. Your information may be shared during specific due diligence processes, and in the general course of managing and administering Sequence Commerce's business operations.
          </p>

          <p style={{ marginTop: 12 }}>
            <strong>Your Rights Concerning Your Personal Information:</strong>
          </p>

          <p>
            <strong>Opting Out of Interest-Based Advertising:</strong> Sequence Commerce provides users with the ability to opt out of certain uses of information within a digital environment. If you wish to opt out using your current browser, please click here and our systems will attempt to place an opt-out cookie on your computer.
          </p>

          <p style={{ marginTop: 12 }}>
            Although Sequence Commerce does not currently respond to 'Do Not Track' signals, when our systems detect an opt-out cookie we will make commercially reasonable efforts to honour the opt-out preferences captured by the cookie.
          </p>

          <p style={{ marginTop: 12 }}>
            If you have any questions about this Privacy Policy, about personal information we hold about you, or wish to exercise any rights you may have in relation to that information, please contact the Data Protection Officer at: privacy@sequencecommerce.com (or the contact information provided on the site where this Privacy Policy appears).
          </p>

          <p style={{ marginTop: 20, color: "#444", fontSize: 13 }}>
            <em>Last updated: [insert date]</em>
          </p>
        </div>
      </div>
    </div>
  );
}
