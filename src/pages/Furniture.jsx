import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/furniture2.png";

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
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635445/products/Upper_and_Lower_Double_Bunk_Solid_Wood_Mother_and_Child_Bed_Upper_and_Lower_Double_Bunk_Solid_Wood_Mother_and_Child_Bed_583.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635427/products/Uland_Outdoor_Party_Tables_And_Chairs_Coffee_Table_Set_Squar_Uland_Outdoor_Party_Tables_And_Chairs_Coffee_Table_Set_Squar_272_66.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635426/products/U_L_Interior_Hotel_HPL_20_minutes_Fire_Rated_Door_Fireproof_U_L_Interior_Hotel_HPL_20_minutes_Fire_Rated_Door_Fireproof_406_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635426/products/U_L_Interior_Hotel_HPL_20_minutes_Fire_Rated_Door_Fireproof_U_L_Interior_Hotel_HPL_20_minutes_Fire_Rated_Door_Fireproof_406_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635318/products/Sofa_Set_Furniture_Modern_Leather_Living_Room_Sofas_Sofa_Set_Sofa_Set_Furniture_Modern_Leather_Living_Room_Sofas_546_48.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635318/products/Sofa_Set_Furniture_Modern_Leather_Living_Room_Sofas_Sofa_Set_Sofa_Set_Furniture_Modern_Leather_Living_Room_Sofas_546_48.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635314/products/Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_575.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635314/products/Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_575.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635291/products/SNBC_BVM-R2000_Guaranteed_Quality_Vending_Machine_For_Medici_SNBC_BVM-R2000_Guaranteed_Quality_Vending_Machine_For_Medici_8800.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635250/products/Retro_Barber_Shop_Hair_Salon_Table_Makeup_Single_Side_Frame_Retro_Barber_Shop_Hair_Salon_Table_Makeup_Single_Side_Frame_376_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635200/products/Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_1100.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635200/products/Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_Queen_Loft_Bed_Space_Saving_Dormitory_Bedroom_Furniture_with_1100.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635152/products/Portable_Home_Appliance_Bagless_Aspirateur_Large_Capacity_Wa_Portable_Home_Appliance_Bagless_Aspirateur_Large_Capacity_Wa_357_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635151/products/Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_97_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635138/products/Pathway_Pilates_Core_Muscle_Training_Exercise_Equipment_Fitn_Pathway_Pilates_Core_Muscle_Training_Exercise_Equipment_Fitn_1001.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635039/products/OEM_Factory_green_and_gold_bed_velvet_fabric_modern_queen_si_OEM_Factory_green_and_gold_bed_velvet_fabric_modern_queen_si_328_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635026/products/Nordic_Style_Fabric_Sofa_Modern_Living_Room_L-shape_Sofa_Tec_Nordic_Style_Fabric_Sofa_Modern_Living_Room_L-shape_Sofa_Tec_760_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635019/products/Newest_Popular_Home_Multipurpose_Modern_Wireless_Charging_Sm_Newest_Popular_Home_Multipurpose_Modern_Wireless_Charging_Sm_660.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634934/products/New_Arrivals_Luxury_Home_Furniture_Antique_Solid_Wood_Living_New_Arrivals_Luxury_Home_Furniture_Antique_Solid_Wood_Living_2113_98.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634920/products/NOVA_11NAA034_High_Gloss_White_Modern_Sleeping_Room_Wardrobe_NOVA_11NAA034_High_Gloss_White_Modern_Sleeping_Room_Wardrobe_270_6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634904/products/Multifunction_Modern_Home_Furniture_Folding_Living_Room_Lift_Multifunction_Modern_Home_Furniture_Folding_Living_Room_Lift_550.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634904/products/Multi-functional_exercise_squats_training_machine_Commercial_Multi-functional_exercise_squats_training_machine_Commercial_1313.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634893/products/Mother_and_Child_Nordic_Modern_Simple_Children_Bunk_Bed_for_Mother_and_Child_Nordic_Modern_Simple_Children_Bunk_Bed_for_1225.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634878/products/Modern_studio_hotel_living_room_search_gold_white_decoration_Modern_studio_hotel_living_room_search_gold_white_decoration_216.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634875/products/Modern_vintage_industrial_indoor_nordic_mounted_round_led_pe_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_69_29.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634871/products/Modern_design_smart_bed_with_dressing_table_multi_functional_Modern_design_smart_bed_with_dressing_table_multi_functional_855_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634871/products/Modern_luxury_office_double_side_cabinet_L-shaped_boss_CEO_d_Modern_luxury_office_double_side_cabinet_L-shaped_boss_CEO_d_264.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634871/products/Modern_leather_sectional_sofa_living_room_furniture_sofa_set_Modern_leather_sectional_sofa_living_room_furniture_sofa_set_799_24.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634865/products/Modern_Divan_Live_Leather_Sofa_Set_Home_Furniture_Living_Roo_Modern_Divan_Live_Leather_Sofa_Set_Home_Furniture_Living_Roo_940_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634865/products/Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_4045_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634865/products/Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_Modern_Home_Furniture_Couches_Upholstered_Fabric_Living_Room_4045_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634863/products/Modern_Leather_Living_Room_Sofa_Set_7_Seater_L_U_Shaped_Recl_Modern_Leather_Living_Room_Sofa_Set_7_Seater_L_U_Shaped_Recl_638.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634863/products/Modern_Couches_Genuine_Leather_Cheap_Sofas_Living_Room_Sofa_Modern_Couches_Genuine_Leather_Cheap_Sofas_Living_Room_Sofa_578_16.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634848/products/Metal_floor_free_standing_multi-functional_sports_storage_ho_Metal_floor_free_standing_multi-functional_sports_storage_ho_43_97.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634820/products/Medicine_In_Emergency_Trolley_And_Drugs_Trolley_Suppliers_Me_Medicine_In_Emergency_Trolley_And_Drugs_Trolley_Suppliers_480.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634804/products/Mean_Well_DALI_LED_lighting_circle_chandelier_pendant_lamp_M_Mean_Well_DALI_LED_lighting_circle_chandelier_pendant_lamp_117_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634813/products/Medical_Anesthesia_TrolleyEmergency_TrolleyMedicine_Cart_Med_Medical_Anesthesia_TrolleyEmergency_TrolleyMedicine_Cart_576.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634803/products/Manufacturers_30_Year_Warranty_8_Seat_Set_Modern_Folding_Din_Manufacturers_30_Year_Warranty_8_Seat_Set_Modern_Folding_Din_580.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634721/products/Luxury_ostrich_feather_tree_stand_LED_floor_lamp_for_home_li_Luxury_ostrich_feather_tree_stand_LED_floor_lamp_for_home_li_321_2.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634719/products/Luxury_golden_color_popular_table_lamp_for_Hotel_Villa_lamp_Luxury_golden_color_popular_table_lamp_for_Hotel_Villa_lamp_151_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634719/products/Luxury_golden_color_popular_table_lamp_for_Hotel_Villa_lamp_Luxury_golden_color_popular_table_lamp_for_Hotel_Villa_lamp_151_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634694/products/Luxury_Electric_Genuine_LeatherHigh_Quality_Luxury_E_Home_Th_Luxury_Electric_Genuine_LeatherHigh_Quality_Luxury_E_Home_Th_1758_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634678/products/Living_Room_Modern_Furniture_Designs_Leather_L_Shape_Section_Living_Room_Modern_Furniture_Designs_Leather_L_Shape_Section_550.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634640/products/LED_Custom_Wholesale_Portable_Desktop_Cosmetic_Smart_Table_M_LED_Custom_Wholesale_Portable_Desktop_Cosmetic_Smart_Table_M_174_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634618/products/Kimon_Ceramic_Tembar_Board_W1200_oval_living_room_sofa_table_Kimon_Ceramic_Tembar_Board_W1200_oval_living_room_sofa_table_306_26.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634600/products/Italy_modern_leather_u_l_shape_sectional_sofa_set_with_wood_Italy_modern_leather_u_l_shape_sectional_sofa_set_with_wood_3168.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634519/products/Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_591_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634499/products/Hot_sale_home_furniture_saving_space_wood_wall_beds_murphy_b_Hot_sale_home_furniture_saving_space_wood_wall_beds_murphy_b_859_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634487/products/Hot_Selling_Coffee_For_Espresso_Quality_Guaranteed_Capsule_C_Hot_Selling_Coffee_For_Espresso_Quality_Guaranteed_Capsule_C_812_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634468/products/Home_training_exercise_sport_machine_Home_training_exercise_Home_training_exercise_sport_machine_880.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634464/products/Home_kitchen_appliance_range_hood_with_high_quality_material_Home_kitchen_appliance_range_hood_with_high_quality_material_103_5.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634463/products/Home_Furniture_Modern_Fabric_Sectional_Sofa_L_Shaped_Corner_Home_Furniture_Modern_Fabric_Sectional_Sofa_L_Shaped_Corner_2623_75.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634389/products/High_Quality_Leg_Lift_Full_Body_Electric_Adjustable_Homecare_High_Quality_Leg_Lift_Full_Body_Electric_Adjustable_Homecare_510.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634376/products/High_Quality_Cheap_Dining_Table_And_6_Chairs_Cheap_Round_Din_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_2200.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634369/products/High_Quality_Car_Upgrade_Kit_For_Spinthiace_Style_Body_Parts_High_Quality_Car_Upgrade_Kit_For_Spinthiace_Style_Body_Parts_1300.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634216/products/Frameless_Stand_dressing_mirror_with_led_bulbs_amazon_prime_Frameless_Stand_dressing_mirror_with_led_bulbs_amazon_prime_188_74.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634212/products/Foshan_furniture_market_classic_European_luxury_royal_king_s_Foshan_furniture_market_classic_European_luxury_royal_king_s_1174_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634211/products/Foshan_Supplier_High_Quality_Modern_Home_Couches_3_4_Seater_Foshan_Supplier_High_Quality_Modern_Home_Couches_3_4_Seater_2137_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634211/products/Foshan_factory_EUROPEAN_antique_style_living_room_sofas_top_Foshan_factory_EUROPEAN_antique_style_living_room_sofas_top_1735.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634211/products/Foshan_Realgres_Simple_Design_Modular_Living_Room_Sofa_Moder_Foshan_Realgres_Simple_Design_Modular_Living_Room_Sofa_Moder_2874_15.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634204/products/Flocked_snow_optical_fiber_Christmas_tree_eight_function_lig_Flocked_snow_optical_fiber_Christmas_tree_eight_function_lig_117.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634151/products/Fashionable_Modern_Home_Furniture_Leisure_Sofas_For_Living_R_Fashionable_Modern_Home_Furniture_Leisure_Sofas_For_Living_R_458_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634127/products/Factory_modern_On_Sales_Fancy_New_Model_7_Seater_couch_Leath_Factory_modern_On_Sales_Fancy_New_Model_7_Seater_couch_Leath_2418_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634123/products/Factory_Wholesale_Smart_Office_Table_Electric_Desk_Standing_Factory_Wholesale_Smart_Office_Table_Electric_Desk_Standing_435_6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634114/products/Factory_Sale_Leisure_Stackable_Wpc_Picnic_Table_Outdoor_Coff_Factory_Sale_Leisure_Stackable_Wpc_Picnic_Table_Outdoor_Coff_523_6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634073/products/Electric_Hot_Water_Boiler_for_Bathroom_Smart_Kitchen_Applian_Electric_Hot_Water_Boiler_for_Bathroom_Smart_Kitchen_Applian_625_2.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634064/products/Dubai_classic_fabric_sofa_sets_italian_living_room_furniture_Dubai_classic_fabric_sofa_sets_italian_living_room_furniture_2310.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634058/products/Doorwin_Factory_Directly_Supply_Australia_stand_solid_wood_w_Doorwin_Factory_Directly_Supply_Australia_stand_solid_wood_w_195_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633967/products/Customized_hotel_furniture_factory_5_star_modern_design_hote_Customized_hotel_furniture_factory_5_star_modern_design_hote_2700.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633967/products/DG_Luxury_house_furniture_modern_divanI_genuine_leather_fami_DG_Luxury_house_furniture_modern_divanI_genuine_leather_fami_2500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633954/products/Custom_made_office_desk_acrylic_solid_surface_unique_design_Custom_made_office_desk_acrylic_solid_surface_unique_design_849_6.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633935/products/Creative_Leisure_Armrest_Single_Sofa_Chair_Furniture_Comfort_Creative_Leisure_Armrest_Single_Sofa_Chair_Furniture_Comfort_368_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Chuse_Modern_Minimalist_Nordic_Led_Floor_Light_Marble_Flor_L_Chuse_Modern_Minimalist_Nordic_Led_Floor_Light_Marble_Flor_L_62_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633832/products/Car_Seat_Cover_Fully_enclosed_four_seasons_cushion_interior_Car_Seat_Cover_Fully_enclosed_four_seasons_cushion_interior_115_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633201/products/Best_price_of_high_quality_classic_executive_office_desk_fur_Best_price_of_high_quality_classic_executive_office_desk_fur_790_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633144/products/Bedroom_furniture_saving_space_folding_wall_bed_murphy_beds_Bedroom_furniture_saving_space_folding_wall_bed_murphy_beds_1292_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633060/products/American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_American_vintage_plumbing_clothing_store_cafe_studio_sofa_ch_165.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633060/products/Amazon_Hot_Selling_Wooden_baby_high_chair_multi-functional_c_Amazon_Hot_Selling_Wooden_baby_high_chair_multi-functional_c_121.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633054/products/All_kinds_of_aluminum_patio_chair_folding_chair_aluminum_All_All_kinds_of_aluminum_patio_chair_folding_chair_aluminum_275.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633015/products/Acacia_Wood_Dinner_Salad_Bowl_Set_Bring_the_rich_beauty_an_Acacia_Wood_Dinner_Salad_Bowl_Set_131_19.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632975/products/A302_factory_offer_high_quality_antique_Italian_luxury_sofas_A302_factory_offer_high_quality_antique_Italian_luxury_sofas_500_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632723/products/2022_hot_sale_Modern_living_room_free_combination_sectional_2022_hot_sale_Modern_living_room_free_combination_sectional_778_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632208/products/2021_new_arrivals_Classic_European_style_Luxury_Home_Furnitu_2021_new_arrivals_Classic_European_style_Luxury_Home_Furnitu_1430.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632159/products/16_Pair_Shoe_Storage_Rack_Cabinet_Organizer_with_2_Flip_Draw_16_Pair_Shoe_Storage_Rack_Cabinet_Organizer_with_2_Flip_Draw_159_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632146/products/126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_258_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632129/products/100_Hand-carving_Luxury_style_cloth_fabric_for_sofas_living_100_Hand-carving_Luxury_style_cloth_fabric_for_sofas_living_3300.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364878/products/Wholesale_luxury_brand_name_bag_Senior_designer_top_quality_Wholesale_luxury_brand_name_bag_Senior_designer_top_quality_239_2_tvr0xt.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364874/products/Wholesale_light_luxury_Genuine_leather_sofa_set_for_home_lea_Wholesale_light_luxury_Genuine_leather_sofa_set_for_home_lea_568_7_brmbkf.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364870/products/Wholesale_hot_sale_multi-function_smart_furniture_home_fabri_Wholesale_hot_sale_multi-function_smart_furniture_home_fabri_605_mrv0fk.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364749/products/Wholesale_Australia_Classic_Winter_Women_s_Fur_Snow_Boots_Wo_Wholesale_Australia_Classic_Winter_Women_s_Fur_Snow_Boots_Wo_77_5_ulb0zt.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364736/products/Whole_Sales_Wooden_Sports_Jumping_Gym_Boxs_Jump_Box_Custom_J_Whole_Sales_Wooden_Sports_Jumping_Gym_Boxs_Jump_Box_Custom_J_38_13_yowg9s.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364634/products/Upper_and_Lower_Double_Bunk_Solid_Wood_Mother_and_Child_Bed_Upper_and_Lower_Double_Bunk_Solid_Wood_Mother_and_Child_Bed_583_cmw4su.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772361692/16_Pair_Shoe_Storage_Rack_Cabinet_Organizer_with_2_Flip_Draw_16_Pair_Shoe_Storage_Rack_Cabinet_Organizer_with_2_Flip_Draw_159_5_ttrocs.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772188464/new_design_elegant_home_salon_furniture_sets_sofa_set_lounge_new_design_elegant_home_salon_furniture_sets_sofa_set_lounge_1297_4_lnikd6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772188458/modern_european_solid_wood_bed_Fashion_Carved_french_bedroom_modern_european_solid_wood_bed_Fashion_Carved_french_bedroom_352_qqbn4b.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772188428/luxurious_home_office_desk_Modern_design_computer_desks_gami_luxurious_home_office_desk_Modern_design_computer_desks_gami_462_5_npezvc.jpg"
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
      {/* Inject a small style override so we don't have to change Shoes.css */}
      <style>{`
        /* Ensure hero image never grows past a reasonable height on large screens */
        .shoes-hero .shoes-hero-left .shoes-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* keep visual fill but constrained by max-height below */
          max-height: 60vh; /* default cap relative to viewport */
        }

        /* On larger desktop screens clamp to a fixed pixel max so it doesn't push layout */
        @media (min-width: 1200px) {
          .shoes-hero .shoes-hero-left .shoes-hero-img {
            max-height: 520px; /* adjust as needed to match the marked line */
          }
        }

        /* Make product images fit into their product card boxes without increasing card size.
           We use contain so the full image is visible and not cropped; the card size remains controlled by existing CSS. */
        .products-grid .product-card .product-media img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* Do not modify the small mini thumbnails (mini-1, mini-2) as requested - they remain controlled by Shoes.css */
      `}</style>

      {/* HERO */}
      <section
        className="shoes-hero"
        role="region"
        aria-label="Shoes hero"
      >
        <div className="shoes-hero-inner">
          <div className="shoes-hero-left" aria-hidden="true">
            {/* Use imported Shoes.png as a contained <img> so it stays inside the left card */}
            <img
              src={ShoesHero}
              alt="Shoes hero"
              className="shoes-hero-img"
              // Inline fallback / extra safety to cap height and preserve fit if global CSS overrides are present
              style={{ maxHeight: "60vh", width: "100%", objectFit: "cover" }}
            />
          </div>

          <div className="shoes-hero-right">
            <div className="shoes-hero-right-inner">
              <div className="shoes-kicker">FURNITURE</div>
              <h1 className="shoes-hero-title">Authentic furniture from the best brands.</h1>
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
                {/* Product images: use object-fit contain so they don't overflow or get cropped;
                    card sizes remain controlled by Shoes.css */}
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
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
