import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomerServiceModal from "./CustomerServiceModal.jsx";

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
  // Try common currency patterns like £110 or $120 or 110.00
  const currencyMatch = text.match(/(£|\$|€)\s*([0-9]+(?:[.,][0-9]{2})?)/);
  if (currencyMatch) return `${currencyMatch[1]}${currencyMatch[2].replace(",", ".")}`;
  // fallback: any 2-5 digit number as price
  const numMatch = text.match(/([0-9]{2,5}(?:\.[0-9]{1,2})?)/);
  if (numMatch) return `£${numMatch[0]}`;
  return "";
}

/* derive price from filename numbers as last resort
   Updated behavior:
   - Extract only the trailing numeric group from the filename (the last digits portion before the extension).
   - Treat underscores inside that trailing group as the decimal separator location.
     e.g. "578_16" => "578.16", "258_5" => "258.5", "1225" => "1225"
   - Always return a currency-prefixed string (e.g. "£578.16") or empty string when not found.
*/
function heuristicPriceFromUrl(url) {
  if (!url) return "";
  try {
    // get filename (last segment) and strip any query params
    const lastSegment = (url.split("/").pop() || "").split("?")[0];
    // remove extension
    const filename = lastSegment.replace(/\.[^/.]+$/, "");
    // match trailing digits and underscores (one or more digits possibly separated by underscores) at the end
    const m = filename.match(/(\d+(?:_\d+)*)$/);
    if (!m) return "";
    const digitsGroup = m[1]; // e.g. "578_16" or "2310"
    // split on underscores; first part is integer, rest are decimals; join decimals together
    const parts = digitsGroup.split("_");
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts.slice(1).join("") : "";
    const price = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    // Normalize to avoid leading zeros or malformed numbers - but keep as string
    return `£${price}`;
  } catch (e) {
    return "";
  }
}

/* Extract product info from the clicked anchor's DOM */
function extractProductFromAnchor(anchor) {
  if (!anchor) return null;

  // image
  const imgEl = anchor.querySelector("img");
  const img = imgEl ? (imgEl.src || imgEl.getAttribute("data-src") || "") : "";

  // title/name
  const titleEl =
    anchor.querySelector(".shoe-name") ||
    anchor.querySelector(".product-title") ||
    anchor.querySelector("h3") ||
    anchor.querySelector("h2") ||
    anchor.querySelector("[data-product-name]");
  const name = titleEl ? (titleEl.innerText || titleEl.textContent || "").trim() : "";

  // description
  const descEl =
    anchor.querySelector(".shoe-desc") ||
    anchor.querySelector(".product-desc") ||
    anchor.querySelector(".description") ||
    anchor.querySelector("[data-product-desc]");
  const description = descEl ? (descEl.innerText || descEl.textContent || "").trim() : "";

  // price: try multiple selectors and then search anchor text
  const priceEl =
    anchor.querySelector(".price") ||
    anchor.querySelector("[data-product-price]") ||
    anchor.querySelector(".product-price") ||
    anchor.querySelector(".shoe-price");
  let price = priceEl ? (priceEl.innerText || priceEl.textContent || "").trim() : "";
  if (!price) {
    // try to find currency in the anchor text
    price = extractPriceFromText(anchor.innerText || anchor.textContent || "");
  }

  // Primary preference: if the image URL contains trailing digits, use those as the price.
  // This ensures we always fetch the last digits in the filename as the product price
  // (treating underscores inside that trailing group as decimal separators).
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

/* ProductPage component: full-page view titled "Orders" with back arrow header */
function ProductPage({ product }) {
  const title = product?.name ?? "Product";
  const images = product?.images ?? [];
  const firstImage = images.length ? images[0] : "";
  const description = product?.description ?? "";
  const price = product?.price ?? "";

  // Ensure page shows top when product page opens (also handled globally)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (e) {}
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "18px auto 40px", padding: "0 16px" }}>
      {/* Inline inner wrapper so the separating line width exactly matches the image card width */}
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* Orders header - inline with the page (no separate rounded card) */}
        <div
          style={{
            width: "100%",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "10px 0",
            boxSizing: "border-box",
          }}
        >
          {/* Return button as a chevron icon (small, like the screenshot) */}
          <button
            onClick={() => window.history.back()}
            aria-label="Back"
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              padding: 8,
              cursor: "pointer",
            }}
          >
            {/* thin left chevron svg */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M14 6 L8 12 L14 18" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>Orders</div>
        </div>

        {/* separating tiny line - same width as the image card (matches wrapper width) */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div
            style={{
              width: "100%",
              height: 3,
              background: "#0b425e",
              borderRadius: 2,
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)",
            }}
          />
        </div>

        {/* white image card */}
        <div style={{ background: "#fff", borderRadius: 6, padding: 18 }}>
          {firstImage ? (
            <img
              src={firstImage}
              alt={title}
              style={{ width: "100%", maxHeight: 520, objectFit: "contain", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: 420, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
              No image available
            </div>
          )}
        </div>

        {/* details section */}
        <div style={{ marginTop: 12, padding: "12px 0 0 0" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginBottom: 10 }}>{title}</div>

          <div style={{ height: 8, borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }} />

          <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>
            {price ? price : ""}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "12px 0" }} />

          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8 }}>Description</div>
          <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            {description || "No description provided."}
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
  const [csOpen, setCsOpen] = useState(false);

  // disable hamburger on auth pages
  const noHamburgerRoutes = ["/login", "/register"];
  const disableMenu = noHamburgerRoutes.includes(location.pathname);

  /* Global: ensure top of page is visible on navigation (applies to all pages) */
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (e) {}
  }, [location.pathname]);

  /* Listen for global "openCustomerService" events so the CustomerServiceModal can be shown as an overlay
     without navigating away from the current page. */
  useEffect(() => {
    function onOpenCs() {
      setCsOpen(true);
    }
    window.addEventListener("openCustomerService", onOpenCs);
    return () => window.removeEventListener("openCustomerService", onOpenCs);
  }, []);

  /* Intercept internal product anchor clicks, capture product data from DOM,
     then navigate via react-router passing the product in location.state and
     storing it in sessionStorage keyed by the exact pathname for fallback. */
  useEffect(() => {
    function onDocClick(e) {
      // ignore non-left clicks and modified clicks
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = e.target.closest && e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // only internal links
      if (!href.startsWith("/")) return;

      // product link pattern check
      const match = href.match(
        /^\/(product|shoes|apparel|accessories|electronics|jewelry|furniture|commodities|watches)\/(\d+)(?:[\/?#].*)?$/
      );
      if (!match) return;

      // intercept
      e.preventDefault();
      const pathname = href.split("?")[0].split("#")[0];

      // attempt to capture product data
      const captured = extractProductFromAnchor(anchor);

      // store to sessionStorage for direct loads/refreshes
      if (captured) {
        try {
          sessionStorage.setItem("product_preview:" + pathname, JSON.stringify(captured));
          sessionStorage.setItem("product_preview:last", JSON.stringify({ pathname, product: captured }));
        } catch (err) {
          // ignore
        }
      }

      // navigate with state if captured
      try {
        if (captured) {
          navigate(pathname, { state: { product: captured } });
        } else {
          navigate(pathname);
        }
      } catch (navErr) {
        window.location.href = pathname;
      }
    }

    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [navigate]);

  // product detection
  const productId = parseProductIdFromPath(location.pathname);

  // determine product to render (priority: location.state.product -> sessionStorage by pathname -> last matching preview -> fallback by id)
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
    <div className="layout-container" style={{ background: "linear-gradient(180deg,#071e2f 0%,#0b2b4a 100%)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Global Header */}
      <Header disableMenu={disableMenu} onMenuClick={() => setSidebarOpen(true)} />

      {/* Global Return strip: hide when showing product page (we show product's own Orders header instead) */}
      {!productId && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", boxSizing: "border-box" }}>
          <div style={{ maxWidth: 1100, width: "100%", padding: "8px 16px", background: "linear-gradient(180deg,#071e2f 0%,#0b2b4a 100%)", borderRadius: 0, marginTop: 8, marginBottom: 8, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "#ffffff", opacity: 0.95, fontSize: 14, cursor: "pointer", padding: "6px 10px" }} aria-label="Return Home Page">
                Return Home Page &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!disableMenu && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      {/* Main: render ProductPage when product path, otherwise Outlet */}
      <main className="layout-content" style={{ flex: 1 }}>
        {productId ? <ProductPage product={productToRender} /> : <Outlet />}
      </main>

      {/* CustomerServiceModal mounted at Layout level so it overlays the current page (prevents navigating to a separate /customer-service page).
          The modal opens when Footer dispatches the "openCustomerService" event or when the modal's open state is set here.
      */}
      <CustomerServiceModal open={csOpen} onClose={() => setCsOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
