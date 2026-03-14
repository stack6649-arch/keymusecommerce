import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Accessories.png";

/**
 * Furniture page (kept layout & CSS identical to Shoes.jsx)
 * - Uses the same Shoes.css styles and the same two-column, 8-per-page layout.
 * - Product URLs replaced with the Accessories URLs you provided and shuffled at runtime.
 * - Images are set to fit within the image frame regardless of original size.
 * - Only product URLs, hero image and a small image-fit CSS change were applied; rest of the file left intact.
 */

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

/* Accessories product URLs provided by you (will be shuffled at runtime) */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121336/products/online-shopping_diora_bag_tote_luxury_handbags_for_women_202_online-shopping_diora_bag_tote_luxury_handbags_for_women_202_78.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093146/products/Chain_Crossbody_Shoulder_Bag_Leopard_Real_Mink_Fur_Hand_Bags_Chain_Crossbody_Shoulder_Bag_Leopard_Real_Mink_Fur_Hand_Bags_275.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090346/products/2021_Lightweight_PU_Leather_Cross-body_Bag_Female_Opentops_N_2021_Lightweight_PU_Leather_Cross-body_Bag_Female_Opentops_N_208_66.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117219/products/Light_luxury_brand_PVC_underarm_bag_for_women_large_capacity_Light_luxury_brand_PVC_underarm_bag_for_women_large_capacity_839_86.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094238/products/Designer_Handbag_Famous_Brand_2021_Designer_Bag_Handbag_Wome_Designer_Handbag_Famous_Brand_2021_Designer_Bag_Handbag_Wome_52_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118686/products/New_Product_Moissanite_Diamond_Buffalo_Horn_Glasses_18K_Gold_New_Product_Moissanite_Diamond_Buffalo_Horn_Glasses_18K_Gold_622_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121660/products/x-ray_eye_protection_glasses_x-ray_eye_protection_glasses_x-ray_eye_protection_glasses_154.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118744/products/New_Style_HipHop_Iced_Out_Glasses_Men_s_Fashion_Sun_Glasses_New_Style_HipHop_Iced_Out_Glasses_Men_s_Fashion_Sun_Glasses_123_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117313/products/Luxury_Automatic_Buckle_Belt_Head_Genuine_Crocodile_Leather_Luxury_Automatic_Buckle_Belt_Head_Genuine_Crocodile_Leather_764_62.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120711/products/Window_cleaner_electric_glass_limpiacristales_remote_control_Window_cleaner_electric_glass_limpiacristales_remote_control_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117312/products/Luxury18k_Gold_Glasses_Frames_Fashion_Customizable_Eyewears_Luxury18k_Gold_Glasses_Frames_Fashion_Customizable_Eyewears_1437_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120346/products/Wholesale_China_Factory_men_belt_crocodile_leather_men_belts_Wholesale_China_Factory_men_belt_crocodile_leather_men_belts_404_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121101/products/YPOO_52CM_Large_running_belt_electronic_home_tread_YPOO_52CM_YPOO_52CM_Large_running_belt_electronic_home_tread_361_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094404/products/Eco-friendly_transparent_optical_eyeglass_glasses_Part_Spect_Eco-friendly_transparent_optical_eyeglass_glasses_Part_Spect_2080.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119824/products/Smart_Household_Appliances_Modern_Black_Durable_Glass_Built-_Smart_Household_Appliances_Modern_Black_Durable_Glass_Built-_1320.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091895/products/925_Sterling_Silver_Green_Enamel_Belt_Buckle_Square_Shape_Cr_925_Sterling_Silver_Green_Enamel_Belt_Buckle_Square_Shape_Cr_181_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119905/products/Spring_Ladies_Genuine_Sheepskin_Belt_Coat_With_Fox_Fur_Colla_Spring_Ladies_Genuine_Sheepskin_Belt_Coat_With_Fox_Fur_Colla_319.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092933/products/Borregls_Sterling_Silver_Wood_Glasses_Men_Rimless_Eyeglasses_Borregls_Sterling_Silver_Wood_Glasses_Men_Rimless_Eyeglasses_181_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300675/products/Devon_Tread1_E_Men_s_Time_Belt_Microstep_Motor_Watch_Devon_i_Devon_Tread1_E_Men_s_Time_Belt_Microstep_Motor_Watch_18500.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118753/products/New_Trends_Jacket_Women_Wool_Coat_Belt_Long_Cashmere_And_Fur_New_Trends_Jacket_Women_Wool_Coat_Belt_Long_Cashmere_And_Fur_198.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094720/products/Factory_Wholesale_18K_Gold_Metal_diamond_glasses_Frames_EH00_Factory_Wholesale_18K_Gold_Metal_diamond_glasses_Frames_EH00_7290.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120131/products/Traditional_Luxury_Antique_7_Balls_Mosaic_Glass_Turkish_Hang_Traditional_Luxury_Antique_7_Balls_Mosaic_Glass_Turkish_Hang_108_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118315/products/Moissanite_Glasses_popular_Jewelry_Lab_Grown_Diamond_Iced_Ou_Moissanite_Glasses_popular_Jewelry_Lab_Grown_Diamond_Iced_Ou_579_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094875/products/Fashion_18K_Gold_Half_Glasses_Men_s_Business_Casual_Eyewear_Fashion_18K_Gold_Half_Glasses_Men_s_Business_Casual_Eyewear_5875.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093020/products/Camera_on_Glasses_1080P_Video_Sunglasses_with_Camera_Wide_An_Camera_on_Glasses_1080P_Video_Sunglasses_with_Camera_Wide_An_132.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095949/products/Handbags_Crossbody_Bag_Tote_Bag_New_Arrival_Designer_Women_P_Handbags_Crossbody_Bag_Tote_Bag_New_Arrival_Designer_Women_P_299.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096400/products/High_quality_hand_bag_bolsa_cotton_canvas_tote_bag_custom_ha_High_quality_hand_bag_bolsa_cotton_canvas_tote_bag_custom_ha_242.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119704/products/Rokid_Air_AR_Smart_Glasses_120_Screen_with_1080P_OLED_Foldab_Rokid_Air_AR_Smart_Glasses_120_Screen_with_1080P_OLED_Foldab_438_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097189/products/KIBO_Custom_Luxury_Eyewear_Hip_Hop_Glasses_Iced_Out_Metal_Fr_KIBO_Custom_Luxury_Eyewear_Hip_Hop_Glasses_Iced_Out_Metal_Fr_533_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095782/products/HUAWEI_X_Gentle_M_smart_Eyewear_SMART_JACKBYE-01_smart_glass_HUAWEI_X_Gentle_M_smart_Eyewear_SMART_JACKBYE-01_smart_glass_404_8.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096449/products/Hip_hop_glasses_inlaid_with_gem_metal_frame_wooden_red_leg_g_Hip_hop_glasses_inlaid_with_gem_metal_frame_wooden_red_leg_g_182_64.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096704/products/Hot_sale_sac_a_main_hand_bag_women_custom_tote_bag_canvas_to_Hot_sale_sac_a_main_hand_bag_women_custom_tote_bag_canvas_to_364.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093653/products/Custom_Genuine_Leather_Travel_Weekender_Overnight_Duffel_Bag_Custom_Genuine_Leather_Travel_Weekender_Overnight_Duffel_Bag_50_96.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094899/products/Fashion_Handbag_Canvas_Bag_Women_s_Portable_Platinum_Cowhide_Fashion_Handbag_Canvas_Bag_Women_s_Portable_Platinum_Cowhide_41_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095089/products/Fashion_wooden_handbag_single_shoulder_bag_dog_tooth_crossbo_Fashion_wooden_handbag_single_shoulder_bag_dog_tooth_crossbo_208.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095961/products/Handwork_leather_tote_bag_lady_s_satchel_bags_Handwork_leath_Handwork_leather_tote_bag_lady_s_satchel_bags_765_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120407/products/Wholesale_Fashion_Ladies_Designers_Hand_Women_Luxury_Bag_Gen_Wholesale_Fashion_Ladies_Designers_Hand_Women_Luxury_Bag_Gen_341.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118475/products/New_Arrival_Luxury_Modern_Carved_Genuine_Leather_Bag_Classic_New_Arrival_Luxury_Modern_Carved_Genuine_Leather_Bag_Classic_234.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119226/products/Original_high_quality_ladies_messenger_bag_womens_luxury_han_Original_high_quality_ladies_messenger_bag_womens_luxury_han_50.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096086/products/High_Quality_Brand_new_shoulder_bag_designer_handbags_famous_High_Quality_Brand_new_shoulder_bag_designer_handbags_famous_207.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093359/products/China_wholesale_market_hot_selling_feminine_crocodile_bag_Ch_China_wholesale_market_hot_selling_feminine_crocodile_bag_5850.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095738/products/HD30-089_Trending_Products_Women_Bag_Handbag_Crossbody_Bags_HD30-089_Trending_Products_Women_Bag_Handbag_Crossbody_Bags_1765_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095050/products/Fashion_Women_Tote_Bag_Daily_Genuine_Leather_Handbag_Shoulde_Fashion_Women_Tote_Bag_Daily_Genuine_Leather_Handbag_Shoulde_227_37.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094933/products/Fashion_Luxury_Handbags_Women_Womens_Bag_Branded_Bags_Wholes_Fashion_Luxury_Handbags_Women_Womens_Bag_Branded_Bags_Wholes_225_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095405/products/GIOVANNI_GUIDI_Fashion_Luxury_Pu_Leather_Ladies_Shoulder_Bag_GIOVANNI_GUIDI_Fashion_Luxury_Pu_Leather_Ladies_Shoulder_Bag_168_87.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120310/products/White_Aluminum_Alloy_Plastic_sleeping_bag_baby_stroller_baby_White_Aluminum_Alloy_Plastic_sleeping_bag_baby_stroller_baby_89_09.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120649/products/Wholesale_luxury_brand_name_bag_Senior_designer_top_quality_Wholesale_luxury_brand_name_bag_Senior_designer_top_quality_239_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117517/products/M81266_NANO_NOE_BAG_M81266_NANO_NOE_BAG_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_2288.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096402/products/High_quality_handbag_oem_womens_genuine_leather_branded_bag_High_quality_handbag_oem_womens_genuine_leather_branded_bag_605.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120986/products/Woqi_Mountaintop_bag_60_10L_Hiking_outdoor_camping_Mountaine_Woqi_Mountaintop_bag_60_10L_Hiking_outdoor_camping_Mountaine_33_22.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121315/products/new_fashion_design_women_genuine_leather_round_bag_2022_with_new_fashion_design_women_genuine_leather_round_bag_2022_with_151_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120052/products/The_black_Cosmetic_bag_for_women_Cowhide_inner_material_Nile_The_black_Cosmetic_bag_for_women_Cowhide_inner_material_Nile_866_14.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117994/products/Men_Duffel_Bag_Travel_Bags_Genuine_Leather_Luxury_FG_Antonio_Men_Duffel_Bag_Travel_Bags_Genuine_Leather_Luxury_FG_Antonio_168_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096714/products/Hot_sell_MCM_Crossbody_bag_24K_gold_plated_metal_decoration_Hot_sell_MCM_Crossbody_bag_24K_gold_plated_metal_decoration_146_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118801/products/New_arrival_tooling_leather_craft_shoulder_bag_for_ladies_20_New_arrival_tooling_leather_craft_shoulder_bag_for_ladies_20_287_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118556/products/New_Diamond_Women_Evening_Bag_Cute_Cake_Design_Ladies_Clutch_New_Diamond_Women_Evening_Bag_Cute_Cake_Design_Ladies_Clutch_48_68.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121483/products/top_original_2021_famous_designer_handbags_bag_brand_woman_f_top_original_2021_famous_designer_handbags_bag_brand_woman_f_52_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120073/products/Togo_Leather_Handmade_honey_wax_platinum_bag_imported_calf_l_Togo_Leather_Handmade_honey_wax_platinum_bag_imported_calf_l_558_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121515/products/travel_luggage_bag_for_men_large_keepall_camping_bags_sport_travel_luggage_bag_for_men_large_keepall_camping_bags_sport_257_4.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092429/products/BLACK_LEATHER_SHOULDER_BAG_6897_WITH_RHINESTONES_FOR_WOMEN_B_BLACK_LEATHER_SHOULDER_BAG_6897_WITH_RHINESTONES_FOR_WOMEN_328_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090281/products/2021Women_s_luxury_handbag_first_lady_bag_raw_boa_skin_high_2021Women_s_luxury_handbag_first_lady_bag_raw_boa_skin_high_550.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092947/products/Brand_New_Mini_Designer_women_s_bags_For_Lady_Crossbody_Bag_Brand_New_Mini_Designer_women_s_bags_For_Lady_Crossbody_Bag_325.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121157/products/leather_bag_women_Brand_package_women_bags_handbag_Manual_cu_leather_bag_women_Brand_package_women_bags_handbag_Manual_cu_487_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096295/products/High_Quality_Tote_Bag_Women_Hand_Bags_Real_Fox_Fur_Shoulder_High_Quality_Tote_Bag_Women_Hand_Bags_Real_Fox_Fur_Shoulder_275.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118799/products/New_arrival_tooling_leather_craft_hand_bag_for_ladies_2022_n_New_arrival_tooling_leather_craft_hand_bag_for_ladies_2022_n_341.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117775/products/Made_in_Italy_URSULA_3SB_ROCK_PYTHON_Luxury_Bag_for_party_Made_in_Italy_URSULA_3SB_ROCK_PYTHON_Luxury_Bag_for_party_756_25.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117743/products/Made_in_Italy_BRIGIDA_LEATHER_POWDER_PINK_Luxury_Bag_for_Cla_Made_in_Italy_BRIGIDA_LEATHER_POWDER_PINK_Luxury_Bag_for_Cla_478_13.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095834/products/Handbag_Bags_For_Luxury_Ladies_Tote_Bag_Women_made_in_Italy_Handbag_Bags_For_Luxury_Ladies_Tote_Bag_Women_made_in_Italy_2032_29.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120009/products/TOP_Quality_Made_in_Italy_Classic_Alyce_Lady_s_bag_Top_doubl_TOP_Quality_Made_in_Italy_Classic_Alyce_Lady_s_bag_Top_doubl_195.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091213/products/2023_Luxury_Square_Fur_Bag_Genuine_Mink_Fur_Handbags_for_Wom_2023_Luxury_Square_Fur_Bag_Genuine_Mink_Fur_Handbags_for_Wom_167_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118738/products/New_Style_Fashion_Women_Fox_Fur_Tote_Bag_Women_Luxury_Hand_B_New_Style_Fashion_Women_Fox_Fur_Tote_Bag_Women_Luxury_Hand_B_162_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089897/products/00_580_4473_High_Quality_SM52_Plate_Clamp_Auto_Air_Bag_Plate_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_00_580_4473_High_Quality_SM52_Plate_Clamp_Auto_Air_Bag_Plate.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090352/products/2021_Lightweight_PU_Leather_Cross-body_Bag_Female_Opentops_N_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_208_66.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117313/products/Luxury_Automatic_Buckle_Belt_Head_Genuine_Crocodile_Leather_Luxury_Automatic_Buckle_Belt_Head_Genuine_Crocodile_Leather_764_62.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300476/products/Ipetboom_6_Pcs_Our_Lady_s_Headband_Star_for_Women_Dreadlock_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_Ipetboom_6_Pcs_Our_Lady_s_Headband_Star_for_Women_Dreadlock.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096541/products/Hot_Mom_360_Rotation_Baby_Stroller_Wheelchair_Accessories_3_Hot_Mom_360_Rotation_Baby_Stroller_Wheelchair_Accessories_3_536_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300483/products/Jewelili_Enchanted_Disney_Fine_Jewelry_10K_White_Gold_and_Ro_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_3910.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090352/products/2021_Lightweight_PU_Leather_Cross-body_Bag_Female_Opentops_N_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_208_66.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300478/products/JYX_Pearl_AAAA_Natural_Tahitian_Black_Pearl_Necklace_12-14m_Luxurious_12-14mm_round_black_Tahiti_pearl_necklace_Every_pi_JYX_Pearl_AAAA_Natural_Tahitian_Black_Pearl_Necklace_12-14m.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300507/products/Natural_Black_Diamond_Beads_Necklace_16_Inch_Full_Strand_4_t_Natural_Black_Diamond_Beads_Necklace_16_Inch_Full_Strand_4_t_5445_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300465/products/Gift_for_Mother_s_Day_Infinity_Love_Heart_Pendant_Necklaces_Gift_for_Mother_s_Day_Infinity_Love_Heart_Pendant_Necklaces_45_97.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300447/products/Betsey_Johnson_Butterfly_Necklace_Betsey_Johnson_y-shaped_ne_Betsey_Johnson_Butterfly_Necklace_58.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093034/products/Cashmere_Knitted_Pullover_Sweater_2022_7GG_Top_Fashion_Custo_Cashmere_Knitted_Pullover_Sweater_2022_7GG_Top_Fashion_Custo_115_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118469/products/New_Arrival_2022_Hand_Embroidery_Top_For_Women_Short_Sleeve_New_Arrival_2022_Hand_Embroidery_Top_For_Women_Short_Sleeve_440.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090904/products/2022_Wholesale_Hot_Selling_Ladies_Mini_Bags_Top_Quality_Tren_2022_Wholesale_Hot_Selling_Ladies_Mini_Bags_Top_Quality_Tren_893_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118536/products/New_Design_Fur_Winter_Women_Coat_Top_Quality_Fabric_Reversib_New_Design_Fur_Winter_Women_Coat_Top_Quality_Fabric_Reversib_214_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117855/products/Manufacturer_Price_Tall_Top_100_Felt_Hats_Black_Color_Rabbi_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_NaN.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117760/products/Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_2600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117366/products/Luxury_Men_s_Briefcase_top_cowhide_leather_Fashion_man_offic_Luxury_Men_s_Briefcase_top_cowhide_leather_Fashion_man_offic_192_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120093/products/Top_Quality_Italian_Genuine_Leather_Promise_Mini_Lady_s_Hand_Top_Quality_Italian_Genuine_Leather_Promise_Mini_Lady_s_Hand_150_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120097/products/Top_Sale_Fashion_Warm_Winter_Jacket_for_Women_Thicken_Soft_H_Top_Sale_Fashion_Warm_Winter_Jacket_for_Women_Thicken_Soft_H_561.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120122/products/Top_quality_luxury_ladies_Imported_fox_fur_longcoat_splicing_Top_quality_luxury_ladies_Imported_fox_fur_longcoat_splicing_1062_5.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120009/products/TOP_Quality_Made_in_Italy_Classic_Alyce_Lady_s_bag_Top_doubl_TOP_Quality_Made_in_Italy_Classic_Alyce_Lady_s_bag_Top_doubl_195.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093510/products/Competitive_Price_Sun_Protection_Hat_Outdoor_Camping_Riding_Competitive_Price_Sun_Protection_Hat_Outdoor_Camping_Riding_299_94.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094912/products/Fashion_Hat_Ladies_Oversize_Straw_Boater_Extra_Large_Brim_Wh_Fashion_Hat_Ladies_Oversize_Straw_Boater_Extra_Large_Brim_Wh_177_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117992/products/Men_Breathable_Mesh_Summer_Hat_Newsboy_Beret_Ivy_Cap_Cabbie_Men_Breathable_Mesh_Summer_Hat_Newsboy_Beret_Ivy_Cap_Cabbie_159_3.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117219/products/Light_luxury_brand_PVC_underarm_bag_for_women_large_capacity_Light_luxury_brand_PVC_underarm_bag_for_women_large_capacity_839_86.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300666/products/Chanel_Black_Code_Coco_Black_Diamond_Dial_Ladies_Steel_and_C_Chanel_Black_Code_Coco_Black_Diamond_Dial_Ladies_Steel_and_C_5472.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300690/products/Gucci_G-rame_Quartz_Green_Red_and_Blue_Dial_Ladies_Watch_YA_Gucci_G-rame_Quartz_Green_Red_and_Blue_Dial_Ladies_Watch_YA_728_21.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089092/products/100ML_NOSTALGIA_TIMELESS_ORIGINAL_PERFUME_BY_LORIS_BRAND_FOR__100ML_NOSTALGIA_TIMELESS_ORIGINAL_PERFUME_BY_LORIS_BRAND_FOR__%C2%A3_3250.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089960/products/100ML_NOSTALGIA_TIMELESS_ORIGINAL_PERFUME_BY_LORIS_BRAND_FOR_100ML_NOSTALGIA_TIMELESS_ORIGINAL_PERFUME_BY_LORIS_BRAND_FOR_3250.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119342/products/Perfume_777_Perfume_777_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_495.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095344/products/Full_Set_of_eighteen_Eau_de_pafums_and_Extrait_de_parfums_10_Full_Set_of_eighteen_Eau_de_pafums_and_Extrait_de_parfums_10_1670_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095360/products/Full_Set_of_seven_Eau_de_pafums_100_ml_Mediterranee_Artistic_Full_Set_of_seven_Eau_de_pafums_100_ml_Mediterranee_Artistic_420.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120747/products/Winter_Jacket_Women_Puffer_Ladies_Down_Coat_With_Real_Fox_Fu_Winter_Jacket_Women_Puffer_Ladies_Down_Coat_With_Real_Fox_Fu_418.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117235/products/Long_Jacket_Plazo_Classy_heavy_Beautiful_Dress_with_heavy_Long_Jacket_Plazo_Classy_heavy_Beautiful_Dress_with_heavy_528.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300404/products/12X10_MM_Size_Sparkling_Oval_Ruby_Halo_Earring_with_Diamond_Beautifully_designed_earrings_offered_at_an_affordable_price_12X10_MM_Size_Sparkling_Oval_Ruby_Halo_Earring_with_Diamond.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096286/products/High_Quality_Sensitive_Skin_Babies_Face_Make_Up_Sunscreen_Or_High_Quality_Sensitive_Skin_Babies_Face_Make_Up_Sunscreen_Or_39_63.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095751/products/HD_wholesale_foundation_best_makeup_for_oily_skin_HD_wholesa_HD_wholesale_foundation_best_makeup_for_oily_skin_145_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300427/products/8_Carat_Diamond_Tennis_Bracelet_in_14K_Gold_7_Inch_Make_Her_8_Carat_Diamond_Tennis_Bracelet_in_14K_Gold_7_Inch_3149_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119696/products/Retro_Barber_Shop_Hair_Salon_Table_Makeup_Single_Side_Frame_Retro_Barber_Shop_Hair_Salon_Table_Makeup_Single_Side_Frame_376_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091983/products/AMIRO_Makeup_Mirrors_Rechargeable_Battery_Smart_Sensor_AMIRO_AMIRO_Makeup_Mirrors_Rechargeable_Battery_Smart_Sensor_202_67.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120448/products/Wholesale_Hand_Make_Feather_Mini_Dress_Clubwear_Rhinestone_N_Wholesale_Hand_Make_Feather_Mini_Dress_Clubwear_Rhinestone_N_166_14.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095759/products/HENLICS_Professional_Makeup_Sets_Makeup_Kit_Box_including_fa_HENLICS_Professional_Makeup_Sets_Makeup_Kit_Box_including_fa_218_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092121/products/Anti_aging_jade_sleep_crystal_facial_eye_mask_amethyst_face_Anti_aging_jade_sleep_crystal_facial_eye_mask_amethyst_face_104.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092920/products/Blemish_Elimination_Skin_Care_Whitening_Facial_Mask_with_Nat_Blemish_Elimination_Skin_Care_Whitening_Facial_Mask_with_Nat_62_81.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119087/products/OUMO-_11pcs_luxury_grey_squirrel_hair_green_sandalwood_handl_OUMO-_11pcs_luxury_grey_squirrel_hair_green_sandalwood_handl_493_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118654/products/New_Men_s_Leather_Belts_Pin_Belts_Waistband_Waist_Strap_Genu_New_Men_s_Leather_Belts_Pin_Belts_Waistband_Waist_Strap_Genu_236_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090735/products/2022_New_Arrivals_Winter_Clothing_Waist_Adjustable_Long_Puff_2022_New_Arrivals_Winter_Clothing_Waist_Adjustable_Long_Puff_158_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118930/products/OEMODM_High_Quality_Winter_Elegant_Women_Brown_Waist_Long_Wo_OEMODM_High_Quality_Winter_Elegant_Women_Brown_Waist_Long_Wo_220.jpg"
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

/* Build product objects with name and a short description (furniture-focused descriptions retained) */
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
      if (lower.includes("chair") || lower.includes("armrest") || lower.includes("stool") || lower.includes("high") ) {
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
      if (lower.includes("hospital") || lower.includes("medical") || lower.includes("surgical") || lower.includes("wheelchair") || lower.includes("patient")) {
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
  // Shuffle once on component mount
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

        /* Two columns layout: left and right columns stacked vertically */
        .two-column-vertical {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Column container holds 4 stacked cards */
        .column-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Frame around each card to match screenshot look */
        .shoe-card-frame {
          border: 8px solid #071e2f;
          box-sizing: border-box;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          text-decoration: none;
          min-height: 280px;
        }

        /* Image wrapper keeps consistent aspect and scales */
        .shoe-image-wrap {
          width: 100%;
          padding-top: 56%;
          position: relative;
          overflow: hidden;
          background: #fff;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Ensure image always fits inside its frame regardless of original size */
        .shoe-image-wrap img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .shoe-info {
          padding: 14px;
          background: #fff;
          flex: 1 1 auto;
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

        /* Pagination style */
        .pagination-wrap {
          display:flex;
          justify-content:center;
          padding: 22px 0 44px;
        }
        .pagination-wrap button {
          margin: 0 6px;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid #d6d6d6;
          background: #fff;
          cursor: pointer;
          font-weight: 700;
          color: #111;
        }
        .pagination-wrap button.active {
          background: #1e90ff;
          color: #fff;
          border-color: #1e90ff;
        }

        /* Small screens: collapse to single column (keeps readable) */
        @media (max-width: 900px) {
          .two-column-vertical {
            grid-template-columns: 1fr;
            padding: 0 12px;
          }
        }

        /* Extra small screens: reduce frame thickness and font sizes */
        @media (max-width: 520px) {
          .shoe-card-frame { border-width: 4px; min-height: 220px; }
          .shoe-name { font-size: 15px; }
          .shoe-desc { font-size: 12px; }
        }
      `}</style>

      <main className="shoes-main">
        {/* Hero Section: background uses the imported Accessories.png asset */}
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
            <h2 className="shoes-category">Accessories</h2>
            <h1 className="shoes-title">Explore Our Collection For Accessories</h1>
            <p className="shoes-subtitle">
              Updated weekly with new arrivals and curated selections for your home.
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

        {/* Pagination */}
        <div className="pagination-wrap" aria-label="Pagination">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
            {"<"}
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button onClick={() => goTo(1)}>1</button>
              {pageNumbers[0] > 2 && <span style={{ alignSelf: "center", margin: "0 6px", color: "#fff" }}>…</span>}
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
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span style={{ alignSelf: "center", margin: "0 6px", color: "#fff" }}>…</span>}
              <button onClick={() => goTo(totalPages)}>{totalPages}</button>
            </>
          )}

          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
            {">"}
          </button>
        </div>
      </main>
    </div>
  );
}