import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Watches.png";

/* Helper: build a friendly name from the Cloudinary filename */
function friendlyNameFromUrl(url) {
  try {
    const parts = url.split("/");
    let name = parts[parts.length - 1] || url;
    // remove extension
    name = name.replace(/\.[a-zA-Z0-9]+$/, "");
    // remove trailing numeric groups like _93_53 or _142_99 etc.
    name = name.replace(/(_\d+){1,3}$/, "");
    // replace underscores and multiple spaces with single space
    name = name.replace(/[_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (name.length > 60) return name.slice(0, 57) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* All Watches product URLs provided by you */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300794/products/Urushi_Maki-e_Watch_Iznik-Style_Arabesque_We_are_an_estab_Urushi_Maki-e_Watch_Iznik-Style_Arabesque_5115.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300792/products/YUINK_Mens_Watch_Ultra-Thin_Digital_Sports_Watch_Waterproof_YUINK_Mens_Watch_Ultra-Thin_Digital_Sports_Watch_Waterproof_23_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300791/products/Ulysse_Nardin_Marine_Chronometer_Automatic_Men_s_Watch_The_U_Ulysse_Nardin_Marine_Chronometer_Automatic_Men_s_Watch_8763_88.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300790/products/Tommy_Hilfiger_Men_s_Quartz_Stainless_Steel_and_Leather_Stra_Tommy_Hilfiger_Men_s_Quartz_Stainless_Steel_and_Leather_Stra_115_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300789/products/Tissot_mens_Tissot_PRS_516_Chronograph_316L_stainless_steel_Tissot_mens_Tissot_PRS_516_Chronograph_316L_stainless_steel_280_42.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300787/products/Tissot_Men_s_Chronograph_Automatic_Watch_with_Stainless_Stee_Tissot_Men_s_Chronograph_Automatic_Watch_with_Stainless_Stee_1780.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300785/products/Timex_Men_s_Easy_Reader_Watch_Adjustable_black_18_millimeter_Timex_Men_s_Easy_Reader_Watch_37_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300784/products/Timex_Expedition_Rugged_Metal_Watch_It_s_all_about_the_eleme_Timex_Expedition_Rugged_Metal_Watch_55_3.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300783/products/Tag_Heuer_Formula_1_Blue_Dial_Men_s_Watch_WAZ1010_BA0842_Blu_Blue_dial_Silver-tone_stainless_steel_case_with_a_silver-to_Tag_Heuer_Formula_1_Blue_Dial_Men_s_Watch_WAZ1010_BA0842.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300782/products/TRDYBSK_Strap_Case_For_Apple_Watch_Band_45mm_44mm_Metal_stai_TRDYBSK_Strap_Case_For_Apple_Watch_Band_45mm_44mm_Metal_stai_4184_37.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300783/products/Tag_Heuer_Formula_1_Blue_Dial_Men_s_Watch_WAZ1010_BA0842_Blu_Blue_dial_Silver-tone_stainless_steel_case_with_a_silver-to_Tag_Heuer_Formula_1_Blue_Dial_Men_s_Watch_WAZ1010_BA0842.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300782/products/TRDYBSK_Strap_Case_For_Apple_Watch_Band_45mm_44mm_Metal_stai_TRDYBSK_Strap_Case_For_Apple_Watch_Band_45mm_44mm_Metal_stai_4184_37.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300780/products/TRDYBSK_Luxury_Transparent_Case_Modification_Kit_for_Apple_W_TRDYBSK_Luxury_Transparent_Case_Modification_Kit_for_Apple_W_4192_84.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300779/products/TAG_Heuer_Men_s_Carrera_Automatic_Watch_-_Diameter_41_mm_WBN_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-tTAG_Heuer_Men_s_Carrera_Automatic_Watch_-_Diameter_41_mm_WBN.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300778/products/TAG_Heuer_Carrera_Automatic_Watch_-_Diameter_39_mm_Blue_dial_TAG_Heuer_Carrera_Automatic_Watch_-_Diameter_39_mm_2880.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300777/products/TAG_Heuer_Carrera_Automatic_Blue_Dial_Men_s_Watch_IntroducinTAG_Heuer_Carrera_Automatic_Blue_Dial_Men_s_Watch_2750.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300775/products/TAG_Heuer_Aquaracer_Quartz_Black_Dial_Men_s_Watch_Black_dial_TAG_Heuer_Aquaracer_Quartz_Black_Dial_Men_s_Watch_2684.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300774/products/TAG_Heuer_Aquaracer_Professional_300_Automatic_Watch_-_DiameTAG_Heuer_Aquaracer_Professional_300_Automatic_Watch_-_Diame_2805.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300773/products/TAG_Heuer_Aquaracer_Automatic_Blue_Dial_Men_s_Watch_WBP2010_The_TAG_Heuer_Aquaracer_Professional_300_GMT_Automatic_StainTAG_Heuer_Aquaracer_Automatic_Blue_Dial_Men_s_Watch_WBP2010.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300771/products/Stuhrling_Original_Dive_Watch_This_Stuhrling_Original_Men_s_Stuhrling_Original_Dive_Watch_54_98.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300770/products/Seiko_LX_Limited_Edition_Divers_Watch_Seiko_LX_Limited_Editi_Seiko_LX_Limited_Edition_Divers_Watch_8500.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300768/products/Samsung_Electronics_Galaxy_Watch_4_Classic_46mm_Smartwatch_w_Samsung_Electronics_Galaxy_Watch_4_Classic_46mm_Smartwatch_w_69_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300767/products/SUNKTA_Smart_Watch_Men_s_voice_chat_smartwatch_This_Bluetoot_Men_s_voice_chat_smartwatch_This_Bluetooth_phone_calls_smart_49_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300765/products/SHENGKE_SK_Classic_Business_Women_s_Watches_About_usGuangdon_SHENGKE_SK_Classic_Business_Women_s_Watches_24_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300764/products/SAMSUNG_Galaxy_Watch_4_40mm_R860_Smartwatch_GPS_Bluetooth_Wi_SAMSUNG_Galaxy_Watch_4_40mm_R860_Smartwatch_GPS_Bluetooth_Wi_137.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300763/products/SAMSUNG_Galaxy_FIT_3_2024_1_6_AMOLED_Display_14_Days_Batt_The_Samsung_Galaxy_Fit_3_redefines_wearable_fitness_tech_wit_SAMSUNG_Galaxy_FIT_3_2024_1_6_AMOLED_Display_14_Days_Batt.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300762/products/Rolex_Submariner_Hulk_116610LV_stainless_steel_watch_40mm_20_Rolex_Submariner_Hulk_116610LV_stainless_steel_watch_40mm_20_26500.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300760/products/Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_Rolex_Oy_Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_8688.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300759/products/Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_16570_Br_Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_16570_9655.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300755/products/Rolex_New_Daytona_116505_Everose_Gold_Black_2019_BoxPaper5Yr_Rolex_New_Daytona_116505_Everose_Gold_Black_2019_BoxPaper5Yr_60000.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300754/products/Rolex_Lady-Datejust_26_179174_White_Dial_with_Diamonds_Jubil_Rolex_Lady-Datejust_26_179174_White_Dial_with_Diamonds_Jubil_8775.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300752/products/Rolex_Explorer_Black_Dial_Stainless_Steel_Rolex_Oyster_Autom_Rolex_Explorer_Black_Dial_Stainless_Steel_Rolex_Oyster_Autom_8545.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300751/products/Rolex_Air_King_Black_Dial_Stainless_Steel_Men_s_Watch_Black_Rolex_Air_King_Black_Dial_Stainless_Steel_Men_s_Watch_8695.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300750/products/Rado_True_Square_Automatic_Open_Heart_Mens_Watch_At_Rado_we_Rado_True_Square_Automatic_Open_Heart_Mens_Watch_2600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300749/products/Rado_Integral_Diamonds_Ladies_22_7mm_The_iconic_Integral_has_The_iconic_Integral_has_been_redesigned_to_suit_the_needs_an_Rado_Integral_Diamonds_Ladies_22_7mm.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300749/products/Rado_Integral_Diamonds_Ladies_22_7mm_The_iconic_Integral_has_The_iconic_Integral_has_been_redesigned_to_suit_the_needs_an_Rado_Integral_Diamonds_Ladies_22_7mm.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300748/products/Rado_Florence_Swiss_Quartz_Dress_Watch_with_Stainless_Steel_Rado_Florence_Swiss_Quartz_Dress_Watch_with_Stainless_Steel_1000.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300747/products/RAYMOND_WEIL_Maestro_Men_s_Automatic_Watch_Moon_Phase_Silv_Maestro_Moon_Phase_Experience_the_enchantment_of_the_maestro_RAYMOND_WEIL_Maestro_Men_s_Automatic_Watch_Moon_Phase_Silv.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300745/products/RAYMOND_WEIL_Freelancer_Men_s_Automatic_Watch_The_freelancer_RAYMOND_WEIL_Freelancer_Men_s_Automatic_Watch_3875.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300744/products/Omega_Women_s_White_Mother-Of-Pearl_Dial_Constellation_Watch_Omega_Women_s_White_Mother-Of-Pearl_Dial_Constellation_Watch_7515.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300743/products/Omega_Women_s_Constellation_Diamond_35mm_Luxury_Watch_Omega_Omega_Women_s_Constellation_Diamond_35mm_Luxury_Watch_8788.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300742/products/Omega_Speedmaster_Racing_Automatic_Chronograph_Men_s_Watch_B_Omega_Speedmaster_Racing_Automatic_Chronograph_Men_s_Watch_7605.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300741/products/Omega_Speedmaster_Moonwatch_304_33_44_52_03_001_Omega_Speedm_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Omega_Speedmaster_Moonwatch_304_33_44_52_03_001.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300740/products/Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001_B_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300739/products/Omega_Seamaster_Sedna_Blue_Dial_Steel_and_18kt_Yellow_Gold_W_Omega_Seamaster_Sedna_Blue_Dial_Steel_and_18kt_Yellow_Gold_W_8978.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300737/products/Omega_Seamaster_Planet_Ocean_Titanium_600M_Chronograph_Autom_Brand_Seller_or_Collection_Name_Omega_Clasp_Deployment_Cla_Omega_Seamaster_Planet_Ocean_Titanium_600M_Chronograph_Autom.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300736/products/Omega_Seamaster_Planet_Ocean_Black_dial_Black_ceramic_case_Omega_Seamaster_Planet_Ocean_8899.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300735/products/Omega_Seamaster_Planet_Ocean_Black_Dial_Coke_Bezel_Men_s_Wat_Black_Zirconium_Oxide_dial_Black_ceramic_case_with_a_black_Omega_Seamaster_Planet_Ocean_Black_Dial_Coke_Bezel_Men_s_Wat.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300734/products/Omega_Seamaster_Planet_Ocean_Automatic_Men_s_Watch_215_30_44_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Seamaster_Planet_Ocean_Automatic_Men_s_Watch_215_30_44.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300729/products/Omega_Seamaster_Diver_Chronometer_42mm_Mens_Special_Edition_Omega_Seamaster_Diver_Chronometer_42mm_Mens_Special_Edition_8874_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300724/products/Omega_Seamaster_Aqua_Terra_Chronometer_Mens_Watch_220_10_41_Grey_dial_Silver-tone_stainless_steel_case_with_a_silver-to_Omega_Seamaster_Aqua_Terra_Chronometer_Mens_Watch_220_10_41.jpg",
];

/* Shuffle the URLs at runtime so pages don't show grouped identical products */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Build product objects with name and a short description (keeps previous logic) */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const desc = (() => {
      const lower = name.toLowerCase();
      if (
        lower.includes("watch") ||
        lower.includes("omega") ||
        lower.includes("tag") ||
        lower.includes("rolex") ||
        lower.includes("tissot") ||
        lower.includes("timex")
      ) {
        return "High quality watch with excellent craftsmanship and design.";
      }
      return "High quality product with excellent comfort and design.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Watches() {
  // Shuffle once on component mount (keeps behavior same as other category pages)
  const shuffledUrls = useMemo(() => shuffleArray(productUrls), []);
  const products = useMemo(() => productsFromUrls(shuffledUrls), [shuffledUrls]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // exactly 8 products per page (4 up-down left, 4 up-down right)
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage, products]);

  // split into two vertical columns: left (items 0-3) and right (items 4-7)
  const leftColumn = pageProducts.slice(0, 4);
  const rightColumn = pageProducts.slice(4, 8);

  const goTo = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const maxButtons = 7;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="shoes-bg">
      <style>{`
        /* Navy strip behind the product grid */
        .shoes-grid-outer {
          background: #08223a;
          padding: 18px 10px;
        }

        /* Two-column grid: keep two columns always while allowing min widths */
        .two-column-vertical {
          display: grid;
          grid-template-columns: repeat(2, minmax(180px, 1fr));
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 520px) {
          .two-column-vertical {
            grid-template-columns: repeat(2, minmax(140px, 1fr));
            padding: 0 12px;
            overflow-x: auto;
          }
        }

        .column-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /*
          FIXED CARD HEIGHT:
          - Guarantee each card uses the same fixed height so long images or long titles
            do not stretch their row or adjacent cards.
        */
        .shoe-card-frame {
          border: 8px solid #071e2f;
          box-sizing: border-box;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          text-decoration: none;
          height: 360px;
          min-height: 360px;
          max-height: 360px;
        }

        /* Info area fixed so text cannot push the image area taller */
        .shoe-info {
          padding: 14px;
          background: #fff;
          flex: 0 0 92px; /* fixed info height */
          box-sizing: border-box;
        }

        .shoe-image-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          min-height: 0; /* ensures flexbox can shrink properly */
          padding: 6px;
        }
        .shoe-image-wrap img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .shoe-name {
          font-size: 18px;
          font-weight: 700;
          color: #0b2b4a;
          margin: 0;
          line-height: 1.15;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shoe-desc {
          margin-top: 8px;
          margin-bottom: 0;
          color: #6b6f76;
          font-size: 13px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Pagination: constrain to same max width as grid so it never overflows the page */
        .pagination-wrap {
          display: flex;
          justify-content: center;
          padding: 22px 12px 44px;
          box-sizing: border-box;
        }

        /* Keep the inner pagination content constrained and horizontally scrollable on very small viewports */
        .pagination-inner {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          max-width: 1200px; /* same as grid */
          width: 100%;
          margin: 0 auto;
          overflow-x: auto; /* allow scrolling when many page buttons exist */
          -webkit-overflow-scrolling: touch;
          padding: 6px;
          box-sizing: border-box;
        }

        .pagination-inner::-webkit-scrollbar { height: 8px; } /* small scrollbar if visible */
        .pagination-inner button {
          flex: 0 0 auto;
          margin: 0;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #d6d6d6;
          background: #fff;
          cursor: pointer;
          font-weight: 700;
          color: #111;
        }
        .pagination-inner button.active {
          background: #1e90ff;
          color: #fff;
          border-color: #1e90ff;
        }

        @media (max-width: 520px) {
          .shoe-card-frame { border-width: 4px; height: 320px; min-height: 320px; max-height: 320px; }
          .shoe-info { flex: 0 0 88px; }
          .shoe-name { font-size: 15px; }
          .shoe-desc { font-size: 12px; }
        }
      `}</style>

      <main className="shoes-main">
        {/* Hero Section: background now uses the imported Watches.png asset (bundler-resolved) */}
        <section
          className="shoes-hero"
          style={{
            backgroundImage: `url(${ShoesHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "320px"
          }}
        >
          <div className="shoes-hero-content" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="shoes-category">Watches</h2>
            <h1 className="shoes-title">Explore Our Collection For Watches</h1>
            <p className="shoes-subtitle">
              Updated weekly with new flash sales from some of the world's best brands.
            </p>
          </div>
        </section>

        {/* Products found row */}
        <div style={{ maxWidth: "1200px", margin: "10px auto 6px", padding: "0 12px", color: "#071e3d", fontWeight: 700 }}>
          {total} products found.
        </div>

        {/* Navy background strip with two vertical columns */}
        <div className="shoes-grid-outer" aria-hidden="false">
          <div className="two-column-vertical">
            {/* Left column: top-to-bottom (4 items) */}
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/watches/${p.id}`}
                  className="shoe-card-frame"
                  role="listitem"
                  title={`${p.name} — ${p.desc}`}
                >
                  <div className="shoe-image-wrap">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="shoe-info">
                    <h3 className="shoe-name">{p.name}</h3>
                    <p className="shoe-desc">{p.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Right column: top-to-bottom (4 items) */}
            <div className="column-stack" role="list">
              {rightColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/watches/${p.id}`}
                  className="shoe-card-frame"
                  role="listitem"
                  title={`${p.name} — ${p.desc}`}
                >
                  <div className="shoe-image-wrap">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="shoe-info">
                    <h3 className="shoe-name">{p.name}</h3>
                    <p className="shoe-desc">{p.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination: arrows + page numbers inside a constrained, scrollable inner container */}
        <div className="pagination-wrap" aria-label="Pagination">
          <div className="pagination-inner" role="navigation" aria-label="Page navigation">
            <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
              {"<"}
            </button>

            {pageNumbers[0] > 1 && (
              <>
                <button onClick={() => goTo(1)}>1</button>
                {pageNumbers[0] > 2 && <button aria-hidden="true">…</button>}
              </>
            )}

            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => goTo(n)}
                className={n === currentPage ? "active" : ""}
                aria-current={n === currentPage ? "page" : undefined}
              >
                {n}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <button aria-hidden="true">…</button>}
                <button onClick={() => goTo(totalPages)}>{totalPages}</button>
              </>
            )}

            <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
              {">"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
