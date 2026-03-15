import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerServiceModal from "../components/CustomerServiceModal.jsx";

// VIP images (imported from the filenames shown in your screenshots)
import vipBasic from "../assets/images/vip/download.png";
import vipPremium from "../assets/images/vip/download-1.png";
import vipElite from "../assets/images/vip/download-2.png";
import vipVip from "../assets/images/vip/download-3.png";

/*
  VIP.jsx (optimized for Chrome)
  - Adds image lazy-loading + async decoding to avoid large immediate image decode.
  - Adds CSS containment to limit layout/paint scope per card.
  - Keeps look, fills, and UPGRADE behavior (openCustomerService) intact.
  - Includes conservative runtime fix that hides large blocking overlays outside VIP content.
*/

const START_BLUE = "#1fb6fc";

const VIP_LEVELS = [
  {
    level: 1,
    title: "BASIC",
    image: vipBasic,
    color: "#10b981", // green
    bullets: [
      "Recharge 50 - 1499",
      "0.5% commission per data",
      "1.5% commission for merged data",
      "Limited to 40 data per set, 2 sets of data per day",
      "Maximum of 1 withdrawal per day",
      "0% withdrawal handling fee",
    ],
  },
  {
    level: 2,
    title: "PREMIUM",
    image: vipPremium,
    color: "#7c3aed", // purple
    bullets: [
      "Recharge 1500 - 2999",
      "1.0% commission per data",
      "3.0% commission for merged data",
      "Limited to 43 data per set, 2 sets of data per day",
      "Maximum of 1 withdrawal per day",
      "0% withdrawal handling fee",
    ],
  },
  {
    level: 3,
    title: "ELITE",
    image: vipElite,
    color: "#7f3fbf", // violet-ish
    bullets: [
      "Recharge 3000 - 4999",
      "1.5% commission per data",
      "4.5% commission for merged data",
      "Limited to 45 data per set, 3 sets of data per day",
      "Maximum of 2 withdrawals per day",
      "0% withdrawal handling fee",
    ],
  },
  {
    level: 4,
    title: "VIP",
    image: vipVip,
    color: "#f59e0b", // gold
    bullets: [
      "Recharge 5000 above",
      "2.0% commission per data",
      "6.0% commission for merged data",
      "Limited to 50 data per set, 3 sets of data per day",
      "Maximum of 2 withdrawals per day",
      "0% withdrawal handling fee",
    ],
  },
];

export default function VIP() {
  const navigate = useNavigate();

  const [loggedInVip, setLoggedInVip] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        const v = Number(parsed.vipLevel ?? parsed.vip ?? parsed.level);
        return v || 2;
      }
    } catch (e) {}
    return 2;
  });

  const defaultIndex =
    VIP_LEVELS.findIndex((v) => v.level === loggedInVip) >= 0
      ? VIP_LEVELS.findIndex((v) => v.level === loggedInVip)
      : Math.max(0, VIP_LEVELS.findIndex((v) => v.level === 2));

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0);
  const containerRef = useRef(null);

  // Customer service modal open state (added so clicking "UPGRADE" opens the modal)
  const [csOpen, setCsOpen] = useState(false);

  useEffect(() => {
    function handleStorage() {
      try {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
          const parsed = JSON.parse(stored);
          const v = Number(parsed.vipLevel ?? parsed.vip ?? parsed.level) || 2;
          setLoggedInVip(v);
        }
      } catch (e) {}
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const selected = VIP_LEVELS[selectedIndex];

  // open modal and dispatch legacy event for other listeners
  const openCustomerServiceModal = () => {
    try {
      setCsOpen(true);
      // keep the custom event for any other parts of the app that listen to it
      window.dispatchEvent(new CustomEvent("openCustomerService"));
    } catch (err) {
      // noop
    }
  };

  const handleCloseCustomerService = () => {
    setCsOpen(false);
  };

  // Conservative runtime overlay-hiding fix:
  useEffect(() => {
    const hidden = [];
    try {
      const root = containerRef.current;
      const vW = window.innerWidth || document.documentElement.clientWidth;
      const vH = window.innerHeight || document.documentElement.clientHeight;
      const MIN_AREA_RATIO = 0.6;
      const candidates = Array.from(document.querySelectorAll("body > *"));

      candidates.forEach((el) => {
        try {
          const cs = window.getComputedStyle(el);
          if (!cs) return;
          const pos = cs.position;
          if (!(pos === "fixed" || pos === "sticky" || pos === "absolute")) return;

          const rect = el.getBoundingClientRect();
          const area = Math.max(0, rect.width) * Math.max(0, rect.height);
          const viewportArea = vW * vH;
          const ratio = viewportArea > 0 ? area / viewportArea : 0;

          if (ratio >= MIN_AREA_RATIO && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0") {
            if (root && el.contains(root)) return;
            const original = {
              el,
              display: el.style.display || "",
              visibility: el.style.visibility || "",
              pointerEvents: el.style.pointerEvents || "",
            };
            el.setAttribute("data-vip-hidden", "true");
            el.style.display = "none";
            el.style.visibility = "hidden";
            el.style.pointerEvents = "none";
            hidden.push(original);
            console.log("VIP: hidden overlay element", el);
          }
        } catch (e) {}
      });
    } catch (e) {}

    return () => {
      try {
        const restored = Array.from(document.querySelectorAll("[data-vip-hidden='true']"));
        restored.forEach((el) => {
          el.style.display = "";
          el.style.visibility = "";
          el.style.pointerEvents = "";
          el.removeAttribute("data-vip-hidden");
          console.log("VIP: restored overlay element", el);
        });
      } catch (e) {}
    };
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: "auto", position: "relative", overflowX: "hidden", background: "#ffffff", color: "#111" }}>
      <main ref={containerRef} style={{ maxWidth: 1400, margin: "0 auto", padding: "18px 20px 60px", color: "#111" }}>
        <style>{`
          .vip-hero {
            background: linear-gradient(180deg, #f8fafb 0%, #ffffff 100%);
            padding: 22px 12px;
            border-radius: 6px;
            margin-bottom: 18px;
            text-align: center;
            border: 1px solid rgba(0,0,0,0.04);
          }
          .vip-hero h1 { margin: 0; font-weight: 900; letter-spacing: -0.02em; color: #1f4de6; }
          @media (min-width: 992px) { .vip-hero h1 { font-size: 48px; } }
          @media (max-width: 991px) { .vip-hero h1 { font-size: 34px; } }

          /* Grid with equal row heights to avoid overlap */
          .vip-grid { display: grid; gap: 18px; align-items: stretch; grid-auto-rows: 1fr; }
          @media (min-width: 1200px) { .vip-grid { grid-template-columns: repeat(4, 1fr); } }
          @media (min-width: 760px) and (max-width: 1199px) { .vip-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 759px) { .vip-grid { grid-template-columns: 1fr; } }

          /* Card: use containment to limit reflow/paint scope */
          .vip-card {
            border-radius: 12px;
            padding: 0;
            min-height: 320px;
            position: relative;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            overflow: visible;
            contain: layout; /* limits layout/paint to this element where supported */
            -webkit-overflow-scrolling: touch;
            backface-visibility: hidden;
          }
          .vip-card:focus, .vip-card:hover { transform: translateY(-2px); }

          .vip-accent { height: 8px; border-top-left-radius: 12px; border-top-right-radius: 12px; width: 100%; }

          .vip-inner {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 0 0 12px 12px;
            padding: 16px;
            background: #ffffff;
            border: 2px solid rgba(0,0,0,0.04);
            box-sizing: border-box;
            contain: content; /* further limit paint/layout */
          }

          .vip-image-wrap { text-align: center; margin-bottom: 10px; }
          .vip-image-wrap img { max-width: 140px; height: auto; display:block; margin: 0 auto; }

          .vip-bullets { color: rgba(0,0,0,0.85); margin-top: 6px; font-size: 15px; line-height: 1.8; padding-left: 12px; }
          .vip-bullets li { margin-bottom: 8px; }

          .vip-cta { display: flex; justify-content: center; margin-top: 12px; }

          .vip-button { padding: 10px 24px; border-radius: 8px; font-weight: 800; cursor: pointer; border: none; color: #fff; min-width: 150px; }
          .vip-button.current { background: #f3f4f6; color: #0b2b4a; border: 2px solid rgba(0,0,0,0.06); font-weight: 800; }

          .vip-card { --vip-color: #7c3aed; }
          .vip-card .vip-accent { background: var(--vip-color); }
          .vip-card .vip-button.upgrade { background: var(--vip-color); }

          .vip-card.visible { padding: 6px; border-radius: 14px; background: #fff; }
          .vip-card.visible .vip-inner { border-radius: 8px; }

          .vip-description { background: #f7f4f2; color: #111; padding: 20px; border-radius: 6px; margin-top: 26px; border: 1px solid rgba(0,0,0,0.03); clear: both; position: relative; z-index: 1; }

          .vip-footer-strip { margin-top: 18px; padding: 10px 0; text-align: center; color: rgba(0,0,0,0.6); border-top: 1px solid rgba(0,0,0,0.04); }

          @media (max-width: 760px) {
            .vip-card { min-height: 260px; }
            .vip-image-wrap img { max-width: 110px; }
            .vip-button { min-width: 140px; padding: 8px 18px; }
            .vip-bullets { font-size: 14px; line-height: 1.6; }
          }
        `}</style>

        <div className="vip-hero" aria-hidden>
          <h1>CHOOSE YOUR PACKAGE</h1>
        </div>

        <div className="vip-grid" ref={containerRef} aria-label="VIP packages">
          {VIP_LEVELS.map((v, idx) => {
            const isCurrent = loggedInVip === v.level;
            return (
              <div
                key={v.level}
                className={`vip-card visible`}
                data-vcolor="true"
                style={{ ["--vip-color"]: v.color }}
                onClick={() => setSelectedIndex(idx)}
                role="article"
                aria-label={`${v.title} package`}
              >
                <div className="vip-accent" style={{ background: v.color }} />

                <div className="vip-inner">
                  <div>
                    <div className="vip-image-wrap" aria-hidden>
                      <img
                        src={v.image}
                        alt={v.title}
                        loading="lazy"
                        decoding="async"
                        width="140"
                        height="80"
                        style={{ maxWidth: 140, height: "auto", display: "block", margin: "0 auto" }}
                      />
                    </div>

                    <ul className="vip-bullets" aria-hidden>
                      {v.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="vip-cta" aria-hidden>
                    {isCurrent ? (
                      <button className="vip-button current" disabled>
                        CURRENT
                      </button>
                    ) : (
                      <button
                        className="vip-button upgrade"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomerServiceModal();
                        }}
                        style={{ background: v.color }}
                      >
                        UPGRADE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="vip-description" aria-hidden>
          <h3 style={{ color: "#1f4de6", marginTop: 0 }}>Description</h3>
          <p style={{ marginTop: 8 }}>
            As a Premium Member, you can enjoy special benefits and privileges at all our Flash Sales.
          </p>
          <ol style={{ marginTop: 12 }}>
            <li>Enjoy early flash sale access in-store & online.</li>
            <li>Receive invitations for exclusive events and more! Our teams are working on a brand-new Loyalty Program.</li>
          </ol>
          <p style={{ marginTop: 10 }}>
            In the meantime, bear with us. Many exciting new brands are coming soon - at the showroom and online!
          </p>
        </div>

        <div className="vip-footer-strip">
          <span style={{ color: "#6b7280" }}> </span>
          <span style={{ marginLeft: 18, color: "#6b7280" }}> </span>
        </div>
      </main>

      {/* Customer service modal mounted for this page.
          Clicking "UPGRADE" opens this modal via csOpen state.
          We keep the legacy dispatch for other listeners above. */}
      <CustomerServiceModal open={csOpen} onClose={handleCloseCustomerService} />
    </div>
  );
}
