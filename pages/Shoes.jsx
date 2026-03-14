import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Shoes.png";

/* Helper: build a friendly name from the Cloudinary filename */
function friendlyNameFromUrl(url) {
  try {
    const parts = url.split("/");
    let name = parts[parts.length - 1] || url;
    name = name.replace(/\.[a-zA-Z0-9]+$/, "");
    name = name.replace(/(_\d+){1,3}$/, "");
    name = name.replace(/[_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (name.length > 60) return name.slice(0, 57) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* All Cloudinary product URLs provided by the user (replaced as requested) */
const productUrls = [
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364958/products/With_Box_dunks_basketball_shoes_men_women_running_shoes_walk_With_Box_dunks_basketball_shoes_men_women_running_shoes_walk_71_5_zaqbf6.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772188534/retro_4s_shoes_Men_Women_Casual_Shoes_TOP_Og_University_Blue_retro_4s_shoes_Men_Women_Casual_Shoes_TOP_Og_University_Blue_57_95_gqwzmr.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772362158/2022_Rivet_Men_s_Shoes_High_Top_Leather_Sequin_Casual_Shoes_2022_Rivet_Men_s_Shoes_High_Top_Leather_Sequin_Casual_Shoes_48_4_e8eznl.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364672/products/Vikeduo_Hand_Made_Durable_Wearing_Coolest_Streetwear_Shoes_C_Vikeduo_Hand_Made_Durable_Wearing_Coolest_Streetwear_Shoes_C_309_54_f92xdw.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632297/products/2022_Trendy_Sports_Men_Golden_Shoe_High-top_Luxury_Men_Shoes_2022_Trendy_Sports_Men_Golden_Shoe_High-top_Luxury_Men_Shoes_42_78.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632297/products/2022_Trendy_Sports_Men_Golden_Shoe_High-top_Luxury_Men_Shoes_2022_Trendy_Sports_Men_Golden_Shoe_High-top_Luxury_Men_Shoes_42_78.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772190898/Hot_selling_crocodile_leather_pump_women_low_heel_shoes_purp_Hot_selling_crocodile_leather_pump_women_low_heel_shoes_purp_390_wmbfhp.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364522/Talos_Snowboarding_Waterproof_Shoes_custom_adult_outdoor_col_Talos_Snowboarding_Waterproof_Shoes_custom_adult_outdoor_col_189_13_npwucz.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191359/SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_S_SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_163_61_ksujcn.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191359/SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_S_SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_163_61_ksujcn.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772356227/Professional_full_carbon_fiber_customized_foot_type_shoes_le_Professional_full_carbon_fiber_customized_foot_type_shoes_le_325_qihrfp.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772192243/Luxury_Shoes_Women_Genuine_Crocodile_Leather_Pump_Women_High_Luxury_Shoes_Women_Genuine_Crocodile_Leather_Pump_Women_High_240_rvokof.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364864/products/Wholesale_High_Quality_women_Shoes_Original_Women_Sneakers_F_Wholesale_High_Quality_women_Shoes_Original_Women_Sneakers_F_340_tmibiy.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191412/ROCKROOSTER_Safety_Shoes_Men_Genuine_Leather_Ankle_Boots_Man_ROCKROOSTER_Safety_Shoes_Men_Genuine_Leather_Ankle_Boots_Man_110_g73epv.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364929/products/winter_ladies_office_boots_ladies-boots_long_designer_shoes_winter_ladies_office_boots_ladies-boots_long_designer_shoes_138_nlroyf.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364340/SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_S_SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_163_61_uok1fh.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364735/products/White_Shoes_Winter_Thick-soled_Heighten_Locomotive_Short_Boo_White_Shoes_Winter_Thick-soled_Heighten_Locomotive_Short_Boo_136_8_j74872.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364643/products/used_football_shoes_custom_high_quality_branded_original_foo_used_football_shoes_custom_high_quality_branded_original_foo_62_7_jjxlb5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191035/J-6_WATERPROOF_SHOES_2020_BLACK_MOTORCYCLE_MAN_J-6_WATERPRO_J-6_WATERPROOF_SHOES_2020_BLACK_MOTORCYCLE_MAN_172_13_ksqldu.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364861/products/Wholesale_high_quality_men_shoes_short_wholesale_boots_for_s_Wholesale_high_quality_men_shoes_short_wholesale_boots_for_s_231_wrcisw.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772192321/Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_207_n9uxsm.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772192321/Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_207_n9uxsm.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772362006/2022_Brand_New_Factory_Custom_Logo_Classic_Fashion_Shoes_Whi_2022_Brand_New_Factory_Custom_Logo_Classic_Fashion_Shoes_Whi_339_9_hodjtn.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772362066/2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_142_5_lhpam1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772362077/2022_New_Unisex_Air_Shoes_Fashion_Trend_Sneakers_Flat_Custom_2022_New_Unisex_Air_Shoes_Fashion_Trend_Sneakers_Flat_Custom_77_88_aolz1d.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191040/Japanese_bulk_trendy_shoes_custom_made_slippers_loafer_for_s_Japanese_bulk_trendy_shoes_custom_made_slippers_loafer_for_s_196_9_slbtel.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364589/products/Trendy_luxury_chunky_heel_office_shoes_women_heels_pump_croc_Trendy_luxury_chunky_heel_office_shoes_women_heels_pump_croc_422_5_owziqi.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772192232/Luxury_brand_Designer_boots_pink_green_women_shoes_croc_rain_Luxury_brand_Designer_boots_pink_green_women_shoes_croc_rain_49_4_e3ib6l.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632271/products/2022_Rivet_Men_s_Shoes_High_Top_Leather_Sequin_Casual_Shoes_2022_Rivet_Men_s_Shoes_High_Top_Leather_Sequin_Casual_Shoes_48_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635771/products/retro_4s_shoes_Men_Women_Casual_Shoes_TOP_Og_University_Blue_retro_4s_shoes_Men_Women_Casual_Shoes_TOP_Og_University_Blue_57_95.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634685/products/Low_Moq_Casual_Running_Shoes_Men_S_Casual_Shoes_Sneaker_Fuji_Low_Moq_Casual_Running_Shoes_Men_S_Casual_Shoes_Sneaker_Fuji_81_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772361874/318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_49_25_mvsoiv.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772361997/2021_wholesale_yeezy_450_dark_slate_black_green_shoes_fly_kn_2021_wholesale_yeezy_450_dark_slate_black_green_shoes_fly_kn_102_66_sl0sum.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772362014/2022_Fashion_Luxury_Brand_Shoes_Air_AFire_OG_Low_Top_Casual_2022_Fashion_Luxury_Brand_Shoes_Air_AFire_OG_Low_Top_Casual_187_5_bd2weu.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772355770/318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_49_25_kwtww3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364739/products/wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man_lc69ks.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634992/products/New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_72_15.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634992/products/New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_72_15.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635158/products/Premium_Quality_Handmade_Italian_Men_Double_Buckle_Shoes_Gen_Premium_Quality_Handmade_Italian_Men_Double_Buckle_Shoes_Gen_242.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635158/products/Premium_Quality_Handmade_Italian_Men_Double_Buckle_Shoes_Gen_Premium_Quality_Handmade_Italian_Men_Double_Buckle_Shoes_Gen_242.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635128/products/PGM_XZ204_stylish_golf_shoes_men_genuine_leather_waterproof_PGM_XZ204_stylish_golf_shoes_men_genuine_leather_waterproof_660.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634701/products/Luxury_Shoes_Women_Genuine_Crocodile_Leather_Pump_Women_High_Luxury_Shoes_Women_Genuine_Crocodile_Leather_Pump_Women_High_240.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634180/products/Figure_ice_skates_blackCarbon_Fiber_Quad_Roller_Skate_Shoes_Figure_ice_skates_blackCarbon_Fiber_Quad_Roller_Skate_Shoes_242.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635288/products/SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_S_SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_163_61.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635177/products/Professional_full_carbon_fiber_customized_foot_type_shoes_le_Professional_full_carbon_fiber_customized_foot_type_shoes_le_325.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634434/products/High_quality_OF_white_fashion_Sneakers_designer_Brand_shoes_High_quality_OF_white_fashion_Sneakers_designer_Brand_shoes_102.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635812/products/winter_ladies_office_boots_ladies-boots_long_designer_shoes_winter_ladies_office_boots_ladies-boots_long_designer_shoes_138.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Cie_A221_Customized_Fashion_Style_Black_Shoes_Handmade_Goody_Cie_A221_Customized_Fashion_Style_Black_Shoes_Handmade_Goody_198_75.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635800/products/used_football_shoes_custom_high_quality_branded_original_foo_used_football_shoes_custom_high_quality_branded_original_foo_62_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633920/products/Colorful_mixed_real_leather_shoes_girls_causal_fashion_sneak_Colorful_mixed_real_leather_shoes_girls_causal_fashion_sneak_503_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635131/products/PVC_transparent_Point_toe_High_heel_wedding_rhinestones_shoe_PVC_transparent_Point_toe_High_heel_wedding_rhinestones_shoe_144_83.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635457/products/Vikeduo_Hand_Made_Durable_Wearing_Coolest_Streetwear_Shoes_C_Vikeduo_Hand_Made_Durable_Wearing_Coolest_Streetwear_Shoes_C_309_54.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633930/products/Corefoot_Original_Men_Women_270_Breathable_Shoes_Summer_Air_Corefoot_Original_Men_Women_270_Breathable_Shoes_Summer_Air_43_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632218/products/2021_wholesale_yeezy_450_dark_slate_black_green_shoes_fly_kn_2021_wholesale_yeezy_450_dark_slate_black_green_shoes_fly_kn_102_66.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634791/products/Manufacture_Wholesale_price_big_3_wheel_speed_skate_shoes_ca_Manufacture_Wholesale_price_big_3_wheel_speed_skate_shoes_ca_250.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634791/products/Manufacture_Wholesale_price_big_3_wheel_speed_skate_shoes_ca_Manufacture_Wholesale_price_big_3_wheel_speed_skate_shoes_ca_250.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634712/products/Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_207.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634515/products/Hot_selling_crocodile_leather_pump_women_low_heel_shoes_purp_Hot_selling_crocodile_leather_pump_women_low_heel_shoes_purp_390.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633184/products/Best_Selling_Fashion_Leisure_Men_Shoes_Winter_Warm_Ankle_Sno_Best_Selling_Fashion_Leisure_Men_Shoes_Winter_Warm_Ankle_Sno_190_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632245/products/2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_142_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632245/products/2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_142_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634848/products/Mens_Cost_Sale_Fashion_Sport_Shoes_Custom_Sneakers_Couple_Sh_Mens_Cost_Sale_Fashion_Sport_Shoes_Custom_Sneakers_Couple_Sh_42_23.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632224/products/2022_Brand_New_Factory_Custom_Logo_Classic_Fashion_Shoes_Whi_2022_Brand_New_Factory_Custom_Logo_Classic_Fashion_Shoes_Whi_339_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635133/products/Paris_Sneakers_For_Luxury_Balanciaga_Triple_S_Shoes_Clear_So_Paris_Sneakers_For_Luxury_Balanciaga_Triple_S_Shoes_Clear_So_142_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633144/products/Banquet_Botas_2022_New_Fashion_Metallic_Shoes_Women_Mirror_L_Banquet_Botas_2022_New_Fashion_Metallic_Shoes_Women_Mirror_L_49_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632254/products/2022_New_Unisex_Air_Shoes_Fashion_Trend_Sneakers_Flat_Custom_2022_New_Unisex_Air_Shoes_Fashion_Trend_Sneakers_Flat_Custom_77_88.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633973/products/Customized_logo_nice_italian_style_crocodile_shoes_men_s_bus_Customized_logo_nice_italian_style_crocodile_shoes_men_s_bus_283_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634712/products/Luxury_brand_Designer_boots_pink_green_women_shoes_croc_rain_Luxury_brand_Designer_boots_pink_green_women_shoes_croc_rain_49_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Cie_A209_Fashion_Men_s_Handmade_Office_Formal_Leather_Shoes_Cie_A209_Fashion_Men_s_Handmade_Office_Formal_Leather_Shoes_174_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634002/products/Designer_brands_women_gg_shoes_1977_women_GG_tennis_sneakers_Designer_brands_women_gg_shoes_1977_women_GG_tennis_sneakers_49_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633930/products/Cow_Leather_Combat_Boots_Tactical_Shoes_Sale_Black_OEM_Color_Cow_Leather_Combat_Boots_Tactical_Shoes_Sale_Black_OEM_Color_152_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634611/products/Japanese_bulk_trendy_shoes_custom_made_slippers_loafer_for_s_Japanese_bulk_trendy_shoes_custom_made_slippers_loafer_for_s_196_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633187/products/Best_Selling_Big_Size_Men_s_Basketball_Shoes_Secon_Best_Sell_Best_Selling_Big_Size_Men_s_Basketball_Shoes_Secon_420_2.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635019/products/Newest_Men_s_basketball_shoes_Large_size_AJ_11_Retro_Cherry_Newest_Men_s_basketball_shoes_Large_size_AJ_11_Retro_Cherry_102.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634587/products/Italian_Style_High_Quality_Shoes_For_Buyers_Made_In_Italy_Fa_Italian_Style_High_Quality_Shoes_For_Buyers_Made_In_Italy_Fa_765_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632229/products/2022_Fashion_Luxury_Brand_Shoes_Air_AFire_OG_Low_Top_Casual_2022_Fashion_Luxury_Brand_Shoes_Air_AFire_OG_Low_Top_Casual_187_5.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633166/products/Best_Quality_Men_Boots_Made_in_Italy_Winter_Shoes_Laces_Genu_Best_Quality_Men_Boots_Made_in_Italy_Winter_Shoes_Laces_Genu_136_4.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634415/products/High_Quality_Shoes_Made_in_Italy_Mens_Casual_Boots_Genuine_L_High_Quality_Shoes_Made_in_Italy_Mens_Casual_Boots_Genuine_L_136_4.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635052/products/OG_Travis_X_j6_Retro_Medium_Olive_Men_Basketball_Shoes_Tinke_OG_Travis_X_j6_Retro_Medium_Olive_Men_Basketball_Shoes_Tinke_71_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632814/products/318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_49_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634506/products/Hot_sale_Fashion_Brand_Nike_SB_Dunk_Low_Panda_Casual_Shoes_O_Hot_sale_Fashion_Brand_Nike_SB_Dunk_Low_Panda_Casual_Shoes_O_93_53.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635801/products/wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772192192/leather_outsole_women_original_leather_cowboy_ankle_boots_sh_leather_outsole_women_original_leather_cowboy_ankle_boots_sh_250_chsojr.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772188454/milk_brown_leather_women_s_boots_milk_brown_leather_women_s_milk_brown_leather_women_s_boots_440_omarjx.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772190815/High_quality_genuine_crocodile_leather_pump_women_High_quali_High_quality_genuine_crocodile_leather_pump_women_2360_92_gvk0sv.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772190812/High_quality_black_genuine_crocodile_leather_ankle_boots_wom_High_quality_black_genuine_crocodile_leather_ankle_boots_wom_708_5_cneqzs.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191361/Hot_Sale_Classic_Products_Hand_Made_Italian_Genuine_Leather_Hot_Sale_Classic_Products_Hand_Made_Italian_Genuine_Leather_155_24_pxtbpt.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772362063/2022_Low_MOQ_Custom_Manufacturer_Genuine_Leather_Sneaker_Cus_2022_Low_MOQ_Custom_Manufacturer_Genuine_Leather_Sneaker_Cus_47_19_lebvi3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772192321/Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_207_n9uxsm.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772191383/Martin_Boots_Men_S_High_-Top_Locomotive_Wild_Leather_Desert_Martin_Boots_Men_S_High_-Top_Locomotive_Wild_Leather_Desert_33_11_vct6kf.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634131/products/Factory_wholesale_crocodile_leather_British_style_Factory_wh_Factory_wholesale_crocodile_leather_British_style_4387_16.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633935/products/Custom_British_goodyear_handmade_boots_genuine_leather_motor_Custom_British_goodyear_handmade_boots_genuine_leather_motor_350.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634066/products/Dropshipping_Classic_British_Genuine_Leather_Formal_Men_Fash_Dropshipping_Classic_British_Genuine_Leather_Formal_Men_Fash_48_19.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634641/products/LORENZO_MARI_Women_Sandals_White_genuine_Leather_LM039_box_LORENZO_MARI_Women_Sandals_White_genuine_Leather_LM039_box_778_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634357/products/High_Quality_Alien_Snail_Mt-20_Rally_Boots_Leather_Waterproo_High_Quality_Alien_Snail_Mt-20_Rally_Boots_Leather_Waterproo_223.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634596/products/Italian_High_Quality_Leather_For_Women_Made_In_Italy_Fashion_Italian_High_Quality_Leather_For_Women_Made_In_Italy_Fashion_269_5.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635288/products/SCOYCO_Bota_Off_Road_Motorcycle_Boots_For_Men_Leather_MX_MTB_SCOYCO_Bota_Off_Road_Motorcycle_Boots_For_Men_Leather_MX_MTB_263_76.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634978/products/New_Product_Style-_Flatform_High_Knee_Boot_In_Faux_Leather_w_New_Product_Style-_Flatform_High_Knee_Boot_In_Faux_Leather_w_673_75.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635808/products/wholesale_Luxury_Original_Original_Chunky_Retro_Dad_sport_Sh_wholesale_Luxury_Original_Original_Chunky_Retro_Dad_sport_Sh_142_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635801/products/wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635801/products/uglybros_Waterproof_Motorcycle_Boots_Retro_Motorbike_Chopper_uglybros_Waterproof_Motorcycle_Boots_Retro_Motorbike_Chopper_172_61.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635764/products/product1_95.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635413/products/Track_3_0_Designer_top_quality_11_trainer_pink_triple_s_runn_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Track_3_0_Designer_top_quality_11_trainer_pink_triple_s_runn.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635381/products/TR_Tiger_2022_new_Motocross_boots_Rally_boots_mx_boots_TR_Ti_TR_Tiger_2022_new_Motocross_boots_Rally_boots_mx_boots_156_96.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635377/products/TR_Tiger_MTR-T2_black_gray_Motocross_boots_motorcycle_boots_TR_Tiger_MTR-T2_black_gray_Motocross_boots_motorcycle_boots_168_37.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635158/products/Premium_Quality_Handmade_Italian_Men_Chelsea_Boot_Running_Sn_Premium_Quality_Handmade_Italian_Men_Chelsea_Boot_Running_Sn_273.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635025/products/Nibu_Commercial_Kitchen_Appliances_Fruit_Ice_Smoothies_Maker_Nibu_Commercial_Kitchen_Appliances_Fruit_Ice_Smoothies_Maker_325.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635014/products/New_fashion_street_trend_sneakers_street_casual_sports_metal_New_fashion_street_trend_sneakers_street_casual_sports_metal_43_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635011/products/New_hot_selling_ski_boots_wholesale_waterproof_and_durable_s_New_hot_selling_ski_boots_wholesale_waterproof_and_durable_s_316_55.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634992/products/New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_72_15.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634704/products/Luxury_Rhinestones_Square_Toe_High_Heels_Mesh_Hollow_Out_Lac_Luxury_Rhinestones_Square_Toe_High_Heels_Mesh_Hollow_Out_Lac_234.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634685/products/Low_Moq_Casual_Running_Shoes_Men_S_Casual_Shoes_Sneaker_Fuji_Low_Moq_Casual_Running_Shoes_Men_S_Casual_Shoes_Sneaker_Fuji_81_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634675/products/Latest_Crocodile_Skin_Penny_Loafers_Casual_Slip_On_Dress_Sho_Latest_Crocodile_Skin_Penny_Loafers_Casual_Slip_On_Dress_Sho_291_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634641/products/LORENZO_MARI_Women_Sandals_White_genuine_Leather_LM039_box_LORENZO_MARI_Women_Sandals_White_genuine_Leather_LM039_box_778_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634555/products/In_Stock_X_Brand_Sneakers_SB_Dunkes_Low_High_Women_Men_Blue_In_Stock_X_Brand_Sneakers_SB_Dunkes_Low_High_Women_Men_Blue_43_99.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634506/products/Hot_sale_Fashion_Brand_Nike_SB_Dunk_Low_Panda_Casual_Shoes_O_Hot_sale_Fashion_Brand_Nike_SB_Dunk_Low_Panda_Casual_Shoes_O_93_53.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634357/products/High_Quality_Alien_Snail_Mt-20_Rally_Boots_Leather_Waterproo_High_Quality_Alien_Snail_Mt-20_Rally_Boots_Leather_Waterproo_223.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634274/products/Goldens_Stasters_Sneakers_Gooses_Sports_Casual_Dirty_Women_S_Goldens_Stasters_Sneakers_Gooses_Sports_Casual_Dirty_Women_S_111_36.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634140/products/Fashion_Sneakers_Nike_Air_Jordan_1_Low_Blue_Men_s_Casual_Sho_Fashion_Sneakers_Nike_Air_Jordan_1_Low_Blue_Men_s_Casual_Sho_316_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634132/products/Fahion_and_Classic_leopard-grain_horsehair_women_ankle_boots_Fahion_and_Classic_leopard-grain_horsehair_women_ankle_boots_951_75.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634127/products/Factory_outlet_Professional_DIY_Hand-made_Red_color_long-tra_Factory_outlet_Professional_DIY_Hand-made_Red_color_long-tra_276_75.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633256/products/Black_fashion_energetic_design_suede_leather_high_ankle_Moto_Black_fashion_energetic_design_suede_leather_high_ankle_Moto_220.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633167/products/Best_Quality_Fashion_Comfortable_Lace-up_Women_Sneakers_Spor_Best_Quality_Fashion_Comfortable_Lace-up_Women_Sneakers_Spor_154_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633090/products/BMAI_brand_Latest_design_Cushioning_Breathable_soft_sole_bra_BMAI_brand_Latest_design_Cushioning_Breathable_soft_sole_bra_57_96.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632902/products/4_Retro_Psg_Paris_Military_Flight_Black_Designer_Sneakers_Me_4_Retro_Psg_Paris_Military_Flight_Black_Designer_Sneakers_Me_87_49.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364995/products/Women_Snow_Boots_The_Wool_Star-hot_Diamond-Hard_And_Skid-pro_Women_Snow_Boots_The_Wool_Star-hot_Diamond-Hard_And_Skid-pro_161_25_kbnezx.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364958/products/With_Box_dunks_basketball_shoes_men_women_running_shoes_walk_With_Box_dunks_basketball_shoes_men_women_running_shoes_walk_71_5_zaqbf6.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364957/products/With_Box_3s_Retro_Laser_Orange_sport_sneakers_men_women_cool_With_Box_3s_Retro_Laser_Orange_sport_sneakers_men_women_cool_154_micyyx.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364793/products/Wholesale_Fashion_Canvas_Sports_Genuine_Leather_Tenis_Fashio_Wholesale_Fashion_Canvas_Sports_Genuine_Leather_Tenis_Fashio_54_3_slxtjf.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772188455/men_designer_shoes_and_slippers_man_sandals_leather_shoes_fo_men_designer_shoes_and_slippers_man_sandals_leather_shoes_fo_49_5_cial6t.jpg"
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

/* Build product objects with name and a short description */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (lower.includes("boot")) return "Durable and stylish — great for outdoor and winter wear.";
      if (lower.includes("sneaker") || lower.includes("sneakers") || lower.includes("nike") || lower.includes("yeezy"))
        return "Comfortable sneaker for everyday wear and sports.";
      if (lower.includes("slipper") || lower.includes("loafer")) return "Casual and comfortable slip-on — great for home and casual outings.";
      if (lower.includes("oxford") || lower.includes("leather")) return "Premium leather craftsmanship for formal occasions.";
      if (lower.includes("heel") || lower.includes("pump")) return "Elevate your outfit with these stylish heels.";
      if (lower.includes("ice skate") || lower.includes("skate")) return "Specialized skate shoes for performance and style.";
      return "High quality shoes with excellent comfort and design.";
    })();
    return { id: idx + 1, name, desc, img: url };
  });

export default function Shoes() {
  // Shuffle once on component mount (keeps behavior same as Apparel & Accessories)
  const shuffledUrls = useMemo(() => shuffleArray(productUrls), []);
  const products = useMemo(() => productsFromUrls(shuffledUrls), [shuffledUrls]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // exactly 8 products per page
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage, products]);

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
    <div className="shoes-page">
      {/* HERO */}
      <section
        className="shoes-hero"
        style={{
          backgroundImage: `url(${ShoesHero})`,
        }}
        role="region"
        aria-label="Shoes hero"
      >
        <div className="shoes-hero-inner">
          <div className="shoes-hero-left" aria-hidden="true">
            {/* The image is the background of the section (kept for visual fidelity) */}
          </div>

          <div className="shoes-hero-right">
            <div className="shoes-hero-right-inner">
              <div className="shoes-kicker">SHOES</div>
              <h1 className="shoes-hero-title">Authentic shoes from the best brands.</h1>
              <p className="shoes-hero-sub">Updated weekly with new flash sales from some of the world's best brands.</p>
            </div>

            <div className="shoes-hero-mini">
              {/* small thumbnails on the bottom-right as seen in screenshot */}
              <img src={pageProducts[0]?.img || ""} alt="" className="mini-1" />
              <img src={pageProducts[1]?.img || ""} alt="" className="mini-2" />
            </div>
          </div>
        </div>
      </section>

      {/* product count and sort row */}
      <div className="shoes-toolbar">
        <div className="shoes-count">{total} Products Found</div>
        <div className="shoes-sort">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" name="sort" defaultValue="recommended">
            <option value="recommended">Recommended</option>
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <main className="shoes-products" role="main">
        <div className="products-grid" aria-live="polite">
          {pageProducts.map((p) => (
            <a
              key={p.id}
              href={`/shoes/${p.id}`}
              className="product-card"
              title={`${p.name} — ${p.desc}`}
              rel="noopener"
            >
              <div className="product-media">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <div className="product-body">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-desc">{p.desc}</p>
                <div className="product-actions">
                  <button type="button" className="btn-quick">Quick View</button>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* PAGINATION */}
        <nav className="shoes-pagination" aria-label="Pagination">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} className="pg-btn">
            Prev
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button onClick={() => goTo(1)} className="pg-btn">1</button>
              {pageNumbers[0] > 2 && <span className="pg-ellipsis">…</span>}
            </>
          )}

          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => goTo(n)}
              className={`pg-btn ${n === currentPage ? "active" : ""}`}
              aria-current={n === currentPage ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="pg-ellipsis">…</span>}
              <button onClick={() => goTo(totalPages)} className="pg-btn">{totalPages}</button>
            </>
          )}

          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} className="pg-btn">
            Next
          </button>
        </nav>
      </main>
    </div>
  );
}