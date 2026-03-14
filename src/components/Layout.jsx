import React, { useEffect, useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

/*
  Layout.jsx

  - Centralised click-capture and product page rendering.
  - When a product URL is opened (e.g. /shoes/33, /product/33, /furniture/53, etc.)
    Layout renders a full-page "Orders" product view (with back arrow) instead of the
    global "Return Home Page" strip. The product page shows image, name, price and description.
  - Click interception captures product data from the clicked card's DOM and passes it
    via react-router location.state (and also stores in sessionStorage) so the exact clicked
    product is shown even after the navigation. For direct loads/refreshes, sessionStorage
    is used as a fallback; if nothing is available we show an id-based fallback.
  - Ensures the top of the page is shown whenever navigation happens across the app.
  - Global animated bars toast appears for 1 second BEFORE navigation happens globally.
  - Does not modify other files.
*/

/* detect product path and extract numeric id */
function parseProductIdFromPath(pathname) {
  const m = pathname.match(
    /\/(product|shoes|apparel|accessories|electronics|jewelry|furniture|commodities|watches)\/(\d+)(?:[\/?#]|$)/i
  );
  if (!m) return null;
  const id = parseInt(m[2], 10);
  return Number.isNaN(id) ? null : id;
}

/* helper: friendly name from image url */
function friendlyNameFromUrl(url) {
  try {
    const parts = url.split("/");
    let name = parts[parts.length - 1] || url;
    name = name.replace(/\.[a-zA-Z0-9]+$/, "");
    name = name.replace(/(_\d+){1,3}$/, "");
    name = name.replace(/[_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (name.length > 80) return name.slice(0, 77) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* heuristic description if none available */
function heuristicDesc(name) {
  const lower = (name || "").toLowerCase();
  if (!lower) return "High quality product.";
  if (lower.includes("boot")) return "Durable and stylish — great for outdoor and winter wear.";
  if (lower.includes("sneaker") || lower.includes("sneakers") || lower.includes("nike") || lower.includes("yeezy")) return "Comfortable sneaker for everyday wear and sports.";
  if (lower.includes("slipper") || lower.includes("loafer")) return "Casual and comfortable slip-on — great for home and casual outings.";
  if (lower.includes("oxford") || lower.includes("leather")) return "Premium leather craftsmanship for formal occasions.";
  if (lower.includes("heel") || lower.includes("pump")) return "Elevate your outfit with these stylish heels.";
  if (lower.includes("skate") || lower.includes("ice")) return "Specialized skate shoes for performance and style.";
  return "High quality product with excellent comfort and design.";
}

/* try to extract a price from a string (looks for currency symbols or plain numbers) */
function extractPriceFromText(text) {
  if (!text) return "";
  const currencyMatch = text.match(/(£|\$|€)\s*([0-9]+(?:[.,][0-9]{2})?)/);
  if (currencyMatch) return `${currencyMatch[1]}${currencyMatch[2].replace(",", ".")}`;
  const numMatch = text.match(/([0-9]{2,5}(?:\.[0-9]{1,2})?)/);
  if (numMatch) return `£${numMatch[0]}`;
  return "";
}

/* derive price from filename numbers as last resort */
function heuristicPriceFromUrl(url) {
  if (!url) return "";
  try {
    const lastSegment = (url.split("/").pop() || "").split("?")[0];
    const filename = lastSegment.replace(/\.[^/.]+$/, "");
    const m = filename.match(/(\d+(?:_\d+)*)$/);
    if (!m) return "";
    const digitsGroup = m[1];
    const parts = digitsGroup.split("_");
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts.slice(1).join("") : "";
    const price = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    return `£${price}`;
  } catch (e) {
    return "";
  }
}

/* Extract product info from the clicked anchor's DOM */
function extractProductFromAnchor(anchor) {
  if (!anchor) return null;

  const imgEl = anchor.querySelector("img");
  const img = imgEl ? (imgEl.src || imgEl.getAttribute("data-src") || "") : "";

  const titleEl =
    anchor.querySelector(".shoe-name") ||
    anchor.querySelector(".product-title") ||
    anchor.querySelector("h3") ||
    anchor.querySelector("h2") ||
    anchor.querySelector("[data-product-name]");
  const name = titleEl ? (titleEl.innerText || titleEl.textContent || "").trim() : "";

  const descEl =
    anchor.querySelector(".shoe-desc") ||
    anchor.querySelector(".product-desc") ||
    anchor.querySelector(".description") ||
    anchor.querySelector("[data-product-desc]");
  const description = descEl ? (descEl.innerText || descEl.textContent || "").trim() : "";

  const priceEl =
    anchor.querySelector(".price") ||
    anchor.querySelector("[data-product-price]") ||
    anchor.querySelector(".product-price") ||
    anchor.querySelector(".shoe-price");
  let price = priceEl ? (priceEl.innerText || priceEl.textContent || "").trim() : "";
  if (!price) {
    price = extractPriceFromText(anchor.innerText || anchor.textContent || "");
  }

  const urlDerivedPrice = img ? heuristicPriceFromUrl(img) : "";
  if (urlDerivedPrice) {
    price = urlDerivedPrice;
  }

  if (!img && !name && !description && !price) return null;

  return {
    name: name || (img ? friendlyNameFromUrl(img) : ""),
    description: description || (name ? heuristicDesc(name) : ""),
    price: price || "",
    images: img ? [img] : [],
  };
}

/* fallback when only id is present */
function buildFallbackProductForId(id) {
  return {
    id,
    name: `Product ${id}`,
    description: "",
    price: "",
    images: [],
  };
}

/* Global Toast Component */
function GlobalNavigationToast({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        pointerEvents: "none",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "24px",
            background: "#000",
            borderRadius: "3px",
            animation: `barBounce 0.8s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes barBounce {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

/* ProductPage component: full-page view titled "Orders" with back arrow header */
function ProductPage({ product }) {
  const title = product?.name ?? "Product";
  const images = product?.images ?? [];
  const firstImage = images.length ? images[0] : "";
  const description = product?.description ?? "";
  const price = product?.price ?? "";

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (e) {}
  }, []);

  return (
    <div className="product-page-view-wrapper">
      <style>{`
        .product-page-view-wrapper {
          max-width: 1100px;
          margin: 18px auto 40px;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .product-panel {
          background: #eef6ff;
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(11, 43, 74, 0.06);
          position: relative;
          overflow: visible;
        }

        .product-panel::before {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          top: 12px;
          height: 3px;
          background: rgba(49, 95, 189, 0.12);
          border-radius: 4px;
          pointer-events: none;
        }

        .orders-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 0 14px 0;
          box-sizing: border-box;
        }
        .orders-back {
          position: absolute;
          left: 6px;
          top: 10px;
          background: transparent;
          border: none;
          padding: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        .orders-back svg { display: block; stroke: #1b2b3b; stroke-width: 2; }

        .orders-title {
          font-weight: 900;
          font-size: 18px;
          color: #071e2f;
          letter-spacing: 0.2px;
        }

        .product-panel-inner {
          display: flex;
          gap: 26px;
          align-items: flex-start;
          margin-top: 18px;
          box-sizing: border-box;
        }

        .pp-image-wrap {
          width: 58%;
          min-width: 260px;
        }

        .pp-image-card {
          background: #ffffff;
          padding: 18px;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(14,35,53,0.06);
          border: 1px solid rgba(11,43,74,0.04);
        }

        .pp-image-card img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          border-radius: 6px;
        }

        .pp-details {
          width: 42%;
          box-sizing: border-box;
          padding-top: 6px;
        }

        .pp-title {
          font-size: 20px;
          font-weight: 800;
          color: #0b2b4a;
          line-height: 1.15;
          margin: 6px 0 18px 0;
        }

        .pp-price {
          font-size: 44px;
          font-weight: 900;
          color: #0b2b4a;
          margin: 6px 0 18px 0;
        }

        .pp-sep {
          height: 1px;
          background: rgba(49,95,189,0.18);
          margin: 6px 0 14px 0;
        }

        .pp-desc-heading {
          font-weight: 800;
          color: #0b2b4a;
          margin-bottom: 8px;
        }

        .pp-desc {
          color: rgba(11,43,74,0.8);
          line-height: 1.6;
          font-size: 14px;
        }

        @media (max-width: 880px) {
          .product-panel {
            padding: 12px;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(11,43,74,0.04);
          }
          .product-panel::before { left: 12px; right: 12px; top: 10px; }

          .product-panel-inner { flex-direction: column; gap: 14px; }
          .pp-image-wrap { width: 100%; }
          .pp-details { width: 100%; padding-top: 6px; }
          .pp-title { font-size: 18px; }
          .pp-price { font-size: 36px; }
          .pp-image-card { padding: 10px; }
        }

        @media (min-width: 1400px) {
          .product-panel-inner { gap: 40px; }
          .pp-title { font-size: 24px; }
          .pp-price { font-size: 56px; }
        }
      `}</style>

      <div className="product-panel" role="region" aria-label="Product panel">
        <div className="orders-header" aria-hidden>
          <button
            className="orders-back"
            onClick={() => window.history.back()}
            aria-label="Back"
            title="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 6 L9 12 L15 18" stroke="#1b2b3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="orders-title">Orders</div>
        </div>

        <div className="product-panel-inner">
          <div className="pp-image-wrap">
            <div className="pp-image-card">
              {firstImage ? (
                <img src={firstImage} alt={title} />
              ) : (
                <div style={{ width: "100%", height: 360, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
                  No image available
                </div>
              )}
            </div>
          </div>

          <div className="pp-details">
            <div className="pp-title">{title}</div>

            <div className="pp-sep" />

            <div className="pp-price">{price ? price : ""}</div>

            <div className="pp-sep" />

            <div style={{ marginTop: 6 }}>
              <div className="pp-desc-heading">Description</div>
              <div className="pp-desc">{description || "No description provided."}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);
  const navigationRef = useRef(null);
  const prevLocationRef = useRef(location.pathname);
  const isNavigatingRef = useRef(false);
  const backNavigationTimeoutRef = useRef(null);

  const noHamburgerRoutes = ["/login", "/register"];
  const disableMenu = noHamburgerRoutes.includes(location.pathname);

  const performDelayedNavigation = (callback) => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    setShowToast(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      if (callback && typeof callback === 'function') {
        callback();
      }
      isNavigatingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    function handleAnchorClick(e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = e.target.closest && e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (!href.startsWith("/")) return;

      const newPath = href.split("?")[0].split("#")[0];
      if (newPath === prevLocationRef.current) return;

      e.preventDefault();

      navigationRef.current = {
        href: newPath,
        isProduct: /^\/(product|shoes|apparel|accessories|electronics|jewelry|furniture|commodities|watches)\/(\d+)/.test(newPath),
        productAnchor: anchor,
      };

      performDelayedNavigation(() => {
        if (navigationRef.current.isProduct) {
          const captured = extractProductFromAnchor(navigationRef.current.productAnchor);
          const pathname = navigationRef.current.href;

          if (captured) {
            try {
              sessionStorage.setItem("product_preview:" + pathname, JSON.stringify(captured));
              sessionStorage.setItem("product_preview:last", JSON.stringify({ pathname, product: captured }));
            } catch (err) {
              // ignore
            }
            prevLocationRef.current = pathname;
            navigate(pathname, { state: { product: captured } });
          } else {
            prevLocationRef.current = pathname;
            navigate(pathname);
          }
        } else {
          prevLocationRef.current = navigationRef.current.href;
          navigate(navigationRef.current.href);
        }

        navigationRef.current = null;
      });
    }

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [navigate]);

  useEffect(() => {
    function handlePopState() {
      const newPath = window.location.pathname;
      
      if (newPath !== prevLocationRef.current && !isNavigatingRef.current) {
        isNavigatingRef.current = true;
        setShowToast(true);

        if (backNavigationTimeoutRef.current) {
          clearTimeout(backNavigationTimeoutRef.current);
        }

        backNavigationTimeoutRef.current = setTimeout(() => {
          setShowToast(false);
          prevLocationRef.current = newPath;
          isNavigatingRef.current = false;
        }, 1000);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (e) {}
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      if (backNavigationTimeoutRef.current) {
        clearTimeout(backNavigationTimeoutRef.current);
      }
    };
  }, []);

  const productId = parseProductIdFromPath(location.pathname);

  let productToRender = null;
  if (productId) {
    const stateProduct = (location && location.state && location.state.product) || null;
    if (stateProduct) {
      productToRender = stateProduct;
    } else {
      const key = "product_preview:" + location.pathname.split("?")[0].split("#")[0];
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) {
          productToRender = JSON.parse(raw);
        } else {
          const lastRaw = sessionStorage.getItem("product_preview:last");
          if (lastRaw) {
            const parsed = JSON.parse(lastRaw);
            if (parsed && parsed.pathname === location.pathname.split("?")[0].split("#")[0]) {
              productToRender = parsed.product;
            }
          }
        }
      } catch (e) {
        // ignore parse errors
      }

      if (!productToRender) {
        productToRender = buildFallbackProductForId(productId);
      }
    }
  }

  return (
    <div className="layout-container" style={{ background: "linear-gradient(180deg,#f7f5ec 0%,#ffffff 100%)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header disableMenu={disableMenu} onMenuClick={() => setSidebarOpen(true)} />

      {!productId && (
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <div
            style={{
              width: "100%",
              padding: "6px 0",
              background: "linear-gradient(180deg,#071e2f 0%,#0b2b4a 100%)",
              marginTop: 8,
              marginBottom: 8,
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}>
              <button
                onClick={() => {
                  performDelayedNavigation(() => {
                    navigate(-1);
                  });
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  opacity: 0.95,
                  fontSize: 12,
                  cursor: "pointer",
                  padding: "3px 8px",
                  lineHeight: "1",
                  height: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Return Previous Page"
              >
                Return Previous Page &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {!disableMenu && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <main className="layout-content" style={{ flex: 1 }}>
        {productId ? <ProductPage product={productToRender} /> : <Outlet />}
      </main>

      <Footer />

      <GlobalNavigationToast show={showToast} />
    </div>
  );
}