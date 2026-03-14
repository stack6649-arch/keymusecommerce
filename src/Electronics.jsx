import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/electronics2.png";

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
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635816/products/wrist_watch_men_watches_luxury_luxury_watch_wrist_watch_men_wrist_watch_men_watches_luxury_luxury_watch_247_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635775/products/smart_home_display_cabinets_smart_home_showcase_easy_to_car_smart_home_display_cabinets_smart_home_showcase_easy_to_car_1261.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635498/products/Wall_Mount_43_WIFI_RJ45_Quad_Core_4G_LTE_Tablet_43_inch_RAM_Wall_Mount_43_WIFI_RJ45_Quad_Core_4G_LTE_Tablet_43_inch_RAM_708_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635502/products/Well_made_good_products_specially_provided_for_solar_inverte_Well_made_good_products_specially_provided_for_solar_inverte_731_6.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635497/products/WXFL-032_Living_room_Luxury_Silver_Modern_Crushed_Dia_mond_F_WXFL-032_Living_room_Luxury_Silver_Modern_Crushed_Dia_mond_F_66.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635497/products/WXFL-032_Living_room_Luxury_Silver_Modern_Crushed_Dia_mond_F_WXFL-032_Living_room_Luxury_Silver_Modern_Crushed_Dia_mond_F_66.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635457/products/Valdus_S105_GPS_UAV_30_minutes_battery_life_1_2km_long_range_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Valdus_S105_GPS_UAV_30_minutes_battery_life_1_2km_long_range.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635443/products/Used_Laptops_For_Sale_X230_Dual_Core_I5_3th_Gen_12_5_Light_T_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Used_Laptops_For_Sale_X230_Dual_Core_I5_3th_Gen_12_5_Light_T.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635440/products/Universal_Instant_Boiler_Good_Price_Home_Appliance_Water_Hea_Universal_Instant_Boiler_Good_Price_Home_Appliance_Water_Hea_260_75.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635440/products/Universal_Instant_Boiler_Good_Price_Home_Appliance_Water_Hea_Universal_Instant_Boiler_Good_Price_Home_Appliance_Water_Hea_260_75.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635439/products/Unlocked_Wholesale_Cheap_Original_Used_Cell_Phones_for_5s_6_Unlocked_Wholesale_Cheap_Original_Used_Cell_Phones_for_5s_6_165.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635426/products/UV_phototherapy_311nm_narrow_band_UVB_lamps_phototherapy_mac_UV_phototherapy_311nm_narrow_band_UVB_lamps_phototherapy_mac_487_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635426/products/UV_phototherapy_311nm_narrow_band_UVB_lamps_phototherapy_mac_UV_phototherapy_311nm_narrow_band_UVB_lamps_phototherapy_mac_487_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635418/products/Traditional_Luxury_Antique_7_Balls_Mosaic_Glass_Turkish_Hang_Traditional_Luxury_Antique_7_Balls_Mosaic_Glass_Turkish_Hang_108_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635418/products/Traditional_Luxury_Antique_7_Balls_Mosaic_Glass_Turkish_Hang_Traditional_Luxury_Antique_7_Balls_Mosaic_Glass_Turkish_Hang_108_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635394/products/Tiansta_380V_15000W_Single_Burner_Induction_Cooktop_Electric_Tiansta_380V_15000W_Single_Burner_Induction_Cooktop_Electric_628_57.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635389/products/Timex_Expedition_Rugged_Metal_Watch_It_s_all_about_the_eleme_Timex_Expedition_Rugged_Metal_Watch_55_3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635369/products/TGW_lpr_camera_license_plate_recognition_with_hardware_LED_d_TGW_lpr_camera_license_plate_recognition_with_hardware_LED_d_385.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635340/products/Ssangyong_auto_parts_ECU_kyron_rexton_270_actyon_musso_koran_Ssangyong_auto_parts_ECU_kyron_rexton_270_actyon_musso_koran_531.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635323/products/Special_Wholesale_OPPO_Reno_7_Pro_Cellphone_8GB_256GB12GB_25_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Special_Wholesale_OPPO_Reno_7_Pro_Cellphone_8GB_256GB12GB_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635323/products/Special_Wholesale_OPPO_Reno_7_Pro_Cellphone_8GB_256GB12GB_25_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Special_Wholesale_OPPO_Reno_7_Pro_Cellphone_8GB_256GB12GB_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635314/products/Smart_Home_Control_Panel_Tuya_Zigbee_Touch_Screen_8_Inch_Mul_Smart_Home_Control_Panel_Tuya_Zigbee_Touch_Screen_8_Inch_Mul_323_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635314/products/Smad_65L_Built-in_Household_Electric_High_Quality_Pizza_Bake_Smad_65L_Built-in_Household_Electric_High_Quality_Pizza_Bake_293_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635314/products/Smart_Mobile_Phone_Global_ROM_4GB_of_RAM_64GB_of_ROM_MTK_Hel_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Smart_Mobile_Phone_Global_ROM_4GB_of_RAM_64GB_of_ROM_MTK_Hel.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635314/products/Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_575.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635299/products/Salable_AE3_MAX_Drohne_GPS_4K_Camera_3-Axis_Gimbal_Anti-shak_Salable_AE3_MAX_Drohne_GPS_4K_Camera_3-Axis_Gimbal_Anti-shak_161_76.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635299/products/Samsung_Electronics_Galaxy_Watch_4_Classic_46mm_Smartwatch_w_Samsung_Electronics_Galaxy_Watch_4_Classic_46mm_Smartwatch_w_69_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635286/products/SG906_MAX1_Professional_4K_Camera_Drone_GPS_with_3_Axis_Gimb_SG906_MAX1_Professional_4K_Camera_Drone_GPS_with_3_Axis_Gimb_203_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635286/products/SG906_MAX2_BEST_3E_Camera_Drone_4K_Professional_GPS_4KM_EIS_SG906_MAX2_BEST_3E_Camera_Drone_4K_Professional_GPS_4KM_EIS_217_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635286/products/SG906_MAX2_BEST_3E_Camera_Drone_4K_Professional_GPS_4KM_EIS_SG906_MAX2_BEST_3E_Camera_Drone_4K_Professional_GPS_4KM_EIS_217_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635181/products/Public_electric_freestanding_water_dispensers_with_hot_and_c_Public_electric_freestanding_water_dispensers_with_hot_and_c_2259_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635181/products/Public_electric_freestanding_water_dispensers_with_hot_and_c_Public_electric_freestanding_water_dispensers_with_hot_and_c_2259_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635178/products/Professional_home_use_SUPER_4k_DIGITAL_VIDEO_CAMERA_with_3_0_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Professional_home_use_SUPER_4k_DIGITAL_VIDEO_CAMERA_with_3_0.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635169/products/Professional_Made_Rehabilitation_Robot_Glove_Hand_Rehabilita_Professional_Made_Rehabilitation_Robot_Glove_Hand_Rehabilita_228_36.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635151/products/Popular_classic_4g_volte_feature_bar_phones_slim_metal_body_Popular_classic_4g_volte_feature_bar_phones_slim_metal_body_175.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635151/products/Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_97_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635144/products/Phone_13_pro_max_6_7_inch_Original_Full_Screen_WIFI_BT_FM_GP_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Phone_13_pro_max_6_7_inch_Original_Full_Screen_WIFI_BT_FM_GP.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635143/products/Photographic_equipment_Photo_Studio_Continuous_Lighting_Kit_Photographic_equipment_Photo_Studio_Continuous_Lighting_Kit_550.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635133/products/Parking_Lots_System_AnprAlpr_Camera_Radar_Measure_Motor_Vehi_Parking_Lots_System_AnprAlpr_Camera_Radar_Measure_Motor_Vehi_480.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635105/products/Original_Pre-owned_brand_FE24-704_ZA_OSS_T_image-proof_micro_Original_Pre-owned_brand_FE24-704_ZA_OSS_T_image-proof_micro_590_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635104/products/Original_Smartphone_S22_Ultra_7_3_inch_Full_Screen_16_512GB_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Original_Smartphone_S22_Ultra_7_3_inch_Full_Screen_16_512GB.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635099/products/Original_SOYES_XS12_Mini_Smartphone_2GB_32GB_Android_Mobile_Original_SOYES_XS12_Mini_Smartphone_2GB_32GB_Android_Mobile_199_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635087/products/Original_New_Stock_Electric_Power_Steering_Pump_For_Peugeot_Original_New_Stock_Electric_Power_Steering_Pump_For_Peugeot_192_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635085/products/Original_Hik_DS-2CD2083G2-IU_Replace_DS-2CD2083G0-I_8MP_POE_Original_Hik_DS-2CD2083G2-IU_Replace_DS-2CD2083G0-I_8MP_POE_123_2.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635055/products/Official_UMIDIGI_BISON_GT2_Pro_5G_Smartphone_8GB_256GB_AI_ce_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Official_UMIDIGI_BISON_GT2_Pro_5G_Smartphone_8GB_256GB_AI_ce.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635048/products/OLEVS_Womens_Watches_Diamond_Luxury_Dress_Gold_Wrist_Watch_S_OLEVS_Womens_Watches_Diamond_Luxury_Dress_Gold_Wrist_Watch_S_39_77.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635038/products/OEM_Laptops_Notebook_15_6inch_8_16_20_GB_RAM_SSD_128_256_512_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_OEM_Laptops_Notebook_15_6inch_8_16_20_GB_RAM_SSD_128_256_512.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635031/products/Nordic_wooden_living_room_bedroom_sofa_vertical_lamp_high_qu_Nordic_wooden_living_room_bedroom_sofa_vertical_lamp_high_qu_86_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635031/products/Nordic_wooden_living_room_bedroom_sofa_vertical_lamp_high_qu_Nordic_wooden_living_room_bedroom_sofa_vertical_lamp_high_qu_86_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635018/products/Newest_style_Kitchen_appliances_lazy_person_multifunction_co_Newest_style_Kitchen_appliances_lazy_person_multifunction_co_594.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635018/products/Newest_style_Kitchen_appliances_lazy_person_multifunction_co_Newest_style_Kitchen_appliances_lazy_person_multifunction_co_594.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635011/products/New_cross-border_spot_P60pro_perforated_large_screen_7_8_inc_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_New_cross-border_spot_P60pro_perforated_large_screen_7_8_inc.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635006/products/New_arrival_trendy_bios_book_laptop_notebook_computer_waterp_New_arrival_trendy_bios_book_laptop_notebook_computer_waterp_242.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634979/products/New_Slim_15_6_Inch_cheap_Laptop_Slim_laptop_for_student_gami_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_New_Slim_15_6_Inch_cheap_Laptop_Slim_laptop_for_student_gami.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634979/products/New_Slim_15_6_Inch_cheap_Laptop_Slim_laptop_for_student_gami_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_New_Slim_15_6_Inch_cheap_Laptop_Slim_laptop_for_student_gami.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634969/products/New_Outdoor_Attendance_High_Resolution_Infrared_Imaging_Indu_New_Outdoor_Attendance_High_Resolution_Infrared_Imaging_Indu_1330_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634949/products/New_Designs_Commercial_Coffee_Machine_Electric_Appliance_New_New_Designs_Commercial_Coffee_Machine_Electric_Appliance_562_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634942/products/New_Design1_Heads_Infrared_Stove_single_Burner_Induction_Hob_New_Design1_Heads_Infrared_Stove_single_Burner_Induction_Hob_1658_8.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634942/products/New_Design1_Heads_Infrared_Stove_single_Burner_Induction_Hob_New_Design1_Heads_Infrared_Stove_single_Burner_Induction_Hob_1658_8.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634925/products/Negative_Hydrogen_ion_detoxification_instrument_detox_foot_s_Negative_Hydrogen_ion_detoxification_instrument_detox_foot_s_1100.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634878/products/Modern_studio_hotel_living_room_search_gold_white_decoration_Modern_studio_hotel_living_room_search_gold_white_decoration_216.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634875/products/Modern_vintage_industrial_indoor_nordic_mounted_round_led_pe_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_69_29.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634855/products/Mini_SE_With_3-Axis_Gimbal_2_7K_Camera_4k_HD_Video_Transmiss_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Mini_SE_With_3-Axis_Gimbal_2_7K_Camera_4k_HD_Video_Transmiss.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634855/products/Micro_Power_Consumption_2MP_1080P_48W_4PCS_Solar_Panel_Sim_C_Micro_Power_Consumption_2MP_1080P_48W_4PCS_Solar_Panel_Sim_C_196_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634854/products/Mini_Air_Conditioner_Cooler_Portable_5000Btu_Led_Light_House_Mini_Air_Conditioner_Cooler_Portable_5000Btu_Led_Light_House_140_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634847/products/Mens_Watch_Ultra-Thin_Digital_Sports_Watch_YUINK_Ultra-Thin_Mens_Watch_Ultra-Thin_Digital_Sports_Watch_24_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634803/products/Manufacturers_provide_portable_digital_camera_with_video_fun_Manufacturers_provide_portable_digital_camera_with_video_fun_1220_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634789/products/Manufacturer_90cm_Multi_Function_Electric_Wall_Oven_Bakery_O_Manufacturer_90cm_Multi_Function_Electric_Wall_Oven_Bakery_O_310_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634742/products/MDRF375_300L_Manufacturers_Home_Appliance_Eletronic_Refriger_MDRF375_300L_Manufacturers_Home_Appliance_Eletronic_Refriger_253.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634743/products/MEEGOPAD_Win7810_Cheap_Laptop_Computer_Core_i7_13_3inch_Inte_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_MEEGOPAD_Win7810_Cheap_Laptop_Computer_Core_i7_13_3inch_Inte.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634742/products/MAX_4G_GPS_WIFI_2_88_Inch_Touch_Screen_Dual_Camera_Gaming_Si_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_MAX_4G_GPS_WIFI_2_88_Inch_Touch_Screen_Dual_Camera_Gaming_Si.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634741/products/MDRF375_Home_Appliances_Double_Door_Bottom_Freezer_Refrigera_MDRF375_Home_Appliances_Double_Door_Bottom_Freezer_Refrigera_276.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634741/products/MDRF375_Home_Appliances_Double_Door_Bottom_Freezer_Refrigera_MDRF375_Home_Appliances_Double_Door_Bottom_Freezer_Refrigera_276.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634703/products/Luxury_Modern_Full_Body_Robot_AI_Smart_SL_Track_deluxe_massa_Luxury_Modern_Full_Body_Robot_AI_Smart_SL_Track_deluxe_massa_820.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634679/products/Light_Jewelry_Luxury_moissanite_Diamond_Iced_Out_G_Light_Jew_Light_Jewelry_Luxury_moissanite_Diamond_Iced_Out_G_43992_58.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634563/products/Insta360_Shadow_Stone_One_R_4k_Edition_Anti-shake_Intelligen_Insta360_Shadow_Stone_One_R_4k_Edition_Anti-shake_Intelligen_504_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634563/products/Insta360_Shadow_Stone_One_R_4k_Edition_Anti-shake_Intelligen_Insta360_Shadow_Stone_One_R_4k_Edition_Anti-shake_Intelligen_504_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634548/products/IIDA_for_samsung_A10_A20_A30_A40_A50_A70_A51_A21_A12S_A10e_A_IIDA_for_samsung_A10_A20_A30_A40_A50_A70_A51_A21_A12S_A10e_A_360.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634548/products/IIDA_for_samsung_A10_A20_A30_A40_A50_A70_A51_A21_A12S_A10e_A_IIDA_for_samsung_A10_A20_A30_A40_A50_A70_A51_A21_A12S_A10e_A_360.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634548/products/IPASON_New_Laptop_P1_Pro_I3_I5_I7_Processor_Intel_I3_1115G4_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_IPASON_New_Laptop_P1_Pro_I3_I5_I7_Processor_Intel_I3_1115G4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634525/products/Hote_Sale_Global_version_Smartphone_High_quality_S22_mobile_Hote_Sale_Global_version_Smartphone_High_quality_S22_mobile_198.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634519/products/Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_591_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634519/products/Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_591_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634519/products/Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_591_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634519/products/Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_Hqslp_Electronic_Intelligent_Sterilization_And_Disinfection_591_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634462/products/Home_appliance_room_use_personal_space_air_cooler_and_heater_Home_appliance_room_use_personal_space_air_cooler_and_heater_89_32.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634459/products/Home_appliance_20Lday_dehumidifier_with_wifi_two_fan_speed_a_Home_appliance_20Lday_dehumidifier_with_wifi_two_fan_speed_a_111_1.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634459/products/Home_appliance_20Lday_dehumidifier_with_wifi_two_fan_speed_a_Home_appliance_20Lday_dehumidifier_with_wifi_two_fan_speed_a_111_1.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634451/products/Home_Appliances_Kitchen_Commercial_Pizza_Oven_Baking_Large_C_Home_Appliances_Kitchen_Commercial_Pizza_Oven_Baking_Large_C_242.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634433/products/High_quality_S22_Ultra_true_4G_Android_11_true_perforation_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_High_quality_S22_Ultra_true_4G_Android_11_true_perforation.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634426/products/High_Thermal_Efficiency_3_Burner_Commercial_Electric_Inducti_High_Thermal_Efficiency_3_Burner_Commercial_Electric_Inducti_618.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634426/products/High_Rate_Recognition_Management_Software_Sri_Lanka_Car_Park_High_Rate_Recognition_Management_Software_Sri_Lanka_Car_Park_418.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634405/products/High_Quality_Home_Appliance_4_Stage_Reverse_Osmosis_RO_Water_High_Quality_Home_Appliance_4_Stage_Reverse_Osmosis_RO_Water_401_2.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634405/products/High_Quality_Home_Appliance_4_Stage_Reverse_Osmosis_RO_Water_High_Quality_Home_Appliance_4_Stage_Reverse_Osmosis_RO_Water_401_2.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634364/products/High_Quality_Auto_Parts_For_VW_HEAD_LIGHTS_AMAROK_HEAD_LAMP_High_Quality_Auto_Parts_For_VW_HEAD_LIGHTS_AMAROK_HEAD_LAMP_208.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634346/products/Health_Care_Supplies_Foot_Detox_Machine_Hydrogen_Ion_Massage_Health_Care_Supplies_Foot_Detox_Machine_Hydrogen_Ion_Massage_1100.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634318/products/HOT_Digital_Camera_with_3_Inch_Flip_Up_LCD_White_HOT_Digital_HOT_Digital_Camera_with_3_Inch_Flip_Up_LCD_White_650.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634318/products/HOT_Digital_Camera_with_3_Inch_Flip_Up_LCD_White_HOT_Digital_HOT_Digital_Camera_with_3_Inch_Flip_Up_LCD_White_650.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634310/products/HD_WIFI_4K_Video_Camera_48MP_Camcorder_30X_Digital_Zoom_for_HD_WIFI_4K_Video_Camera_48MP_Camcorder_30X_Digital_Zoom_for_184_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634310/products/HOBOT_298_Electric_Windows_Robot_Vacuum_Cleaner_Low_Price_Wi_HOBOT_298_Electric_Windows_Robot_Vacuum_Cleaner_Low_Price_Wi_769_98.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634301/products/Guwo_Auto_Parts_HDMB07-02_DV8_Offroad_Vented_Heat_Dispersio_Guwo_Auto_Parts_HDMB07-02_DV8_Offroad_Vented_Heat_Dispersio_165.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634295/products/Grandtime_2021_Bestselling_Wireless_2G3G4G_Dual_mic_Video_Re_Grandtime_2021_Bestselling_Wireless_2G3G4G_Dual_mic_Video_Re_1034.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634295/products/Grandtime_2021_Bestselling_Wireless_2G3G4G_Dual_mic_Video_Re_Grandtime_2021_Bestselling_Wireless_2G3G4G_Dual_mic_Video_Re_1034.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634295/products/Grandtime_2021_Bestselling_Wireless_2G3G4G_Dual_mic_Video_Re_Grandtime_2021_Bestselling_Wireless_2G3G4G_Dual_mic_Video_Re_1034.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634274/products/Global_version_Dangbei_F3_2050_ANSI_4k_multi-language_Smart_Global_version_Dangbei_F3_2050_ANSI_4k_multi-language_Smart_1020_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634270/products/Global_Version_Xiaomi_Mi_Watch_S1_Active_Smart_Watch_GPS_470_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Global_Version_Xiaomi_Mi_Watch_S1_Active_Smart_Watch_GPS_470.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634224/products/Free_delivery_online_shopping_i13_phone13_Pro_max_smartphone_Free_delivery_online_shopping_i13_phone13_Pro_max_smartphone_316_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634224/products/Free_delivery_online_shopping_i13_phone13_Pro_max_smartphone_Free_delivery_online_shopping_i13_phone13_Pro_max_smartphone_316_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634213/products/Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_110.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634213/products/Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_110.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634213/products/Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_110.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634122/products/Factory_direct_sale_mirrorless_camera_digital_anti-shake_4k_Factory_direct_sale_mirrorless_camera_digital_anti-shake_4k_1232.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634122/products/Factory_direct_sale_mirrorless_camera_digital_anti-shake_4k_Factory_direct_sale_mirrorless_camera_digital_anti-shake_4k_1232.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634088/products/Executive_Skeleton_Tourbillon_Tourbillon_Men_s_Watch_1713-13_Executive_Skeleton_Tourbillon_Tourbillon_Men_s_Watch_1713-13_38000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634088/products/Executive_Skeleton_Tourbillon_Tourbillon_Men_s_Watch_1713-13_Executive_Skeleton_Tourbillon_Tourbillon_Men_s_Watch_1713-13_38000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634081/products/Espresso_Machine_Home_Smart_Appliance_Steam_Milk_Foam_All-in_Espresso_Machine_Home_Smart_Appliance_Steam_Milk_Foam_All-in_219_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634073/products/Electric_Stainless_Steel_Wheat_Flour_Milling_Machine_Wet_And_Electric_Stainless_Steel_Wheat_Flour_Milling_Machine_Wet_And_430_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634073/products/Electric_Mini_Smart_Car_Electric_Four-wheeler_New_Energy_Hom_Electric_Mini_Smart_Car_Electric_Four-wheeler_New_Energy_Hom_3069.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634073/products/Electric_Mini_Smart_Car_Electric_Four-wheeler_New_Energy_Hom_Electric_Mini_Smart_Car_Electric_Four-wheeler_New_Energy_Hom_3069.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634073/products/Electric_Cooking_Home_Machine_And_Cooking_Pot_Making_Machine_Electric_Cooking_Home_Machine_And_Cooking_Pot_Making_Machine_527_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634064/products/Drop_Shipping_Insta360_GO_2_Mini_Action_Camera_for_IPhone_an_Drop_Shipping_Insta360_GO_2_Mini_Action_Camera_for_IPhone_an_316_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634060/products/Drones_F11_PRO_Professional_4K_HD_Camera_Gimbal_Drone_Brushl_Drones_F11_PRO_Professional_4K_HD_Camera_Gimbal_Drone_Brushl_148_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633976/products/Dakang_2MP_LPRANPR_Automatic_Vehicle_License_Plate_System_Cc_Dakang_2MP_LPRANPR_Automatic_Vehicle_License_Plate_System_Cc_715.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633967/products/DJI_Osmo_Action_3_Adventure_Combo_DJI_Action_3_Vlog_4K_Actio_DJI_Osmo_Action_3_Adventure_Combo_DJI_Action_3_Vlog_4K_Actio_516.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633965/products/DQ_85_Inch_4k_smart_tv_led_flat_TV_4K_android_smart_tcl_lg_s_DQ_85_Inch_4k_smart_tv_led_flat_TV_4K_android_smart_tcl_lg_s_781.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Chuse_Modern_Minimalist_Nordic_Led_Floor_Light_Marble_Flor_L_Chuse_Modern_Minimalist_Nordic_Led_Floor_Light_Marble_Flor_L_62_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633908/products/China_import_laptops_13_3_inch_win_10_cheap_all_in_one_lapto_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_China_import_laptops_13_3_inch_win_10_cheap_all_in_one_lapto.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633908/products/China_guangzhou_factory_retail_Led_tv_70_75_80_85_86_100_120_China_guangzhou_factory_retail_Led_tv_70_75_80_85_86_100_120_1196.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633887/products/Cheap_Price_55_65_inch_OEM_Curving_LCD_LED_Television_4K_Sma_Cheap_Price_55_65_inch_OEM_Curving_LCD_LED_Television_4K_Sma_262_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633887/products/Cheap_New_Portable_Business_8gb_Ram_1tb_Ssd_14_15_Inch_Windo_Cheap_New_Portable_Business_8gb_Ram_1tb_Ssd_14_15_Inch_Windo_425_68.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633004/products/AMV_58_2_Piece_Inch_Remote_control_Smart_Tv_4k_UHD_Televisio_AMV_58_2_Piece_Inch_Remote_control_Smart_Tv_4k_UHD_Televisio_330.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632975/products/99_New_Used_Laptops_Chromebook_C740_High_Quality_11_Inches_99_New_Used_Laptops_Chromebook_C740_High_Quality_11_Inches_143.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632969/products/8kw_single_Phase_Factory_Price_wall_hang_boiler_electric_boi_8kw_single_Phase_Factory_Price_wall_hang_boiler_electric_boi_335_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632966/products/7kg_CondenserAir_Heat_Pump_Home_Appliances_Automatic_Heat_Pu_7kg_CondenserAir_Heat_Pump_Home_Appliances_Automatic_Heat_Pu_165.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632964/products/8KW_OFS-AQS-S-S-8-4_home_appliances_Heat_supply_single_funct_8KW_OFS-AQS-S-S-8-4_home_appliances_Heat_supply_single_funct_453_13.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632919/products/500wh_Ac_Power_Station_Portable_Generator_Solar_power_system_500wh_Ac_Power_Station_Portable_Generator_Solar_power_system_343_98.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632919/products/512G_Best_Sale_Unlocked_Laptop_For_HP_Probook_430G1_Second_H_512G_Best_Sale_Unlocked_Laptop_For_HP_Probook_430G1_Second_H_694_66.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632878/products/4Channel_19_LCD_Wifi_Surveillance_Cameras_Security_Monitor_4Channel_19_LCD_Wifi_Surveillance_Cameras_Security_Monitor_154.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632878/products/4Channel_19_LCD_Wifi_Surveillance_Cameras_Security_Monitor_4Channel_19_LCD_Wifi_Surveillance_Cameras_Security_Monitor_154.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632878/products/4600Lumens_blue_tooth_Android_wifi_smart_projector_beamer_fo_4600Lumens_blue_tooth_Android_wifi_smart_projector_beamer_fo_369_6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632876/products/46L_china_home_appliances_micro_cool_mini_refrigerator_with_46L_china_home_appliances_micro_cool_mini_refrigerator_with_103_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632761/products/20_Minutes_Long_Flight_Duration_Battery_Life_1_2KM_Radius_8K_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_20_Minutes_Long_Flight_Duration_Battery_Life_1_2KM_Radius_8K.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632760/products/22_Multi-Parameters_PSG_polysomnography_sleep_and_breathing_22_Multi-Parameters_PSG_polysomnography_sleep_and_breathing_6500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632262/products/2022_Smartphone_S22_Ultra_Full_Screen_16_512GB_Android_Mobil_2022_Smartphone_S22_Ultra_Full_Screen_16_512GB_Android_Mobil_209.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632254/products/2022_New_Xiaomi_RedmiBook_Laptop_Pro_14_Inch_AMD_R5_6600HR7_2022_New_Xiaomi_RedmiBook_Laptop_Pro_14_Inch_AMD_R5_6600HR7_625_57.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632252/products/2022_New_Xiaomi_RedmiBook_Pro_15_2022_Laptop_12th_Intel_i7_1_We_are_a_leading-marketing_agency_that_utilIZES_over_10_year_2022_New_Xiaomi_RedmiBook_Pro_15_2022_Laptop_12th_Intel_i7_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632229/products/2022_Hot_Selling_Used_S20_S21_A10_A11_A20S_A70_A51_A31_A32_2022_Hot_Selling_Used_S20_S21_A10_A11_A20S_A70_A51_A31_A32_185_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632225/products/2022_Bio_resonance_8d_nls_body_health_analyzer_for_health_de_2022_Bio_resonance_8d_nls_body_health_analyzer_for_health_de_484_25.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632216/products/2021_Newest_Note30_12GB_512GB_Smartphone_6_9_Inch_AMOLED_Sc_We_are_a_leading-marketing_agency_that_utilIZES_over_10_year_2021_Newest_Note30_12GB_512GB_Smartphone_6_9_Inch_AMOLED_Sc.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632208/products/2021_P_M_New_Design_Mini_portable_medicine_refrigerator_for_2021_P_M_New_Design_Mini_portable_medicine_refrigerator_for_200_6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632156/products/15_inch_industrial_computing_workstation_Portable_Computer_T_15_inch_industrial_computing_workstation_Portable_Computer_T_1045.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632155/products/15_6_Inch_Intel_I3_N4000_J4125_Wins10_Netbook_8gb_Rom_256gb_We_are_a_leading-marketing_agency_that_utilIZES_over_10_year_15_6_Inch_Intel_I3_N4000_J4125_Wins10_Netbook_8gb_Rom_256gb.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632142/products/1200W_output_outdoor_energy_lifepo4_battery_tragbare_kraftwe_1200W_output_outdoor_energy_lifepo4_battery_tragbare_kraftwe_581_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632142/products/110V_household_electric_multifunction_smart_food_processor_1_110V_household_electric_multifunction_smart_food_processor_548_9.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632134/products/10_00_Carat_Handcrafted_Finger_Ring_Zircon_is_highly_recomme_Zircon_is_highly_recommended_for_people_who_want_peace_in_th_10_00_Carat_Handcrafted_Finger_Ring.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772365005/products/World_Premiere_Oukitel_WP19_Rugged_Smartphone_21000mAh_8G_2_World_Premiere_Oukitel_WP19_Rugged_Smartphone_21000mAh_8G_2_316_8_f1ikhy.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364896/products/Wholesale_Xiaomi_Mi_11_Ultra_5G_8_256GB_Original_Snapdragon_Wholesale_Xiaomi_Mi_11_Ultra_5G_8_256GB_Original_Snapdragon_548_9_j8nuah.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364892/products/Wholesale_Phone_128gb_7_8_Plus_X_Xr_Xs_11_12_13_14_Pro_Max_F_Wholesale_Phone_128gb_7_8_Plus_X_Xr_Xs_11_12_13_14_Pro_Max_F_142_8_vouib3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364892/products/Wholesale_Phone_128gb_7_8_Plus_X_Xr_Xs_11_12_13_14_Pro_Max_F_Wholesale_Phone_128gb_7_8_Plus_X_Xr_Xs_11_12_13_14_Pro_Max_F_142_8_vouib3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364889/products/Wholesale_original_second-hand_used_7D_single_body_HD_camcor_Wholesale_original_second-hand_used_7D_single_body_HD_camcor_295_1_vol6oo.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364872/products/Wholesale_led_tv_100_inch_smart_tv_for_sale_Wholesale_led_tv_Wholesale_led_tv_100_inch_smart_tv_for_sale_4745_kfkwvi.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772364871/products/Wholesale_laptops_15_6_Inch_6G12G_Intel_UHD_Graphics_laptops_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Wholesale_laptops_15_6_Inch_6G12G_Intel_UHD_Graphics_laptops_s5i0tz.jpg",
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
        role="region"
        aria-label="Shoes hero"
      >
        <div className="shoes-hero-inner">
          <div className="shoes-hero-left" aria-hidden="true">
            {/* Use imported Shoes.png as a contained <img> so it stays inside the left card */}
            <img src={ShoesHero} alt="Shoes hero" className="shoes-hero-img" />
          </div>

          <div className="shoes-hero-right">
            <div className="shoes-hero-right-inner">
              <div className="shoes-kicker">ELECTRONICS</div>
              <h1 className="shoes-hero-title">Authentic electronics from the best brands.</h1>
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