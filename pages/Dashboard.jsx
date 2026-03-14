import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Header from "../components/Header";

// Placeholder images
import heroImgTop from "../assets/images/dashboard/hero-top.jpg";
import heroImgBottom1 from "../assets/images/dashboard/hero-bottom-1.jpg";
import heroImgBottom2 from "../assets/images/dashboard/hero-bottom-2.jpg";

import product1 from "../assets/images/dashboard/product1.jpg";
import product2 from "../assets/images/dashboard/product2.jpg";
import product3 from "../assets/images/dashboard/product3.jpg";
import product4 from "../assets/images/dashboard/product4.jpg";
import product5 from "../assets/images/dashboard/product5.jpg";
import product6 from "../assets/images/dashboard/product6.jpg";

import brand1 from "../assets/images/dashboard/brand1.png";
import brand2 from "../assets/images/dashboard/brand2.png";
import brand3 from "../assets/images/dashboard/brand3.png";
import brand4 from "../assets/images/dashboard/brand4.png";
import brand5 from "../assets/images/dashboard/brand5.png";
import brand6 from "../assets/images/dashboard/brand6.png";
import brand7 from "../assets/images/dashboard/brand7.png";

import aboutImg from "../assets/images/dashboard/about.jpg";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Add/remove body class so global styles (or other components) can react if needed
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  const products = [
    { img: product1, title: "MJKIUU Slippers for men indoor Genuine leather Men Sandals", desc: "Handmade dress shoes Luxury Sandals Summer Beach Shoes Business Dress sandals", link: "/shoes"},
    { img: product2, title: "MJKIUU Slippers for men indoor Summer Men Water Beach Shoes", desc: "Designer Breathable Hiking Sandals Couples Slipon Half Shoes", link: "/shoes"},
    { img: product3, title: "Nike Women Gymnastics Shoes Basketball", desc: "", link: "/shoes"},
    { img: product4, title: "Mephisto Men's Edlef Slip-On Loafer", desc: "", link: "/shoes"},
    { img: product5, title: "Nike Boy's MD Valiant (Big Kid)", desc: "", link: "/shoes"},
    { img: product6, title: "Nike mens Air Jordan 1 Retro High OG", desc: "", link: "/shoes"},
  ];

  const categories = [
    "SHOES","APPAREL","ELECTRONICS","ACCESSORIES","JEWELRY","WATCHES","FURNITURE"
  ];

  const brands = [brand1,brand2,brand3,brand4,brand5,brand6,brand7];

  return (
    <div className="dashboard-page">

      {/* Pass onMenuClick so Header's hamburger is clickable and triggers sidebar on this page */}
      <Header onMenuClick={() => setSidebarOpen((s) => !s)} />

      {/* Simple sidebar overlay rendered by Dashboard when sidebarOpen */}
      {sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="dashboard-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="dashboard-sidebar"
            role="menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dashboard-sidebar-close"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>

            <nav aria-label="Sidebar navigation" className="dashboard-sidebar-nav">
              <ul>
                <li><Link to="/dashboard" onClick={() => setSidebarOpen(false)}>Home</Link></li>
                <li><Link to="/vip" onClick={() => setSidebarOpen(false)}>Premium Membership</Link></li>
                <li><Link to="/shoes" onClick={() => setSidebarOpen(false)}>Shoes</Link></li>
                <li><Link to="/apparel" onClick={() => setSidebarOpen(false)}>Apparel</Link></li>
                <li><Link to="/electronics" onClick={() => setSidebarOpen(false)}>Electronics</Link></li>
                <li><Link to="/accessories" onClick={() => setSidebarOpen(false)}>Accessories</Link></li>
                <li><Link to="/watches" onClick={() => setSidebarOpen(false)}>Watches</Link></li>
                <li><Link to="/furniture" onClick={() => setSidebarOpen(false)}>Furnitures</Link></li>
                <li><Link to="/about" onClick={() => setSidebarOpen(false)}>About Us</Link></li>
                <li><Link to="/JoinUs" onClick={() => setSidebarOpen(false)}>Join Us</Link></li>
                <li><Link to="/ContactUs" onClick={() => setSidebarOpen(false)}>Contact Us</Link></li>
              </ul>
            </nav>
          </aside>

          <style>{`
            .dashboard-sidebar-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.35);
              z-index: 15000;
              display: flex;
              justify-content: flex-start; /* sidebar from left */
              align-items: stretch;
            }
            .dashboard-sidebar {
              width: 280px;
              max-width: 86%;
              background: #fff;
              padding: 18px;
              box-sizing: border-box;
              box-shadow: 0 20px 60px rgba(0,0,0,0.2);
              overflow-y: auto;
            }
            .dashboard-sidebar-close {
              background: transparent;
              border: none;
              font-size: 28px;
              line-height: 1;
              padding: 6px;
              cursor: pointer;
              float: right;
            }
            .dashboard-sidebar-nav ul {
              list-style: none;
              padding: 0;
              margin: 10px 0 0 0;
            }
            .dashboard-sidebar-nav li {
              margin: 12px 0;
            }
            .dashboard-sidebar-nav a {
              color: #111;
              text-decoration: none;
              font-weight: 700;
              font-size: 15px;
            }

            @media (min-width:980px) {
              /* on desktop keep sidebar width smaller */
              .dashboard-sidebar { width: 340px; }
            }
          `}</style>
        </div>
      )}

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">

          <div className="dashboard-hero-text">
            <h1>CRUISE 2026<br/>COLLECTION</h1>
            <p className="dashboard-hero-subtitle">Louis Vuitton's latest drop.</p>

            <Link to="/shop" className="dashboard-hero-link">
              Shop New Arrivals
            </Link>
          </div>

          <div className="dashboard-hero-images">
            <div className="dashboard-hero-images-top">
              <img src={heroImgTop} alt="Hero Top"/>
            </div>

            <div className="dashboard-hero-images-bottom">
              <img src={heroImgBottom1} alt="Hero Bottom 1"/>
              <img src={heroImgBottom2} alt="Hero Bottom 2"/>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="dashboard-products">

        <h2>NEW SALES</h2>

        <div className="dashboard-products-grid">

          {products.map((p,i)=>(
            <div key={i} className="dashboard-product-card">

              <div className="dashboard-product-image">
                <img src={p.img} alt={p.title}/>
              </div>

              <div className="dashboard-product-info">
                <h3>{p.title}</h3>
                {p.desc && <p>{p.desc}</p>}
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="dashboard-categories">

        <h2>CATEGORIES</h2>

        <ul className="dashboard-categories-list">

          {categories.map((cat,i)=>(
            <li key={i} className="dashboard-category-item">

              <span className="dashboard-category-name">
                {cat}
              </span>

              <Link
                to={`/catalog/${cat.toLowerCase()}`}
                className="dashboard-category-link"
              >
                GO TO CATALOG
              </Link>

            </li>
          ))}

        </ul>

      </section>

      {/* BRANDS ROTATING */}
      <section className="dashboard-brands">

        <div className="brand-marquee">

          <div className="brand-track">

            {[...brands,...brands].map((logo,i)=>(
              <img
                key={i}
                src={logo}
                className="dashboard-brand-logo"
                alt="brand"
              />
            ))}

          </div>

        </div>

      </section>

      {/* GET STARTED */}
      <section className="dashboard-getstarted">

        <h2>GET STARTED</h2>

        <p>
          Join us to gain exclusive access to premium retail signals,
          earn exclusive rewards and collect bonuses.
        </p>

        <Link to="/vip" className="dashboard-getstarted-link">
          JOIN MEMBERSHIP
        </Link>

      </section>

      {/* ABOUT */}
      <section className="dashboard-about">

        <div className="dashboard-about-content">

          <div className="dashboard-about-text">

            <h2>ABOUT</h2>

            <p>
              GA Agency was founded by former E-Commerce merchants and
              startup entrepreneurs who set out to create the total premium retail hub.
            </p>

            <Link to="/about" className="dashboard-about-link">
              READ MORE
            </Link>

            <p className="about-contact-text">
              OUR TEAM IS ALWAYS READY TO ANSWER ANY QUESTIONS YOU MAY HAVE.
            </p>

            <Link to="/ContactUs" className="dashboard-about-link">
              CONTACT US
            </Link>

          </div>

          <div className="dashboard-about-image">
            <img src={aboutImg} alt="About"/>
          </div>

        </div>

      </section>

    </div>
  );
}