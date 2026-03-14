import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Furniture.png";

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
    if (name.length > 70) return name.slice(0, 67) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* Furniture product URLs provided by you */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117478/products/Luxury_swivel_medical_new_design_spa_massage_table_grey_3_cl_Luxury_swivel_medical_new_design_spa_massage_table_grey_3_cl_660.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094666/products/Factory_Selling_Green_Living_Room_Sofas_Fabric_Luxury_Modern_Factory_Selling_Green_Living_Room_Sofas_Fabric_Luxury_Modern_900.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090153/products/126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_258_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119696/products/Retro_Barber_Shop_Hair_Salon_Table_Makeup_Single_Side_Frame_Retro_Barber_Shop_Hair_Salon_Table_Makeup_Single_Side_Frame_376_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096689/products/Hot_sale_home_furniture_saving_space_wood_wall_beds_murphy_b_Hot_sale_home_furniture_saving_space_wood_wall_beds_murphy_b_859_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120175/products/Uland_Outdoor_Party_Tables_And_Chairs_Coffee_Table_Set_Squar_Uland_Outdoor_Party_Tables_And_Chairs_Coffee_Table_Set_Squar_272_66.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118345/products/Mother_and_Child_Nordic_Modern_Simple_Children_Bunk_Bed_for_Mother_and_Child_Nordic_Modern_Simple_Children_Bunk_Bed_for_1225.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092796/products/Best_price_Medical_use_surgical_manual_ot_table_304_Stainles_Best_price_Medical_use_surgical_manual_ot_table_304_Stainles_598.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118208/products/Modern_studio_hotel_living_room_search_gold_white_decoration_Modern_studio_hotel_living_room_search_gold_white_decoration_216.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094360/products/Dubai_classic_fabric_sofa_sets_italian_living_room_furniture_Dubai_classic_fabric_sofa_sets_italian_living_room_furniture_2310.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118124/products/Modern_Couches_Genuine_Leather_Cheap_Sofas_Living_Room_Sofa_Modern_Couches_Genuine_Leather_Cheap_Sofas_Living_Room_Sofa_578_16.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094661/products/Factory_Sale_Leisure_Stackable_Wpc_Picnic_Table_Outdoor_Coff_Factory_Sale_Leisure_Stackable_Wpc_Picnic_Table_Outdoor_Coff_523_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117229/products/Living_Room_Modern_Furniture_Designs_Leather_L_Shape_Section_Living_Room_Modern_Furniture_Designs_Leather_L_Shape_Section_550.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097105/products/Italy_modern_leather_u_l_shape_sectional_sofa_set_with_wood_Italy_modern_leather_u_l_shape_sectional_sofa_set_with_wood_3168.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119842/products/Sofa_Set_Furniture_Modern_Leather_Living_Room_Sofas_Sofa_Set_Sofa_Set_Furniture_Modern_Leather_Living_Room_Sofas_546_48.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092490/products/Baby_changing_station_baby_changing_table_diaper_station_Hor_Baby_changing_station_baby_changing_table_diaper_station_Hor_144.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091104/products/2022_hot_sale_Modern_living_room_free_combination_sectional_2022_hot_sale_Modern_living_room_free_combination_sectional_778_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121285/products/modern_european_solid_wood_bed_Fashion_Carved_french_bedroom_modern_european_solid_wood_bed_Fashion_Carved_french_bedroom_352.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096532/products/Hospital_Furniture_Multi-function_Stainless_Steel_Medicine_S_Hospital_Furniture_Multi-function_Stainless_Steel_Medicine_S_520.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121207/products/luxury_sofa_Hot_sell_home_household_modern_sectional_sofa_fa_luxury_sofa_Hot_sell_home_household_modern_sectional_sofa_fa_1626_3.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094289/products/Doorwin_Factory_Directly_Supply_Australia_stand_solid_wood_w_Doorwin_Factory_Directly_Supply_Australia_stand_solid_wood_w_195_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118918/products/Nordic_elegant_new_desk_lamp_K9_crystal_living_room_beside_t_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_170_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118146/products/Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_4045_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093212/products/Cheap_Wholesale_Modern_Storage_Stretch_Sofa_Bed_Home_Furnitu_Cheap_Wholesale_Modern_Storage_Stretch_Sofa_Bed_Home_Furnitu_390.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118645/products/Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121190/products/luxurious_home_office_desk_Modern_design_computer_desks_gami_luxurious_home_office_desk_Modern_design_computer_desks_gami_462_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097251/products/LED_Custom_Wholesale_Portable_Desktop_Cosmetic_Smart_Table_M_LED_Custom_Wholesale_Portable_Desktop_Cosmetic_Smart_Table_M_174_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095266/products/Foshan_factory_EUROPEAN_antique_style_living_room_sofas_top_Foshan_factory_EUROPEAN_antique_style_living_room_sofas_top_1735.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094754/products/Factory_Wholesale_Smart_Office_Table_Electric_Desk_Standing_Factory_Wholesale_Smart_Office_Table_Electric_Desk_Standing_435_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096476/products/Home_Furniture_Factory_Price_tv_stand_living_room_furniture_Home_Furniture_Factory_Price_tv_stand_living_room_furniture_434_89.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092490/products/Baby_changing_station_baby_changing_table_diaper_station_Hor_Baby_changing_station_baby_changing_table_diaper_station_Hor_144.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119582/products/Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_1100.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096690/products/Hot_sale_home_furniture_saving_space_wood_wall_beds.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120491/products/Wholesale_Living_Room_Furniture_L_Type_Of_Sofa_Sets_Wholesal_Wholesale_Living_Room_Furniture_L_Type_Of_Sofa_Sets_308.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092100/products/American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119813/products/Slate_coffee_table_TV_cabinet_combination_light_luxury_moder_Slate_coffee_table_TV_cabinet_combination_light_luxury_moder_614_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120620/products/Wholesale_hot_sale_multi-function_smart_furniture_home_fabri_Wholesale_hot_sale_multi-function_smart_furniture_home_fabri_605.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095251/products/Foshan_Realgres_Simple_Design_Modular_Living_Room_Sofa_Moder_Foshan_Realgres_Simple_Design_Modular_Living_Room_Sofa_Moder_2874_15.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118910/products/Nordic_Style_Fabric_Sofa_Modern_Living_Room_L-shape_Sofa_Tec_Nordic_Style_Fabric_Sofa_Modern_Living_Room_L-shape_Sofa_Tec_760_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118133/products/Modern_Divan_Live_Leather_Sofa_Set_Home_Furniture_Living_Roo_Modern_Divan_Live_Leather_Sofa_Set_Home_Furniture_Living_Roo_940_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118146/products/Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_4045_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094666/products/Factory_Selling_Green_Living_Room_Sofas_Fabric_Luxury_Modern_Factory_Selling_Green_Living_Room_Sofas_Fabric_Luxury_Modern_900.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090153/products/126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_258_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118195/products/Modern_leather_sectional_sofa_living_room_furniture_sofa_set_Modern_leather_sectional_sofa_living_room_furniture_sofa_set_799_24.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119582/products/Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_1100.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093570/products/Creative_Leisure_Armrest_Single_Sofa_Chair_Furniture_Comfort_Creative_Leisure_Armrest_Single_Sofa_Chair_Furniture_Comfort_368_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094095/products/DG_Luxury_house_furniture_modern_divanI_genuine_leather_fami_DG_Luxury_house_furniture_modern_divanI_genuine_leather_fami_2500.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092100/products/American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092093/products/Amazon_Hot_Selling_Wooden_baby_high_chair_multi-functional_c_Amazon_Hot_Selling_Wooden_baby_high_chair_multi-functional_c_121.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090426/products/2021_new_arrivals_Classic_European_style_Luxury_Home_Furnitu_2021_new_arrivals_Classic_European_style_Luxury_Home_Furnitu_1430.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095272/products/Foshan_furniture_market_classic_European_luxury_royal_king_s_Foshan_furniture_market_classic_European_luxury_royal_king_s_1174_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091910/products/A302_factory_offer_high_quality_antique_Italian_luxury_sofas_A302_factory_offer_high_quality_antique_Italian_luxury_sofas_500_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119813/products/Slate_coffee_table_TV_cabinet_combination_light_luxury_moder_Slate_coffee_table_TV_cabinet_combination_light_luxury_moder_614_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118416/products/NOVA_11NAA034_High_Gloss_White_Modern_Sleeping_Room_Wardrobe_NOVA_11NAA034_High_Gloss_White_Modern_Sleeping_Room_Wardrobe_270_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096487/products/Home_Furniture_Modern_Fabric_Sectional_Sofa_L_Shaped_Corner_Home_Furniture_Modern_Fabric_Sectional_Sofa_L_Shaped_Corner_2623_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118162/products/Modern_Leather_Living_Room_Sofa_Set_7_Seater_L_U_Shaped_Recl_Modern_Leather_Living_Room_Sofa_Set_7_Seater_L_U_Shaped_Recl_638.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090176/products/16_Pair_Shoe_Storage_Rack_Cabinet_Organizer_with_2_Flip_Draw_16_Pair_Shoe_Storage_Rack_Cabinet_Organizer_with_2_Flip_Draw_159_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118124/products/Modern_Couches_Genuine_Leather_Cheap_Sofas_Living_Room_Sofa_Modern_Couches_Genuine_Leather_Cheap_Sofas_Living_Room_Sofa_578_16.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118496/products/New_Arrivals_Luxury_Home_Furniture_Antique_Solid_Wood_Living_New_Arrivals_Luxury_Home_Furniture_Antique_Solid_Wood_Living_2113_98.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118185/products/Modern_design_smart_bed_with_dressing_table_multi_functional_Modern_design_smart_bed_with_dressing_table_multi_functional_855_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095290/products/Frameless_Stand_dressing_mirror_with_led_bulbs_amazon_prime_Frameless_Stand_dressing_mirror_with_led_bulbs_amazon_prime_188_74.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119582/products/Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_1100.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096689/products/Hot_sale_home_furniture_saving_space_wood_wall_beds_murphy_b_Hot_sale_home_furniture_saving_space_wood_wall_beds_murphy_b_859_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118970/products/OEM_Factory_green_and_gold_bed_velvet_fabric_modern_queen_si_OEM_Factory_green_and_gold_bed_velvet_fabric_modern_queen_si_328_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095313/products/French_fashion_high-end_bedroom_vintage_wood_royal_solid_woo_French_fashion_high-end_bedroom_vintage_wood_royal_solid_woo_1118.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121301/products/new_design_elegant_home_salon_furniture_sets_sofa_set_lounge_new_design_elegant_home_salon_furniture_sets_sofa_set_lounge_1297_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092096/products/American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_165.jpg"
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

/* Build product objects with name and a short description (furniture-focused) */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (lower.includes("sofa") || lower.includes("couch") || lower.includes("sectional") || lower.includes("divan")) {
        return "Comfortable sofas & sectionals — premium upholstery and lasting comfort.";
      }
      if (lower.includes("bed") || lower.includes("mattress") || lower.includes("loft") || lower.includes("bunk")) {
        return "Beds & bedroom furniture — solid construction and elegant designs.";
      }
      if (lower.includes("table") || lower.includes("coffee") || lower.includes("dining") || lower.includes("desk")) {
        return "Tables & desks — functional, stylish surfaces for every room.";
      }
      if (lower.includes("chair") || lower.includes("armrest") || lower.includes("stool") || lower.includes("high")) {
        return "Chairs & seating — ergonomics and style combined.";
      }
      if (lower.includes("lamp") || lower.includes("lighting") || lower.includes("bedside") || lower.includes("mirror")) {
        return "Lighting & decor — accent pieces to brighten your home.";
      }
      if (lower.includes("wardrobe") || lower.includes("dresser") || lower.includes("cabinet") || lower.includes("storage")) {
        return "Storage & wardrobes — keep your space organized with style.";
      }
      if (lower.includes("outdoor") || lower.includes("patio") || lower.includes("garden") || lower.includes("party")) {
        return "Outdoor & patio furniture — durable and weather-resistant.";
      }
      if (lower.includes("hospital") || lower.includes("medical") || lower.includes("surgical")) {
        return "Professional-grade medical furniture & equipment.";
      }
      return "Quality furniture and home decor — crafted for comfort and style.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Furniture() {
  // Shuffle once on component mount to keep behavior consistent with other pages
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
            <h2 className="shoes-category">Furniture</h2>
            <h1 className="shoes-title">Explore Our Collection For Furniture</h1>
            <p className="shoes-subtitle">
              Updated weekly with new arrivals and curated selections for your home.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "10px auto 6px", padding: "0 12px", color: "#071e3d", fontWeight: 700 }}>
          {total} products found.
        </div>

        <div className="shoes-grid-outer" aria-hidden="false">
          <div className="two-column-vertical">
            {/* Left column: top-to-bottom (4 items) */}
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/furniture/${p.id}`}
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
                  href={`/furniture/${p.id}`}
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
