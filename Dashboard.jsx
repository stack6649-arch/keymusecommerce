import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import chatIcon from "../assets/images/header/chat.png";

// Banner images (rotating, seamless, fit container)
import bannerImg1 from "../assets/images/dashboard/banner1.jpg";
import bannerImg2 from "../assets/images/dashboard/banner2.jpg";
import bannerImg3 from "../assets/images/dashboard/banner3.jpg";

// Section images
import shoesImg from "../assets/images/dashboard/Shoes.png";
import apparelImg from "../assets/images/dashboard/Apparel.png";
import electronicsImg from "../assets/images/dashboard/Electronics.png";
import accessoriesImg from "../assets/images/dashboard/Accessories.png";
import jewelryImg from "../assets/images/dashboard/Jewery.png";
import watchesImg from "../assets/images/dashboard/Watches.png";
import furnitureImg from "../assets/images/dashboard/Furniture.png";
import commoditiesImg from "../assets/images/dashboard/Commodities.png";

// Brand logo images
import chanelLogo from "../assets/images/brands/chanel.png";
import nikeLogo from "../assets/images/brands/nike.png";
import crocsLogo from "../assets/images/brands/crocs.png";
import appleLogo from "../assets/images/brands/apple.png";
import supremeLogo from "../assets/images/brands/supreme.png";
import lvLogo from "../assets/images/brands/louisvuitton.png";

import contactIcon from "../assets/images/dashboard/contact.png";
import joinIcon from "../assets/images/dashboard/join.png";
import bonusIcon from "../assets/images/dashboard/bonus.png";
import membershipIcon from "../assets/images/dashboard/membership.png";
import accountIcon from "../assets/images/dashboard/auth.svg";

import "./Dashboard.css";

// Banner data
const bannerSlides = [
  { img: bannerImg1 },
  { img: bannerImg2 },
  { img: bannerImg3 }
];

// SIDEBAR COMPONENT
function Sidebar({ open, onClose }) {
  return (
    <div className={`dashboard-sidebar-overlay${open ? " open" : ""}`}>
      <div className="dashboard-sidebar">
        <button className="dashboard-sidebar-close" onClick={onClose} aria-label="Close sidebar">&times;</button>
        <div className="dashboard-sidebar-title">SS&amp;C Sequence</div>
        <nav className="dashboard-sidebar-nav">
          {/* Sidebar links updated to navigate to the actual routes */}
          <Link to="/shoes" className="dashboard-sidebar-item">SHOES</Link>
          <Link to="/apparel" className="dashboard-sidebar-item">APPAREL</Link>
          <Link to="/electronics" className="dashboard-sidebar-item">ELECTRONICS</Link>
          <Link to="/accessories" className="dashboard-sidebar-item">ACCESSORIES</Link>
          <Link to="/jewelry" className="dashboard-sidebar-item">JEWELRY</Link>
          <Link to="/watches" className="dashboard-sidebar-item">WATCHES</Link>
          <Link to="/furniture" className="dashboard-sidebar-item">FURNITURE</Link>
          <Link to="/commodities" className="dashboard-sidebar-item">COMMODITIES</Link>
          <hr className="dashboard-sidebar-divider" />
          <Link to="#" className="dashboard-sidebar-item dashboard-sidebar-account">
            <img src={accountIcon} alt="Account" className="dashboard-sidebar-account-icon" />
            <span className="dashboard-sidebar-account-text">MY ACCOUNT</span>
          </Link>
          <Link to="/dashboards" className="dashboard-sidebar-item">DASHBOARD</Link>
          <Link to="#" className="dashboard-sidebar-item">PREMIUM MEMBERSHIP</Link>
        </nav>
      </div>
    </div>
  );
}

// HEADER
function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-bar">
        <img src={menuIcon} alt="Menu" className="header-icon" onClick={onMenuClick} style={{ cursor: "pointer" }} />
        <div className="header-logo-wrap">
          <img src={logo} alt="Sequence Logo" className="header-logo" />
        </div>
        <img src={refreshIcon} alt="Refresh" className="header-icon" />
      </div>
    </header>
  );
}

// FOOTER
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-logo-row">
          <img src={logo} alt="Sequence Logo" className="footer-logo" />
        </div>
        <div className="footer-about">
          We are a leading marketing agency that utilizes over 10 years of proprietary data and insights, combined with a team of 70+ expert marketers.<br />
          Join over 4,000 marketers who receive weekly digital marketing tips tailored for industries like electronics, household goods, and many more.
        </div>
        <div className="footer-links-row">
          <div>
            <div className="footer-section-title">COMPANY</div>
            <a href="#">About Us</a>
            <a href="#">Join Us</a>
            <a href="#">Contact Us</a>
            <a href="#">Premium Membership</a>
            <a href="#">Company Certificate</a>
          </div>
          <div>
            <div className="footer-section-title">INFORMATION</div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and Conditions</a>
            <a href="#">FAQs</a>
            <a href="#">Latest Events</a>
          </div>
        </div>
        <div className="footer-copyright-row">
          <span className="footer-copyright">
            <img src={logo} alt="Sequence Logo small" className="footer-logo-small" />
            &copy; 2025 - Sequence Commerce
          </span>
        </div>
      </div>
      <a href="mailto:support@sequence.com" className="footer-chat-btn" title="Customer Service">
        <img src={chatIcon} alt="Chat Icon" />
      </a>
    </footer>
  );
}

// BRAND LOGO ROW
function BrandLogoRow() {
  return (
    <div className="dashboard-brand-logo-row-scroll">
      <div className="dashboard-brand-logo-inner">
        <img src={chanelLogo} alt="CHANEL" className="dashboard-brand-img" />
        <img src={nikeLogo} alt="Nike" className="dashboard-brand-img" />
        <img src={crocsLogo} alt="crocs" className="dashboard-brand-img" />
        <img src={appleLogo} alt="Apple" className="dashboard-brand-img" />
        <img src={supremeLogo} alt="Supreme" className="dashboard-brand-img" />
        <img src={lvLogo} alt="Louis Vuitton" className="dashboard-brand-img" />
      </div>
      <div className="dashboard-brand-logo-fade"></div>
    </div>
  );
}

// QUICK MENU SECTION
function QuickMenu() {
  return (
    <div className="dashboard-quickmenu-section">
      <div className="dashboard-quickmenu-title">Get Started with SS&amp;C Sequence</div>
      <div className="dashboard-quickmenu-list">
        <div className="dashboard-quickmenu-item">
          <img src={contactIcon} alt="Contact" />
          <span>Contact Us &gt;</span>
        </div>
        <div className="dashboard-quickmenu-item">
          <img src={joinIcon} alt="Join" />
          <span>Join Us &gt;</span>
        </div>
        <div className="dashboard-quickmenu-item">
          <img src={bonusIcon} alt="Global Bonus" />
          <span>Global Bonus &gt;</span>
        </div>
        <div className="dashboard-quickmenu-item">
          <img src={membershipIcon} alt="Membership" />
          <span>Join Membership &gt;</span>
        </div>
      </div>
    </div>
  );
}

// Main dashboard sections
const dashboardSections = [
  { img: shoesImg, title: "Shoes", desc: "Pages feature designer brands", btn: "Discover", url: "/shoes" },
  { img: apparelImg, title: "Apparel", desc: "There's brand of apparel for everyone", btn: "Discover", url: "/apparel" },
  { img: electronicsImg, title: "Electronics", desc: "A integral part of our daily lives", btn: "Discover", url: "/electronics" },
  { img: accessoriesImg, title: "Accessories", desc: "The perfect accessories to complete a look", btn: "Discover", url: "/accessories" },
  { img: jewelryImg, title: "JEWELRY", desc: "The epitome of beauty and romances", btn: "Discover", url: "/jewelry" },
  { img: watchesImg, title: "Watches", desc: "Powered by a Swiss movement", btn: "Discover", url: "/watches" },
  { img: furnitureImg, title: "FURNITURE", desc: "Thoughtfully crafted furniture that elevates your space with style and function", btn: "Discover", url: "/furniture" },
  { img: commoditiesImg, title: "COMMODITIES", desc: "Thoughtfully crafted furniture that elevates your space with style and function", btn: "Discover", url: "/commodities" },
];

// Banner slider
function BannerSlider() {
  const trackRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let start;
    let pxPerSec = 40;
    let trackWidth = 0;

    function setTrackWidth() {
      if (trackRef.current) {
        trackWidth = trackRef.current.scrollWidth / 2;
      }
    }

    setTrackWidth();
    window.addEventListener("resize", setTrackWidth);

    function animateBanner(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      const px = (elapsed * pxPerSec) % trackWidth;
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${px}px)`;
      }
      animationFrameId = requestAnimationFrame(animateBanner);
    }

    animationFrameId = requestAnimationFrame(animateBanner);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setTrackWidth);
    };
  }, []);

  const allSlides = [...bannerSlides, ...bannerSlides];

  return (
    <section className="dashboard-banner-section banner-slider-container">
      <div className="banner-slider-track-continuous" ref={trackRef}>
        {allSlides.map((slide, i) => (
          <div className="banner-slider-slide-continuous" key={i}>
            <img src={slide.img} alt={`Banner ${i + 1}`} className="banner-slider-img" draggable={false} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="login-bg-hero">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <main className="dashboard-main-content">
        <BannerSlider />
        <div className="dashboard-banner-menu-spacing"></div>
        {dashboardSections.map((section, i) => (
          <section
            className={`dashboard-menu-section${section.title === "COMMODITIES" ? " commodities-section" : ""}`}
            key={section.title || i}
            style={{ backgroundImage: `url(${section.img})` }}
          >
            <div className="dashboard-menu-overlay">
              <div className="dashboard-menu-content dashboard-menu-content-center">
                <div className="dashboard-menu-title">{section.title}</div>
                <div className="dashboard-menu-desc">{section.desc}</div>
                <Link to={section.url} className="dashboard-menu-btn">
                  {section.btn} <span className="dashboard-menu-btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </section>
        ))}
        <BrandLogoRow />
        <QuickMenu />
      </main>
      <Footer />
    </div>
  );
}