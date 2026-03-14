// src/pages/PrivatePolicy.jsx
import React from "react";

/*
  PrivatePolicy.jsx

  - Uses the original layout and sizing from your provided file.
  - Keeps the policy wording exactly as you supplied.
  - Makes all text bold (fontWeight: 700) while preserving original font sizes.
  - Adds clear paragraph separation between sections to improve readability.
  - Enlarges the first subtitle after each section to make the page neat and scannable.
  - Adds bullet lists where it improves structure (no new wording added).
  - Does NOT include global header/footer/return buttons (the app provides those).
*/

export default function PrivatePolicy() {
  const container = {
    background: "#ffffff",
    color: "#111",
    minHeight: "100%",
    boxSizing: "border-box",
    padding: "28px 20px",
    display: "flex",
    justifyContent: "center",
  };

  const inner = {
    width: "100%",
    maxWidth: 980,
  };

  const title = {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 12px 0",
  };

  const hr = {
    border: "none",
    borderTop: "1px solid #ccc",
    margin: "8px 0 20px 0",
  };

  const body = {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#111",
    fontWeight: 700, // make all text bold as requested
  };

  const subtitle = {
    fontSize: 16, // slightly larger for first subtitle after a section
    marginTop: 18,
    marginBottom: 8,
    fontWeight: 700,
    color: "#111",
  };

  const para = {
    marginTop: 12,
    fontWeight: 700,
  };

  const list = {
    marginTop: 8,
    marginLeft: 18,
    fontWeight: 700,
  };

  const smallNote = {
    marginTop: 20,
    color: "#444",
    fontSize: 13,
    fontWeight: 700,
  };

  return (
    <div style={container}>
      <div style={inner}>
        <h1 style={title}>Privacy Policy</h1>
        <hr style={hr} />

        <div style={body}>
          <p style={{ marginTop: 0 }}>
            Sequence Commerce Privacy Policy
          </p>

          <p style={para}>
            This Privacy Policy applies to Sequence Commerce, a company registered in Canada, with its headquarters located at 108 Summerlea Rd, Brampton, ON L6T 4X3, Canada.
          </p>

          <p style={para}>
            This Privacy Policy covers our website (https://sequencecommerce.com/) our brand marketing activities, our interactions with members of the public (e.g., during the recruitment process), and engagements with individuals acting in a professional capacity (e.g., in relation to enquiries, research, reporting, evaluation or business discussions). This Privacy Policy sets out the types of personal information we may collect about you when you interact with us on any website where this Privacy Policy is displayed.
          </p>

          <h2 style={subtitle}>What This Privacy Policy Does Not Cover:</h2>

          <p style={para}>
            Marketing and Advertising Services:
          </p>

          <p style={para}>
            This Privacy Policy does not apply to the activities undertaken by Sequence Commerce on behalf of its clients where it acts as a service provider. If you have any questions regarding the processing we carry out for any of our clients, or if you wish to exercise your rights in respect of such processing, please contact the relevant client directly.
          </p>

          <p style={para}>
            Employment:
          </p>

          <p style={para}>
            This Privacy Policy does not encompass any data processing undertaken by Sequence Commerce or its subsidiaries in relation to employment or the provision of contracted services. For assistance with such matters, please contact your local Human Resources office or, if you are no longer employed by Sequence Commerce, the Data Protection Office, using the contact details provided below.
          </p>

          <h2 style={subtitle}>How We Share Your Information</h2>

          <p style={para}>
            We will share your personal information if we believe it is necessary to comply with the law or to protect ourselves, our customers, or others.
          </p>

          <p style={para}>
            We may share any or all categories of personal information in response to a court order or subpoena. We may also share such information if requested by a government agency or investigative body. Additionally, we may share your personal information in order to enforce our agreements and protect our rights and/or the rights of others. We may share your personal information when investigating potential fraud, including fraud suspected to have occurred during promotional campaigns. Where required by law, if you win a sweepstake or competition, we may also share certain contact information with parties entitled to request a list of winners.
          </p>

          <p style={para}>
            We may share your personal information in the context of a business transaction, financing arrangement, or for other commercial needs.
          </p>

          <p style={para}>
            For example, if Sequence Commerce sells or merges any of its businesses (including affiliates, divisions and business units) or assets, applies for loans or opens bank accounts, we may disclose your personal information as part of that transaction, including to prospective buyers, partners, lenders or financial institutions. We may also share your personal information in the event of a similar change to our corporate structure. Your information may be shared during specific due diligence processes, and in the general course of managing and administering Sequence Commerce's business operations.
          </p>

          <h2 style={subtitle}>Your Rights Concerning Your Personal Information:</h2>

          <p style={para}>
            Opting Out of Interest-Based Advertising:
          </p>

          <p style={para}>
            Sequence Commerce provides users with the ability to opt out of certain uses of information within a digital environment. If you wish to opt out using your current browser, please click here and our systems will attempt to place an opt-out cookie on your computer.
          </p>

          <p style={para}>
            Although Sequence Commerce does not currently respond to 'Do Not Track' signals, when our systems detect an opt-out cookie or a mobile operating system opt-out signal, our solutions will stop engaging in interest-based advertising on the opted-out browser or device. If we have linked two or more browsers or devices, our systems will attempt to sever the connection for the opted-out browser or device.
          </p>

          <h2 style={subtitle}>Exercising Your Privacy Rights:</h2>

          <p style={para}>
            You may make the following more specific requests in relation to your personal information. Depending on where you reside and the nature of your request, we may or may not be legally required to comply, and the time required to fulfil such requests may vary:
          </p>

          <ul style={list}>
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction of inaccurate personal information</li>
            <li>Request deletion or restriction of processing where applicable</li>
            <li>Object to processing where applicable</li>
            <li>Request portability of your personal information where applicable</li>
          </ul>

          <h2 style={subtitle}>Sources of Personal Information</h2>

          <p style={para}>
            We use tracking tools such as browser cookies and web beacons to automatically or passively collect information about you. This includes data gathered when you interact with our websites, applications, advertisements, or emails sent by us or our vendors.
          </p>

          <p style={para}>
            We receive personal information from service providers we engage to operate on our behalf:
          </p>

          <ul style={list}>
            <li>For instance, vendors who host or maintain our websites and applications, or those who send promotional emails on our behalf, may provide us with information.</li>
            <li>Likewise, our recruitment agencies, marketing partners, advertising tech vendors and analytics providers may also share information with us.</li>
          </ul>

          <p style={para}>
            We receive personal information from other businesses:
          </p>

          <p style={para}>
            We may receive information from joint marketing partners and other business associates with whom we have a relationship. Mobile service providers may also supply data based on the device used to access our services.
          </p>

          <p style={para}>
            We receive personal information from social media platforms:
          </p>

          <p style={para}>
            If you post on one of our social media pages or connect your social media account to our website, we may receive information including details from your social media profile. We may also receive information about you if another user grants us access to their profile and you are one of their ‘connections’.
          </p>

          <p style={para}>
            We receive information from other sources:
          </p>

          <p style={para}>
            Other third parties may provide us with information about you, including clients and business or marketing partners who collect information directly or indirectly from you. We may also receive employment-related information from job networks or social platforms if you choose to import your data when applying for a position with us.
          </p>

          <h2 style={subtitle}>Combining Information</h2>

          <p style={para}>
            We combine information collected offline with data gathered online. Additionally, we may merge information obtained from third parties with the data we already hold. We may also aggregate your data with that of other users to identify preferences and trends over time. Furthermore, we consolidate data collected across devices such as desktop computers and mobile devices.
          </p>

        </div>
      </div>
    </div>
  );
}