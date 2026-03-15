// src/pages/PrivatePolicy.jsx
import React from "react";
// using same hero image as Terms page
import contactImg from "../assets/images/dashboard/contact-us.png";

/*
  PrivatePolicy.jsx

  - Matches the Terms page layout and appearance (left hero image, underlined heading, pale-beige content card).
  - Keeps the privacy policy text you provided (Last updated, location, full content).
  - Removes the extra decorative bar under the heading and increases spacing after each section to improve separation.
  - Does not touch or remove anything outside this file.
*/

export default function PrivatePolicy() {
  const BLUE = "#1f4de6";
  const CARD_BG = "#efeae7";
  const PAGE_BG = "#ffffff";
  const TEXT_COLOR = "#111";

  const sectionSpacing = { marginTop: 12, marginBottom: 20 }; // consistent spacing between sections

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
        {/* Top hero area: image on left, title on right (stacks on narrow screens) */}
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Left decorative hero image */}
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
                textDecoration: "underline",
                textDecorationColor: BLUE,
                textDecorationThickness: "3px",
                textUnderlineOffset: "6px",
                textDecorationSkipInk: "none",
                display: "inline-block",
                paddingBottom: 4,
              }}
            >
              PRIVACY POLICY
            </h2>
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
          <div style={{ ...sectionSpacing, fontWeight: 800 }}>Privacy Policy of KEYMUS-Ecommerce</div>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Last updated: Feb 10, 2025</div>

          <p style={{ marginTop: 0, marginBottom: 20 }}>
            This Privacy Policy covers the practices of KEYMUS-Ecommerce, registered in Melbourne, Australia.
          </p>

          <p style={{ ...sectionSpacing }}>
            This Privacy Policy applies to our website (https://keymus-ecommerce-uk.com/), marketing activities for our various brands,
            our interactions with members of the public (e.g., within our recruitment process), and with those acting in a
            professional capacity (e.g., when enquiring about, researching, reporting on, assessing, or engaging in business
            discussions). This Privacy Policy details the types of personal information we may collect about you when you interact
            with us on any website where this Privacy Policy appears.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>What This Privacy Policy Does Not Cover:</h3>

          <h4 style={{ margin: "8px 0 8px 0", fontSize: 15 }}>Marketing and Advertising Services:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            This Privacy Policy does not extend to the activities KEYMUS-Ecommerce undertakes on behalf of its clients, wherein it acts
            as a service provider. If you have inquiries about the processing we undertake for any of our clients or wish to assert
            your rights regarding that processing, please contact the relevant client directly.
          </p>

          <h4 style={{ margin: "8px 0 8px 0", fontSize: 15 }}>Employment:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            This Privacy Policy does not encompass any data processing carried out by KEYMUS-Ecommerce in connection with employment by or
            the supply of contracted services to KEYMUS-Ecommerce or its subsidiaries. Please contact your local Human Resources Office
            or the Data Protection Office (if no longer in employment with KEYMUS-Ecommerce) using the contact details below for assistance
            in these matters.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>Sources of Information:</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            We collect personal information about you from various sources.
          </p>

          <p style={{ margin: "6px 0 20px 0" }}>
            We, along with our service providers operating on our behalf, collect Personal Information about you, directly and
            indirectly, from the following categories of sources:
          </p>

          <h4 style={{ margin: "8px 0 8px 0", fontSize: 15 }}>We collect personal information directly from you:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            We gather information when you enter into an agreement, participate in a promotion, contact us, or sign up for our
            marketing communications and newsletters. Additionally, we collect any personal information you provide when you post a
            comment, make a request, or complete a survey.
          </p>

          <h4 style={{ margin: "8px 0 8px 0", fontSize: 15 }}>We collect personal information from your devices:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            We might share information with third parties who help us with our marketing efforts, including social media platforms,
            advertising networks, and ad tech companies. For example, we may share email addresses or other Contact Information with
            social media platforms so they can serve our advertising to you on their platform. Personal information received by our
            partners may also be subject to their privacy policies.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>When We Share Personal Information</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            We will share your personal information if we think we have to in order to comply with the law or to protect ourselves,
            our customers, and others.
          </p>

          <p style={{ margin: "6px 0 20px 0" }}>
            We may share any or all categories of personal information to respond to a court order or subpoena. We may also share this
            personal information if a government agency or investigatory body requests it. We might share your personal information in
            order to enforce our agreements and to protect our rights and/or the rights of others. We might share your personal information
            when we are investigating potential fraud. This might include fraud we think has happened during a promotion. Where we have a
            legal requirement to do so, if you are the winner of a sweepstakes or contest, we may also share your certain Contact Information
            with anyone entitled to request a list of winners.
          </p>

          <p style={{ margin: "6px 0 20px 0" }}>
            We may share your personal information as part of a transaction, financing, or for other business needs.
          </p>

          <p style={{ margin: "6px 0 20px 0" }}>
            For example, if KEYMUS-Ecommerce sells or merges any of its businesses (including any of our affiliates, divisions, and business units)
            or assets, applies for loans, or opens bank accounts, we may disclose your personal information as part of that transaction,
            including to the prospective buyer or partner, lender, or bank, as the case may be. We may share your personal information if
            there is a similar change to our corporate structure. We may also share your information with others as part of certain due
            diligence processes. We also share information for the purpose of management and administration of KEYMUS-Ecommerce business.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>Your Rights over Your Personal Information</h3>

          <h4 style={{ margin: "8px 0 8px 0", fontSize: 15 }}>Opting Out of Interest-Based Advertising:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            KEYMUS-Ecommerce enables users to opt-out from certain uses of information in a digital environment. If you want to opt-out from
            our solutions from the browser you are currently using, click here and our systems will attempt to place an opt-out cookie
            on your computer.
          </p>

          <p style={{ margin: "6px 0 20px 0" }}>
            While KEYMUS-Ecommerce does not currently respond to Do Not Track signals, when our systems detect the presence of our opt-out cookie
            or a mobile o/s opt-out indicator, our solutions will stop engaging in IBA for the opted-out browser or device. And if we have
            linked two or more browsers or devices as described above, our systems will attempt to sever the link for the opted-out browser
            or device.
          </p>

          <h4 style={{ margin: "8px 0 8px 0", fontSize: 15 }}>Exercising Your Privacy Rights:</h4>
          <p style={{ margin: "6px 0 20px 0" }}>
            You can make the below more specific requests with respect to your personal information. Depending on where you live and what you
            are asking us to do, we may or may not be obligated to comply with your request, and/or the time required to complete a request
            may vary:
          </p>

          <ul style={{ margin: "6px 0 20px 22px" }}>
            <li>Right to Know – You can request disclosure of the categories of personal information we collected about you, the sources, the categories of third parties with whom we shared information, and the business purposes over the past 12 months.</li>
            <li>Right to Access – You can request a copy of the specific pieces of personal information we collected about you over the past 12 months.</li>
            <li>Right of Deletion – You can request deletion of your personal information that we maintain about you, subject to certain exceptions.</li>
            <li>Do Not Sell My Info – You can request that we not sell your personal information by clicking Do Not Sell My Info.</li>
          </ul>

          <p style={{ margin: "6px 0 20px 0" }}>
            For purposes of this Privacy Policy, “sell” means the sale of your personal information to an outside party for monetary or other
            valuable consideration, subject to certain exceptions set forth in applicable California law. Any opt-out of cookie-based tracking
            for advertising purposes is specific to the device, website, and browser you are using and is deleted whenever you clear the cache
            of your browser.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>How We Protect Your Personal Information</h3>

          <p style={{ margin: "6px 0 20px 0" }}>
            KEYMUS-Ecommerce has reasonable security measures in place to help protect personal data from loss, misuse, unauthorized access, disclosure,
            alteration, and destruction.
          </p>

          <p style={{ margin: "6px 0 20px 0" }}>
            KEYMUS-Ecommerce has implemented reasonable, industry-standard security policies, standards, and practices designed to protect information
            from internal and external threats. The degree of protection for each piece of information is based on the risk and consequences
            associated with having that information compromised. While no security measures will provide for absolute security, all KEYMUS-Ecommerce
            employees responsible for the management of information have the responsibility to adhere to KEYMUS-Ecommerce documented security controls,
            which are developed commensurate with the understood risk.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>Our Responsibility for Website Links</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            This Privacy Policy is limited to the personal data collected by KEYMUS-Ecommerce. We provide links within this site to other websites,
            including social media sites such as Facebook, Twitter, and LinkedIn. If you follow these links, your use of these sites will be
            governed by their applicable user and privacy notices since their data practices fall outside the scope of this Privacy Policy. We
            have no responsibility for or control over the information collected by any third-party website, and we cannot be responsible for
            the protection and privacy of any information that you may provide on such websites.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>Children Under 16</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            This website is not intended for children aged 16 or under. We do not actively seek to collect personal data about children aged 16
            or under. If you have any concerns about the privacy of your child in relation to our services, or if you believe that your child
            under the age of 16 may have entered personal data onto our website, please contact us. We will delete such personal data from our
            records or seek verifiable parental or legal guardian consent to retain such information within a reasonable time.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>YOUR LEGAL RIGHTS IN THE UNITED KINGDOM</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            If you are currently staying in the United Kingdom, you are entitled, in accordance with applicable laws, to check whether we hold
            data about you and to have access to that data. If any of this data is incorrect or inaccurate, you have the right to correct or
            update it. Requests for access to or to correct personal data should be addressed to our Data Privacy Manager through the contact
            details provided on our website. In accordance with applicable law, we may be entitled to charge a reasonable fee for processing any
            data access or correction requests.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>LANGUAGE</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            This Privacy Policy is drafted in English. If there is a conflict between the English version of this Privacy Policy and any translations
            thereof, the English version shall prevail to the maximum extent permitted by law.
          </p>

          <h3 style={{ marginTop: 8, marginBottom: 12 }}>Contact Us</h3>
          <p style={{ margin: "6px 0 20px 0" }}>
            If you have any questions or concerns about our Privacy Policy, please contact us at: <strong>customer-support@keymus-ecommerce-uk.cc</strong>
          </p>

          <div style={{ marginTop: 6 }}>
            <div style={{ marginBottom: 6 }}>
              © KEYMUS-Ecommerce
            </div>
            <div>Offices: 33 Broadwick Street, Soho, W1F 0DQ</div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 8 }}>Updates to This Privacy Policy</h4>
          <p style={{ margin: "6px 0 18px 0" }}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            We will also update the “Last updated” date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically
            for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <p style={{ margin: "6px 0 18px 0" }}>
            If you have any questions or concerns about our Privacy Policy, please contact us at: <strong>customer-support@keymus-ecommerce-uk.cc</strong>
          </p>

          <div style={{ marginTop: 12 }}>
            <div>© KEYMUS-Ecommerce</div>
            <div>Offices: 33 Broadwick Street, Soho, W1F 0DQ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
