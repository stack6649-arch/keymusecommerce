import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/watches2.png";

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
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635443/products/Urushi_Maki-e_Watch_Iznik-Style_Arabesque_We_are_an_estab_Urushi_Maki-e_Watch_Iznik-Style_Arabesque_5115.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635438/products/Ulysse_Nardin_Marine_Chronometer_Automatic_Men_s_Watch_The_U_Ulysse_Nardin_Marine_Chronometer_Automatic_Men_s_Watch_8763_88.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635403/products/Tommy_Hilfiger_Men_s_Quartz_Stainless_Steel_and_Leather_Stra_Tommy_Hilfiger_Men_s_Quartz_Stainless_Steel_and_Leather_Stra_115_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635403/products/Tissot_mens_Tissot_PRS_516_Chronograph_316L_stainless_steel_Tissot_mens_Tissot_PRS_516_Chronograph_316L_stainless_steel_280_42.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635394/products/Tiansta_380V_15000W_Single_Burner_Induction_Cooktop_Electric_Tiansta_380V_15000W_Single_Burner_Induction_Cooktop_Electric_628_57.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635389/products/Timex_Men_s_Easy_Reader_Watch_Adjustable_black_18_millimeter_Timex_Men_s_Easy_Reader_Watch_37_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635377/products/Tag_Heuer_Formula_1_Blue_Dial_Men_s_Watch_WAZ1010_BA0842_Blu_Blue_dial_Silver-tone_stainless_steel_case_with_a_silver-to_Tag_Heuer_Formula_1_Blue_Dial_Men_s_Watch_WAZ1010_BA0842.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635372/products/TRDYBSK_Luxury_Transparent_Case_Modification_Kit_for_Apple_W_TRDYBSK_Luxury_Transparent_Case_Modification_Kit_for_Apple_W_4192_84.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635371/products/TRDYBSK_Strap_Case_For_Apple_Watch_Band_45mm_44mm_Metal_stai_TRDYBSK_Strap_Case_For_Apple_Watch_Band_45mm_44mm_Metal_stai_4184_37.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635369/products/TANK_MUST_WATCH_TANK_MUST_WATCH_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_1265.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635368/products/TAG_Heuer_Men_s_Carrera_Automatic_Watch_-_Diameter_41_mm_WBN_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-tTAG_Heuer_Men_s_Carrera_Automatic_Watch_-_Diameter_41_mm_WBN.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635308/products/Shenzhen_Smart_Watch_quality_control_inspection_QA_QC_check_Shenzhen_Smart_Watch_quality_control_inspection_QA_QC_check_201_6.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635307/products/Seiko_LX_Limited_Edition_Divers_Watch_Seiko_LX_Limited_Editi_Seiko_LX_Limited_Edition_Divers_Watch_8500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635305/products/SUNKTA_Smart_Watch_Men_s_voice_chat_smartwatch_This_Bluetoot_Men_s_voice_chat_smartwatch_This_Bluetooth_phone_calls_smart_49_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635299/products/Samsung_Electronics_Galaxy_Watch_4_Classic_46mm_Smartwatch_w_Samsung_Electronics_Galaxy_Watch_4_Classic_46mm_Smartwatch_w_69_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635284/products/SHENGKE_SK_Classic_Business_Women_s_Watches_About_usGuangdon_SHENGKE_SK_Classic_Business_Women_s_Watches_24_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635284/products/SHENGKE_SK_Classic_Business_Women_s_Watches_About_usGuangdon_SHENGKE_SK_Classic_Business_Women_s_Watches_24_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635271/products/SAMSUNG_Galaxy_FIT_3_2024_1_6_AMOLED_Display_14_Days_Batt_The_Samsung_Galaxy_Fit_3_redefines_wearable_fitness_tech_wit_SAMSUNG_Galaxy_FIT_3_2024_1_6_AMOLED_Display_14_Days_Batt.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635266/products/Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_Rolex_Oy_Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_8688.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635266/products/Rolex_Submariner_Hulk_116610LV_stainless_steel_watch_40mm_20_Rolex_Submariner_Hulk_116610LV_stainless_steel_watch_40mm_20_26500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635266/products/Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_16570_Br_Rolex_Oyster_Perpetual_Explorer_II_Steel_Mens_Watch_16570_9655.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635257/products/Rolex_Lady-Datejust_26_179174_White_Dial_with_Diamonds_Jubil_Rolex_Lady-Datejust_26_179174_White_Dial_with_Diamonds_Jubil_8775.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635257/products/Rolex_Air_King_Black_Dial_Stainless_Steel_Men_s_Watch_Black_Rolex_Air_King_Black_Dial_Stainless_Steel_Men_s_Watch_8695.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635257/products/Rolex_Explorer_Black_Dial_Stainless_Steel_Rolex_Oyster_Autom_Rolex_Explorer_Black_Dial_Stainless_Steel_Rolex_Oyster_Autom_8545.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635257/products/Rolex_New_Daytona_116505_Everose_Gold_Black_2019_BoxPaper5Yr_Rolex_New_Daytona_116505_Everose_Gold_Black_2019_BoxPaper5Yr_60000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635220/products/Rado_True_Square_Automatic_Open_Heart_Mens_Watch_At_Rado_we_Rado_True_Square_Automatic_Open_Heart_Mens_Watch_2600.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635214/products/Rado_Integral_Diamonds_Ladies_22_7mm_The_iconic_Integral_has_The_iconic_Integral_has_been_redesigned_to_suit_the_needs_an_Rado_Integral_Diamonds_Ladies_22_7mm.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635206/products/RAYMOND_WEIL_Maestro_Men_s_Automatic_Watch_Moon_Phase_Silv_Maestro_Moon_Phase_Experience_the_enchantment_of_the_maestro_RAYMOND_WEIL_Maestro_Men_s_Automatic_Watch_Moon_Phase_Silv.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635204/products/Rado_Florence_Swiss_Quartz_Dress_Watch_with_Stainless_Steel_Rado_Florence_Swiss_Quartz_Dress_Watch_with_Stainless_Steel_1000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635204/products/RYLOS_Mens_Rings_14K_Yellow_Gold_-_Mens_Diamond_Blue_Onyx_GREAT_GIFT_for_birthday_anniversary_holidays_stocking_stu_RYLOS_Mens_Rings_14K_Yellow_Gold_-_Mens_Diamond_Blue_Onyx.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635199/products/RAYMOND_WEIL_Freelancer_Men_s_Automatic_Watch_The_freelancer_RAYMOND_WEIL_Freelancer_Men_s_Automatic_Watch_3875.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635143/products/Photographic_equipment_Photo_Studio_Continuous_Lighting_Kit_Photographic_equipment_Photo_Studio_Continuous_Lighting_Kit_550.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635133/products/Parking_Lots_System_AnprAlpr_Camera_Radar_Measure_Motor_Vehi_Parking_Lots_System_AnprAlpr_Camera_Radar_Measure_Motor_Vehi_480.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635099/products/Original_second-hand_used_Watch_Series_7_smart_waterproof_sp_Original_second-hand_used_Watch_Series_7_smart_waterproof_sp_432_5.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635085/products/Original_Hik_DS-2CD2083G2-IU_Replace_DS-2CD2083G0-I_8MP_POE_Original_Hik_DS-2CD2083G2-IU_Replace_DS-2CD2083G0-I_8MP_POE_123_2.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635071/products/Omega_Women_s_White_Mother-Of-Pearl_Dial_Constellation_Watch_Omega_Women_s_White_Mother-Of-Pearl_Dial_Constellation_Watch_7515.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635071/products/Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001_B_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635071/products/Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001_B_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635071/products/Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001_B_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Speedmaster_Automatic_Mens_Watch_304_30_44_52_01_001.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635071/products/Omega_Speedmaster_Racing_Automatic_Chronograph_Men_s_Watch_B_Omega_Speedmaster_Racing_Automatic_Chronograph_Men_s_Watch_7605.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635071/products/Omega_Women_s_Constellation_Diamond_35mm_Luxury_Watch_Omega_Omega_Women_s_Constellation_Diamond_35mm_Luxury_Watch_8788.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635067/products/Omega_Seamaster_Planet_Ocean_Automatic_Men_s_Watch_215_30_44_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Seamaster_Planet_Ocean_Automatic_Men_s_Watch_215_30_44.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635067/products/Omega_Seamaster_Planet_Ocean_Black_dial_Black_ceramic_case_Omega_Seamaster_Planet_Ocean_8899.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635067/products/Omega_Seamaster_Planet_Ocean_Titanium_600M_Chronograph_Autom_Brand_Seller_or_Collection_Name_Omega_Clasp_Deployment_Cla_Omega_Seamaster_Planet_Ocean_Titanium_600M_Chronograph_Autom.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635067/products/Omega_Seamaster_Planet_Ocean_Titanium_600M_Chronograph_Autom_Brand_Seller_or_Collection_Name_Omega_Clasp_Deployment_Cla_Omega_Seamaster_Planet_Ocean_Titanium_600M_Chronograph_Autom.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635063/products/Omega_Seamaster_Diver_Chronometer_42mm_Mens_Special_Edition_Omega_Seamaster_Diver_Chronometer_42mm_Mens_Special_Edition_8874_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635063/products/Omega_Seamaster_Planet_Ocean_215_92_44_21_99_001_Omega_Seama_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Omega_Seamaster_Planet_Ocean_215_92_44_21_99_001.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635063/products/Omega_Seamaster_Aqua_Terra_Diamond_Women_s_Watch_30_0_mm_sta_Omega_Seamaster_Aqua_Terra_Diamond_Women_s_Watch_7875.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635063/products/Omega_Seamaster_Diver_Chronometer_42mm_Mens_Special_Edition_Brown_dial_Grey_titanium_case_with_a_grey_titanium_mesh_ban_Omega_Seamaster_Diver_Chronometer_42mm_Mens_Special_Edition.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635063/products/Omega_Seamaster_Aqua_Terra_Chronometer_Mens_Watch_220_10_41_Grey_dial_Silver-tone_stainless_steel_case_with_a_silver-to_Omega_Seamaster_Aqua_Terra_Chronometer_Mens_Watch_220_10_41.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635060/products/Omega_Diver_300M_Automatic_Chronometer_Black_Dial_Men_s_Watc_Omega_Diver_300M_Automatic_Chronometer_Black_Dial_Men_s_Watc_8659.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635060/products/Omega_Men_s_Speed_Master_Racing_Analog_Display_Swiss_Automat_Omega_Men_s_Speed_Master_Racing_Analog_Display_Swiss_Automat_3590.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635060/products/Omega_Diver_300M_Automatic_Chronometer_Black_Dial_Men_s_Watc_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_Omega_Diver_300M_Automatic_Chronometer_Black_Dial_Men_s_Watc.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635060/products/Omega_De_Ville_Automatic_Men_s_Watch_Lacquered_Blue_dial_Si_Omega_De_Ville_Automatic_Men_s_Watch_2856_01.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635060/products/Omega_De_Ville_Automatic_Women_s_Watch_Model_Omega_De_Ville_Omega_De_Ville_Automatic_Women_s_Watch_Model_9995.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635060/products/Omega_Men_s_3212_80_00_Speedmaster_Date_Automatic_Chronomete_Quality_Swiss_Automatic_movement_Functions_without_a_batter_Omega_Men_s_3212_80_00_Speedmaster_Date_Automatic_Chronomete.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635055/products/Omega_Constellation_Champagne_Diamond_Dial_Steel_and_18kt_Ye_Omega_Constellation_Champagne_Diamond_Dial_Steel_and_18kt_Ye_9405.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635055/products/Omega_Black_dial_Silver-tone_stainless_steel_case_with_a_si_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_5760.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635055/products/Omega_Black_dial_Silver-tone_stainless_steel_case_with_a_si_Black_dial_Silver-tone_stainless_steel_case_with_a_silver-t_5760.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635055/products/Omega_Constellation_Chronometer_Automatic_Mens_Watch_123_20_Brand_Seller_or_Collection_Name_Omega_Model_number_123_20_Omega_Constellation_Chronometer_Automatic_Mens_Watch_123_20.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635049/products/OMEGA_Seamaster_Aqua_Terra_gray_dial_Co-Axial_automatic_wind_OMEGA_Seamaster_Aqua_Terra_gray_dial_Co-Axial_automatic_wind_8988.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635048/products/OLEVS_Womens_Watches_Diamond_Luxury_Dress_Gold_Wrist_Watch_S_OLEVS_Womens_Watches_Diamond_Luxury_Dress_Gold_Wrist_Watch_S_39_77.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634969/products/New_OPPO_Watch_2_Detective_Conan_Special_Edition_42mm_46mm_E_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_New_OPPO_Watch_2_Detective_Conan_Special_Edition_42mm_46mm_E.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634917/products/NOVE_Modena_500_Swiss_Made_Automatic_Chronograph_for_Men_W_Crafted_with_precision_and_Swiss_expertise_the_Modena_500_i_NOVE_Modena_500_Swiss_Made_Automatic_Chronograph_for_Men_W.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634917/products/NOVE_Modena_500_Swiss_Made_Automatic_Chronograph_for_Men_W_Crafted_with_precision_and_Swiss_expertise_the_Modena_500_i_NOVE_Modena_500_Swiss_Made_Automatic_Chronograph_for_Men_W.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634902/products/Movado_Women_s_BOLD_Bangles_Stainless_Steel_Watch_with_Sunra_Movado_Women_s_BOLD_Bangles_Stainless_Steel_Watch_with_Sunra_239_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634900/products/Movado_Women_s_Esperanza_Gold-Plated_Stainless-Steel_Swiss_W_Movado_Women_s_Esperanza_Gold-Plated_Stainless-Steel_Swiss_W_489_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634892/products/Movado_Bold_Access_Women_s_Stainless_Steel_Watch_Movado_BOLD_Movado_Bold_Access_Women_s_Stainless_Steel_Watch_595.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634892/products/Movado_Esperanza_Yellow_Stainless_Steel_Case_White_Dial_S_Movado_Esperanza_Yellow_Stainless_Steel_Case_White_Dial_S_2195.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634855/products/Mini_SE_With_3-Axis_Gimbal_2_7K_Camera_4k_HD_Video_Transmiss_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Mini_SE_With_3-Axis_Gimbal_2_7K_Camera_4k_HD_Video_Transmiss.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634847/products/Michael_Kors_Lexington_Men_s_Watch_Stainless_Steel_Bracelet_Michael_Kors_Lexington_Men_s_Watch_Stainless_Steel_Bracelet_118.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634847/products/Mens_Watch_Ultra-Thin_Digital_Sports_Watch_YUINK_Ultra_Thin_Mens_Watch_Ultra-Thin_Digital_Sports_Watch_24_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634679/products/Light_Jewelry_Luxury_moissanite_Diamond_Iced_Out_G_Light_Jew_Light_Jewelry_Luxury_moissanite_Diamond_Iced_Out_G_43992_58.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634538/products/Hublot_King_Power_Unico_King_Gold_White_Pave_Watch_701_OE_01_Brand_Seller_or_Collection_Name_Hublot_Clasp_Deployment_Cl_Hublot_King_Power_Unico_King_Gold_White_Pave_Watch_701_OE_01.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634537/products/Hublot_Classic_Fusion_542_CM_1771_RX_Titanium_Ceramic_Auto_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Hublot_Classic_Fusion_542_CM_1771_RX_Titanium_Ceramic_Auto.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634327/products/Hamilton_Watch_Jazzmaster_Open_Heart_Lady_Swiss_Automatic_Wa_Hamilton_Watch_Jazzmaster_Open_Heart_Lady_Swiss_Automatic_Wa_2335.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634302/products/Gucci_G-rame_Quartz_Green_Red_and_Blue_Dial_Ladies_Watch_YA_Gucci_G-rame_Quartz_Green_Red_and_Blue_Dial_Ladies_Watch_YA_728_21.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634271/products/Global_Version_2021_New_Amazfit_GTS_3_GTS3_GTS-3_Zepp_OS_spo_Global_Version_2021_New_Amazfit_GTS_3_GTS3_GTS-3_Zepp_OS_spo_175.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634270/products/Global_Version_Xiaomi_Mi_Watch_S1_Active_Smart_Watch_GPS_470_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Global_Version_Xiaomi_Mi_Watch_S1_Active_Smart_Watch_GPS_470.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634270/products/Global_Version_Xiaomi_Mi_Watch_S1_Active_Smart_Watch_GPS_470_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Global_Version_Xiaomi_Mi_Watch_S1_Active_Smart_Watch_GPS_470.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634251/products/Garmin_Approach_S60_Premium_GPS_Golf_Watch_with_Touchscreen_Garmin_Approach_S60_Premium_GPS_Golf_Watch_with_Touchscreen_319_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634250/products/Garmin_010-02626-10_Instinct_2_Rugged_Outdoor_Watch_with_GP_Garmin_010-02626-10_Instinct_2_Rugged_Outdoor_Watch_with_GP_198_85.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634250/products/Garmin_010-02626-10_Instinct_2_Rugged_Outdoor_Watch_with_GP_Garmin_010-02626-10_Instinct_2_Rugged_Outdoor_Watch_with_GP_198_85.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634217/products/Fossil_Grant_Men_s_Watch_with_Chronograph_Display_and_Genuin_Fossil_Grant_Men_s_Watch_with_Chronograph_Display_and_Genuin_78_18.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634088/products/Executive_Skeleton_Tourbillon_Tourbillon_Men_s_Watch_1713-13_Executive_Skeleton_Tourbillon_Tourbillon_Men_s_Watch_1713-13_38000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634076/products/Emporio_Armani_Men_s_Chronograph_Watch_This_product_includes_Emporio_Armani_Men_s_Chronograph_Watch_325.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634056/products/Diesel_Mr_Daddy_2_0_Men_s_Watch_with_Oversized_Chronograph_Bold_ironic_and_never_shy_Diesel_doesn_t_follow_trends_it_Diesel_Mr_Daddy_2_0_Men_s_Watch_with_Oversized_Chronograph.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633998/products/Diesel_Double_Down_Men_s_Watch_with_Silicone_Band_Bold_iron_Diesel_Double_Down_Men_s_Watch_with_Silicone_Band_122_3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633998/products/Diesel_Double_Down_Men_s_Watch_with_Silicone_Band_Bold_iron_Diesel_Double_Down_Men_s_Watch_with_Silicone_Band_122_3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633945/products/Custom_Mens_Women_Watches_Iced_Out_Luxury_Fashion_Bling_Dial_Custom_Mens_Women_Watches_Iced_Out_Luxury_Fashion_Bling_Dial_4125.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633915/products/Citizen_Men_s_Eco-Drive_Weekender_Sport_Casual_Chronograph_R_Citizen_Men_s_Eco-Drive_Weekender_Sport_Casual_Chronograph_R_224.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Christian_Van_Sant_Men_s_CV0144_Cyclone_Automatic_Analog_Dis_Christian_Van_Sant_Men_s_CV0144_Cyclone_Automatic_Analog_Dis_323.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Christian_Van_Sant_Men_s_CV0144_Cyclone_Automatic_Analog_Dis_Christian_Van_Sant_Men_s_CV0144_Cyclone_Automatic_Analog_Dis_323.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633911/products/Chopard_Happy_Sport_Edition_2_Ladies_Rose_Gold_Diamond_Watch_Chopard_Happy_Sport_Edition_2_Ladies_Rose_Gold_Diamond_Watch_9500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633846/products/Chanel_Black_Code_Coco_Black_Diamond_Dial_Ladies_Steel_and_C_Chanel_Black_Code_Coco_Black_Diamond_Dial_Ladies_Steel_and_C_5472.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633835/products/Casio_Men_s_G-Shock_Quartz_Resin_Sport_Watch_With_full_200_Casio_Men_s_G-Shock_Quartz_Resin_Sport_Watch_49_98.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633832/products/Cartier_Ballon_Bleu_De_Cartier_Guilloche_Dial_Automatic_Men_Cartier_Ballon_Bleu_De_Cartier_Guilloche_Dial_Automatic_Men_12300.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633824/products/Buy_Bezel_In_White_Gold_Stainless_Steel_Date_Roman_Buy_Bezel_Buy_Bezel_In_White_Gold_Stainless_Steel_Date_Roman_49866_58.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633279/products/Breitling_Superocean_Heritage_II_Chronograph_Automatic_Black_Breitling_Superocean_Heritage_II_Chronograph_Automatic_Black_5949.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633279/products/Breitling_Suprocean_Heritage_II_Black_Rose_Gold_Breitling_Ca_Breitling_Suprocean_Heritage_II_Black_Rose_Gold_Breitling_Ca_5600.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633279/products/Breitling_Men_s_VB5510H2BE45RD_Analog_Display_Quartz_Black_W_Breitling_Men_s_VB5510H2BE45RD_Analog_Display_Quartz_Black_W_8950.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633279/products/Breitling_Navitimer_1_B01_Chronograph_43_Luxury_Men_s_Watch_Breitling_Navitimer_1_B01_Chronograph_43_Luxury_Men_s_Watch_9299.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633066/products/Apple_Watch_Series_9_GPS_41mm_Smartwatch_with_Silver_Alumi_CARBON_NEUTRAL_An_aluminum_Apple_Watch_Series_9_paired_wit_Apple_Watch_Series_9_GPS_41mm_Smartwatch_with_Silver_Alumi.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633057/products/Alpina_Men_s_Swiss_Automatic_Heritage_Seastrong_Diver_Black_Alpina_Men_s_Swiss_Automatic_Heritage_Seastrong_Diver_Black_1001_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633054/products/Alpina_Men_s_AL-525NS5AQ6_Alpiner_4_Analog_Display_Automatic_Alpina_Men_s_AL-525NS5AQ6_Alpiner_4_Analog_Display_Automatic_1495.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633005/products/AOLED_Touch_Screen_3G_Wifi_KW99_Smartwatch_Android_Smart_Wat_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_AOLED_Touch_Screen_3G_Wifi_KW99_Smartwatch_Android_Smart_Wat.png",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632159/products/18kt_Solid_Rose_Gold_Vanguard_Skeleton_7_Days_Power_Reserve_18kt_Solid_Rose_Gold_Vanguard_Skeleton_7_Days_Power_Reserve_45000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632134/products/10_00_Carat_Handcrafted_Finger_Ring_Zircon_is_highly_recomme_Zircon_is_highly_recommended_for_people_who_want_peace_in_th_10_00_Carat_Handcrafted_Finger_Ring.jpg",
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
              <div className="shoes-kicker">WATCHES</div>
              <h1 className="shoes-hero-title">Authentic watches from the best brands.</h1>
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