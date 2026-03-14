import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Electronics.png";

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

/* Electronics product URLs provided by you */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121424/products/smart_home_display_cabinets_smart_home_showcase_easy_to_car_smart_home_display_cabinets_smart_home_showcase_easy_to_car_1261.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121478/products/temi_V3_smart_robot_for_restaurant_hotel_nursing_home_office_temi_V3_smart_robot_for_restaurant_hotel_nursing_home_office_4398_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121559/products/wholesale_Fast_shipping_D1JI_Mini_2_fly_more_combo_drone_wit_wholesale_Fast_shipping_D1JI_Mini_2_fly_more_combo_drone_wit_643_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121349/products/original_Used_mobile_phone_cheap_unlock_cellphone_for_redmi_original_Used_mobile_phone_cheap_unlock_cellphone_for_redmi_203_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121349/products/original_Used_mobile_phone_cheap_unlock_cellphone_for_redmi_original_Used_mobile_phone_cheap_unlock_cellphone_for_redmi_203_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121311/products/new_factory_sale16gb_512gb_mobile_phones_4g_5g_oppo_reno_7_p_new_factory_sale16gb_512gb_mobile_phones_4g_5g_oppo_reno_7_p_213_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121275/products/mini_laptop_pc_personal_computer_15_6_Inch_Intel_quad-core_p_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_mini_laptop_pc_personal_computer_15_6_Inch_Intel_quad-core_p.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121272/products/miniPro_China_follow_electric_balance_scooter_mope_miniPro_C_miniPro_China_follow_electric_balance_scooter_mope_389_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121234/products/medical_supplies_high_concentration_oxygen_concentrator_medi_medical_supplies_high_concentration_oxygen_concentrator_1430.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121190/products/luxurious_home_office_desk_Modern_design_computer_desks_gami_luxurious_home_office_desk_Modern_design_computer_desks_gami_462_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121101/products/YPOO_52CM_Large_running_belt_electronic_home_tread_YPOO_52CM_YPOO_52CM_Large_running_belt_electronic_home_tread_361_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121073/products/Xiaomi_Redmi_9C_global_version_mobile_Mi_cellphone_5000mAh_1_Xiaomi_Redmi_9C_global_version_mobile_Mi_cellphone_5000mAh_1_119_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121066/products/Xiaomi_Mijia_Smart_Door_Lock_Pro_1080P_Camera_Fingerprint_Pa_Xiaomi_Mijia_Smart_Door_Lock_Pro_1080P_Camera_Fingerprint_Pa_284_88.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121058/products/Xiaomi_Mi_11_5G_Mobile_Phones_128GB_256GB_NFC_Cellphone_6_81_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Xiaomi_Mi_11_5G_Mobile_Phones_128GB_256GB_NFC_Cellphone_6_81.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121025/products/XJB36_Kitchen_appliance_household_integrated_cooker_hood_and_XJB36_Kitchen_appliance_household_integrated_cooker_hood_and_1430.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121014/products/XGIMI_H3_full_HD_1080P_smart_projector_with_1900_ANSI_lumens_XGIMI_H3_full_HD_1080P_smart_projector_with_1900_ANSI_lumens_836.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120989/products/World_Premiere_Oukitel_WP19_Rugged_Smartphone_21000mAh_8G_2_World_Premiere_Oukitel_WP19_Rugged_Smartphone_21000mAh_8G_2_316_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120711/products/Window_cleaner_electric_glass_limpiacristales_remote_control_Window_cleaner_electric_glass_limpiacristales_remote_control_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120708/products/Window_Air_Conditioner_Window_Type_Air_Conditioner_Home_Appl_Window_Air_Conditioner_Window_Type_Air_Conditioner_Home_Appl_647_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120702/products/Wifi_FPV_4K_HD_Camera_Two-Axis_Anti-Shake_Gimbal_Brushless_Q_Wifi_FPV_4K_HD_Camera_Two-Axis_Anti-Shake_Gimbal_Brushless_Q_166_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120692/products/Wholesales_boneng_electric_appliance_belt_drive_ebike_72v150_Wholesales_boneng_electric_appliance_belt_drive_ebike_72v150_1573.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120689/products/Wholesales_New_style_modern_light_luxury_table_lamp_living_r_Wholesales_New_style_modern_light_luxury_table_lamp_living_r_121.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120664/products/Wholesales_14_15_6_inch_i7_Laptop_With_Core_I3I5I7_wholesale_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Wholesales_14_15_6_inch_i7_Laptop_With_Core_I3I5I7_wholesale.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120659/products/Wholesale_original_second-hand_used_7D_single_body_HD_camcor_Wholesale_original_second-hand_used_7D_single_body_HD_camcor_295_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120654/products/Wholesale_original_second-hand_used_60D_single_body_high-def_Wholesale_original_second-hand_used_60D_single_body_high-def_438_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120627/products/Wholesale_led_tv_100_inch_smart_tv_for_sale_Wholesale_led_tv_Wholesale_led_tv_100_inch_smart_tv_for_sale_4745.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120623/products/Wholesale_laptops_15_6_Inch_6G12G_Intel_UHD_Graphics_laptops_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Wholesale_laptops_15_6_Inch_6G12G_Intel_UHD_Graphics_laptops.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120613/products/Wholesale_home_appliance_touch-screen_fully_automatic_coffee_Wholesale_home_appliance_touch-screen_fully_automatic_coffee_415_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120528/products/Wholesale_Xiaomi_Mi_11_Ultra_5G_8_256GB_Original_Snapdragon_Wholesale_Xiaomi_Mi_11_Ultra_5G_8_256GB_Original_Snapdragon_548_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120503/products/Wholesale_Phone_128gb_7_8_Plus_X_Xr_Xs_11_12_13_14_Pro_Max_F_Wholesale_Phone_128gb_7_8_Plus_X_Xr_Xs_11_12_13_14_Pro_Max_F_142_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120425/products/Wholesale_Global_Version_Oukitel_WP17_Smartphone_8GB_128GB_6_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Wholesale_Global_Version_Oukitel_WP17_Smartphone_8GB_128GB_6.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120387/products/Wholesale_Factory_Price_Original_Brand_P50PRO_Sealed_Box_Un_Wholesale_Factory_Price_Original_Brand_P50PRO_Sealed_Box_Un_147_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120342/products/Wholesale_Cheap_Prices_For_iphone_SE_Used_Unlocked_Mobile_Av_Wholesale_Cheap_Prices_For_iphone_SE_Used_Unlocked_Mobile_Av_210.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120275/products/Well_made_good_products_specially_provided_for_solar_inverte_Well_made_good_products_specially_provided_for_solar_inverte_731_6.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120253/products/Water_heater_price_for_shower_electrical_storage_blue_enamel_Water_heater_price_for_shower_electrical_storage_blue_enamel_513_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120244/products/Wall_Mount_43_WIFI_RJ45_Quad_Core_4G_LTE_Tablet_43_inch_RAM_Wall_Mount_43_WIFI_RJ45_Quad_Core_4G_LTE_Tablet_43_inch_RAM_708_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120234/products/WXFL-032_Living_room_Luxury_Silver_Modern_Crushed_Dia_mond_F_WXFL-032_Living_room_Luxury_Silver_Modern_Crushed_Dia_mond_F_66.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120221/products/Valdus_S105_GPS_UAV_30_minutes_battery_life_1_2km_long_range_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Valdus_S105_GPS_UAV_30_minutes_battery_life_1_2km_long_range.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120219/products/Used_Refurbished_In_Stock_DJI_Mavic_Air_2_2S_fly_more_combo_Used_Refurbished_In_Stock_DJI_Mavic_Air_2_2S_fly_more_combo_1688_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120211/products/Used_Laptops_For_Sale_X230_Dual_Core_I5_3th_Gen_12_5_Light_T_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Used_Laptops_For_Sale_X230_Dual_Core_I5_3th_Gen_12_5_Light_T.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120205/products/Unlocked_Wholesale_Cheap_Original_Used_Cell_Phones_for_5s_6_Unlocked_Wholesale_Cheap_Original_Used_Cell_Phones_for_5s_6_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120183/products/Ultrasound_Scanner_Price_Medical_Ultrasound_Instruments_BW_P_Ultrasound_Scanner_Price_Medical_Ultrasound_Instruments_BW_P_6954.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120158/products/UV_phototherapy_311nm_narrow_band_UVB_lamps_phototherapy_mac_UV_phototherapy_311nm_narrow_band_UVB_lamps_phototherapy_mac_487_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120102/products/Top_Selling_Products_Floor_Cleaning_Robot_Low_Noise_Home_App_Top_Selling_Products_Floor_Cleaning_Robot_Low_Noise_Home_App_105_59.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120003/products/TGW_lpr_camera_license_plate_recognition_with_hardware_LED_d_TGW_lpr_camera_license_plate_recognition_with_hardware_LED_d_385.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119998/products/TAP_New_Professional_Cardio_Gym_Equipment_Electric_Commercia_TAP_New_Professional_Cardio_Gym_Equipment_Electric_Commercia_845_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119863/products/Special_Wholesale_OPPO_Reno_7_Pro_Cellphone_8GB_256GB12GB_25_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Special_Wholesale_OPPO_Reno_7_Pro_Cellphone_8GB_256GB12GB_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119830/products/Smart_Projection_Screen_Handwriting_Touch_Conference_Live_Lc_Smart_Projection_Screen_Handwriting_Touch_Conference_Live_Lc_3346_79.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119826/products/Smart_Mobile_Phone_Global_ROM_4GB_of_RAM_64GB_of_ROM_MTK_Hel_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Smart_Mobile_Phone_Global_ROM_4GB_of_RAM_64GB_of_ROM_MTK_Hel.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119824/products/Smart_Household_Appliances_Modern_Black_Durable_Glass_Built-_Smart_Household_Appliances_Modern_Black_Durable_Glass_Built-_1320.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119822/products/Smart_Home_Control_Panel_Tuya_Zigbee_Touch_Screen_8_Inch_Mul_Smart_Home_Control_Panel_Tuya_Zigbee_Touch_Screen_8_Inch_Mul_323_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119818/products/Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_575.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119816/products/Smad_65L_Built-in_Household_Electric_High_Quality_Pizza_Bake_Smad_65L_Built-in_Household_Electric_High_Quality_Pizza_Bake_293_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119802/products/Shenzhen_Smart_Watch_quality_control_inspection_QA_QC_check_Shenzhen_Smart_Watch_quality_control_inspection_QA_QC_check_201_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119785/products/Salable_AE3_MAX_Drohne_GPS_4K_Camera_3-Axis_Gimbal_Anti-shak_Salable_AE3_MAX_Drohne_GPS_4K_Camera_3-Axis_Gimbal_Anti-shak_161_76.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119768/products/SNBC_BVM-R2000_Guaranteed_Quality_Vending_Machine_For_Medici_SNBC_BVM-R2000_Guaranteed_Quality_Vending_Machine_For_Medici_8800.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119777/products/SQ8_style_rear_diffuser_with_exhaust_pipes_fit_Audi_Q8_PP_au_SQ8_style_rear_diffuser_with_exhaust_pipes_fit_Audi_Q8_PP_au_570_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119755/products/SG906_MAX1_Professional_4K_Camera_Drone_GPS_with_3_Axis_Gimb_SG906_MAX1_Professional_4K_Camera_Drone_GPS_with_3_Axis_Gimb_203_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119759/products/SG906_MAX2_BEST_3E_Camera_Drone_4K_Professional_GPS_4KM_EIS_SG906_MAX2_BEST_3E_Camera_Drone_4K_Professional_GPS_4KM_EIS_217_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119762/products/SIBOASI_Training_Speed_Reaction_Light_for_Improved_Speed_Rea_SIBOASI_Training_Speed_Reaction_Light_for_Improved_Speed_Rea_264.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119766/products/SM-MR30_380V_Mid_Rise_Scissor_Car_Lift_SM-MR30_380V_Mid_Rise_SM-MR30_380V_Mid_Rise_Scissor_Car_Lift_1249_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119704/products/Rokid_Air_AR_Smart_Glasses_120_Screen_with_1080P_OLED_Foldab_Rokid_Air_AR_Smart_Glasses_120_Screen_with_1080P_OLED_Foldab_438_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119727/products/Running_Latest_Top_Quality_Daily_Youth_Office_No_Installment_Running_Latest_Top_Quality_Daily_Youth_Office_No_Installment_558_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119689/products/Restaurant_2_5Kw_4_Burner_Stove_Cooker_Kitchen_Electric_Cera_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Restaurant_2_5Kw_4_Burner_Stove_Cooker_Kitchen_Electric_Cera.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119510/products/Public_electric_freestanding_water_dispensers_with_hot_and_c_Public_electric_freestanding_water_dispensers_with_hot_and_c_2259_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119507/products/Promotion_price_good_quality_home_appliances_220v_50hz_12000_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Promotion_price_good_quality_home_appliances_220v_50hz_12000.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119500/products/Professional_home_use_SUPER_4k_DIGITAL_VIDEO_CAMERA_with_3_0_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Professional_home_use_SUPER_4k_DIGITAL_VIDEO_CAMERA_with_3_0.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119470/products/Professional_Commercial_Kitchen_Equipment_Industrial_Electri_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Professional_Commercial_Kitchen_Equipment_Industrial_Electri.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119412/products/Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_Postmodern_Metal_Wrought_Iron_Bedside_Table_Lamp_Personality_97_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119408/products/Portable_Household_Appliance_unique_supplier_kitchen_stove_e_Portable_Household_Appliance_unique_supplier_kitchen_stove_e_990_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119389/products/Popular_classic_4g_volte_feature_bar_phones_slim_metal_body_Popular_classic_4g_volte_feature_bar_phones_slim_metal_body_175.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119395/products/Portable_Excellent_Medical_Equipment_China_Digital_Hearing_A_Portable_Excellent_Medical_Equipment_China_Digital_Hearing_A_188_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119382/products/Popular_Smart_Watch_For_Children_Fashion_Smart_Watch_Popular_Popular_Smart_Watch_For_Children_Fashion_Smart_Watch_207.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119382/products/Popular_Smart_Watch_For_Children_Fashion_Smart_Watch_Popular_Popular_Smart_Watch_For_Children_Fashion_Smart_Watch_207.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119361/products/Phone_13_pro_max_6_7_inch_Original_Full_Screen_WIFI_BT_FM_GP_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Phone_13_pro_max_6_7_inch_Original_Full_Screen_WIFI_BT_FM_GP.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119326/products/Parking_Lots_System_AnprAlpr_Camera_Radar_Measure_Motor_Vehi_Parking_Lots_System_AnprAlpr_Camera_Radar_Measure_Motor_Vehi_480.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119265/products/Outdoor_portable_power_station_2000W_for_EV_auto_car_Electri_Outdoor_portable_power_station_2000W_for_EV_auto_car_Electri_968.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119244/products/Original_second-hand_used_brand_D90_HD_camcorder_digital_SLR_Original_second-hand_used_brand_D90_HD_camcorder_digital_SLR_149_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119200/products/Original_Smartphone_S22_Ultra_7_3_inch_Full_Screen_16_512GB_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Original_Smartphone_S22_Ultra_7_3_inch_Full_Screen_16_512GB.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119195/products/Original_SOYES_XS12_Mini_Smartphone_2GB_32GB_Android_Mobile_Original_SOYES_XS12_Mini_Smartphone_2GB_32GB_Android_Mobile_199_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119188/products/Original_Pre-owned_brand_FE24-704_ZA_OSS_T_image-proof_micro_Original_Pre-owned_brand_FE24-704_ZA_OSS_T_image-proof_micro_590_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119151/products/Original_Hik_DS-2CD2083G2-IU_Replace_DS-2CD2083G0-I_8MP_POE_Original_Hik_DS-2CD2083G2-IU_Replace_DS-2CD2083G0-I_8MP_POE_123_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119111/products/Official_UMIDIGI_BISON_GT2_Pro_5G_Smartphone_8GB_256GB_AI_ce_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Official_UMIDIGI_BISON_GT2_Pro_5G_Smartphone_8GB_256GB_AI_ce.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119013/products/OEM_ODM_multi-functional_smart_air_fresh_smart_home_air_puri_OEM_ODM_multi-functional_smart_air_fresh_smart_home_air_puri_382_8.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119000/products/OEM_Laptops_Notebook_15_6inch_8_16_20_GB_RAM_SSD_128_256_512_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_OEM_Laptops_Notebook_15_6inch_8_16_20_GB_RAM_SSD_128_256_512.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118920/products/Nordic_wooden_living_room_bedroom_sofa_vertical_lamp_high_qu_Nordic_wooden_living_room_bedroom_sofa_vertical_lamp_high_qu_86_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118925/products/Novel_DM2_Automatic_Recharge_Gardening_Appliances_3_Razor_Bl_Novel_DM2_Automatic_Recharge_Gardening_Appliances_3_Razor_Bl_374.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118918/products/Nordic_elegant_new_desk_lamp_K9_crystal_living_room_beside_t_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_170_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118913/products/Nordic_design_building_middle_building_hotel_hotel_lobby_clu_Nordic_design_building_middle_building_hotel_hotel_lobby_clu_75_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118872/products/Nibu_Commercial_Kitchen_Appliances_Fruit_Ice_Smoothies_Maker_Nibu_Commercial_Kitchen_Appliances_Fruit_Ice_Smoothies_Maker_325.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118869/products/Newly_bid_magic_Camera_Design_Pocket_Cinema_Camera_6K_Pro_Newly_bid_magic_Camera_Design_Pocket_Cinema_Camera_6K_Pro_1300.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118864/products/Newly_Designed_Nordic_Modern_Standing_Bedroom_Bedside_Decor_Newly_Designed_Nordic_Modern_Standing_Bedroom_Bedside_Decor_114_88.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118863/products/Newest_style_Kitchen_appliances_lazy_person_multifunction_co_Newest_style_Kitchen_appliances_lazy_person_multifunction_co_594.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118815/products/New_cross-border_spot_P60pro_perforated_large_screen_7_8_inc_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_New_cross-border_spot_P60pro_perforated_large_screen_7_8_inc.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118840/products/Newest_CHUWI_GemiBook_Pro_14_inch_Notebook_16GB_512GB_Intel_Newest_CHUWI_GemiBook_Pro_14_inch_Notebook_16GB_512GB_Intel_442_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118806/products/New_arrival_trendy_bios_book_laptop_notebook_computer_waterp_New_arrival_trendy_bios_book_laptop_notebook_computer_waterp_242.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118786/products/New_arrival_Hisense_large_size_screen_65inch_Smart_tv_androi_New_arrival_Hisense_large_size_screen_65inch_Smart_tv_androi_243_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118715/products/New_Slim_15_6_Inch_cheap_Laptop_Slim_laptop_for_student_gami_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_New_Slim_15_6_Inch_cheap_Laptop_Slim_laptop_for_student_gami.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118720/products/New_Style_13MP_Camera_10_Inch_Tablet_Large_Screen_Fixed_Tele_New_Style_13MP_Camera_10_Inch_Tablet_Large_Screen_Fixed_Tele_299_2.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118658/products/New_Outdoor_Attendance_High_Resolution_Infrared_Imaging_Indu_New_Outdoor_Attendance_High_Resolution_Infrared_Imaging_Indu_1330_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118550/products/New_Designs_Commercial_Coffee_Machine_Electric_Appliance_New_New_Designs_Commercial_Coffee_Machine_Electric_Appliance_562_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118491/products/New_Arrival_smart_home_high_Quality_Custom_Portable_2_In_1_T_New_Arrival_smart_home_high_Quality_Custom_Portable_2_In_1_T_456_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118107/products/Mini_SE_With_3-Axis_Gimbal_2_7K_Camera_4k_HD_Video_Transmiss_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Mini_SE_With_3-Axis_Gimbal_2_7K_Camera_4k_HD_Video_Transmiss.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118080/products/Micro_Power_Consumption_2MP_1080P_48W_4PCS_Solar_Panel_Sim_C_Micro_Power_Consumption_2MP_1080P_48W_4PCS_Solar_Panel_Sim_C_196_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118100/products/Mini_Air_Conditioner_Cooler_Portable_5000Btu_Led_Light_House_Mini_Air_Conditioner_Cooler_Portable_5000Btu_Led_Light_House_140_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117867/products/Manufacturers_provide_portable_digital_camera_with_video_fun_Manufacturers_provide_portable_digital_camera_with_video_fun_1220_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117847/products/Manufacturer_90cm_Multi_Function_Electric_Wall_Oven_Bakery_O_Manufacturer_90cm_Multi_Function_Electric_Wall_Oven_Bakery_O_310_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117558/products/MEEGOPAD_Win7810_Cheap_Laptop_Computer_Core_i7_13_3inch_Inte_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_MEEGOPAD_Win7810_Cheap_Laptop_Computer_Core_i7_13_3inch_Inte.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117550/products/MDRF375_Home_Appliances_Double_Door_Bottom_Freezer_Refrigera_MDRF375_Home_Appliances_Double_Door_Bottom_Freezer_Refrigera_276.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117546/products/MDRF375_300L_Manufacturers_Home_Appliance_Eletronic_Refriger_MDRF375_300L_Manufacturers_Home_Appliance_Eletronic_Refriger_253.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117530/products/MAX_4G_GPS_WIFI_2_88_Inch_Touch_Screen_Dual_Camera_Gaming_Si_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_MAX_4G_GPS_WIFI_2_88_Inch_Touch_Screen_Dual_Camera_Gaming_Si.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117505/products/M10_Plus_12Gb_512Gb_7_2_Inch_New_Original_Unlocked_Game_Cell_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_M10_Plus_12Gb_512Gb_7_2_Inch_New_Original_Unlocked_Game_Cell.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117494/products/Lydsto_H4_Smart_Vacuum_Cleaner_germany_robot_vacuum_cleaner_Lydsto_H4_Smart_Vacuum_Cleaner_germany_robot_vacuum_cleaner_318_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117446/products/Luxury_golden_color_popular_table_lamp_for_Hotel_Villa_lamp_Luxury_golden_color_popular_table_lamp_for_Hotel_Villa_lamp_151_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117443/products/Luxury_clothing_made_in_Italy_Men_Outdoor_denim_suede_jacket_Luxury_clothing_made_in_Italy_Men_Outdoor_denim_suede_jacket_214_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117195/products/Led_Tv_New_Chinese_32_43_55_65_75_86_100_Inch_Full_Color_Sma_Led_Tv_New_Chinese_32_43_55_65_75_86_100_Inch_Full_Color_Sma_372_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117204/products/LifeSmart_Nature_smart_home_control_panel_automation_control_LifeSmart_Nature_smart_home_control_panel_automation_control_1036_45.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097251/products/LED_Custom_Wholesale_Portable_Desktop_Cosmetic_Smart_Table_M_LED_Custom_Wholesale_Portable_Desktop_Cosmetic_Smart_Table_M_174_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097211/products/Kitchen_robot_automatic_electric_cooker_mixer_chopper_blende_Kitchen_robot_automatic_electric_cooker_mixer_chopper_blende_1168_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097207/products/Kitchen_appliance_commercial_induction_wok_burner_double_ind_Kitchen_appliance_commercial_induction_wok_burner_double_ind_517.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097205/products/Kitchen_Electric_Cooktop_4_6_Burner_Gas_Stove_For_Cooking_Ki_Kitchen_Electric_Cooktop_4_6_Burner_Gas_Stove_For_Cooking_1586.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097197/products/Kitchen_Appliance_Stainless_Steel_Commercial_Wok_Induction_C_Kitchen_Appliance_Stainless_Steel_Commercial_Wok_Induction_C_1950.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097197/products/Kitchen_Appliance_Stainless_Steel_Commercial_Wok_Induction_C_Kitchen_Appliance_Stainless_Steel_Commercial_Wok_Induction_C_1950.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096784/products/IPASON_New_Laptop_P1_Pro_I3_I5_I7_Processor_Intel_I3_1115G4_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_IPASON_New_Laptop_P1_Pro_I3_I5_I7_Processor_Intel_I3_1115G4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096780/products/IP67_waterproof_optional_optic_lens_and_glass_lens_500w_led_IP67_waterproof_optional_optic_lens_and_glass_lens_500w_led_838_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096777/products/IIDA_for_samsung_A10_A20_A30_A40_A50_A70_A51_A21_A12S_A10e_A_IIDA_for_samsung_A10_A20_A30_A40_A50_A70_A51_A21_A12S_A10e_A_360.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096754/products/Household_Hot_Sales_Built-in_90cm_100L_Gas_Electrical_Oven_H_Household_Hot_Sales_Built-in_90cm_100L_Gas_Electrical_Oven_702_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096748/products/Hote_Sale_Global_version_Smartphone_High_quality_S22_mobile_Hote_Sale_Global_version_Smartphone_High_quality_S22_mobile_198.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096523/products/Horno_electrico_Home_major_kitchen_appliances_inbuilt_wall_c_Horno_electrico_Home_major_kitchen_appliances_inbuilt_wall_c_1105.png"
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

/* Build product objects with name and a short description (electronics-focused) */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (
        lower.includes("phone") ||
        lower.includes("mobile") ||
        lower.includes("smartphone") ||
        lower.includes("redmi") ||
        lower.includes("xiaomi") ||
        lower.includes("oppo") ||
        lower.includes("samsung") ||
        lower.includes("5g") ||
        lower.includes("ultra")
      ) {
        return "High-performance mobile & smart devices — latest specs and connectivity.";
      }
      if (lower.includes("laptop") || lower.includes("notebook") || lower.includes("intel") || lower.includes("amd")) {
        return "Powerful laptops & notebooks — built for work and play.";
      }
      if (lower.includes("drone") || lower.includes("gimbal") || lower.includes("camera") || lower.includes("camcorder") || lower.includes("4k") || lower.includes("hd")) {
        return "Cameras & drones — capture moments with pro-grade imaging.";
      }
      if (lower.includes("tv") || lower.includes("led") || lower.includes("projector")) {
        return "Home entertainment — smart TVs and projectors with vivid displays.";
      }
      if (
        lower.includes("appliance") ||
        lower.includes("oven") ||
        lower.includes("refrigerator") ||
        lower.includes("heater") ||
        lower.includes("air") ||
        lower.includes("vacuum") ||
        lower.includes("cleaner") ||
        lower.includes("robot") ||
        lower.includes("kitchen")
      ) {
        return "Home appliances & smart home gadgets — reliable and energy efficient.";
      }
      if (lower.includes("battery") || lower.includes("power") || lower.includes("charger") || lower.includes("ups")) {
        return "Power solutions & chargers — dependable performance and safety.";
      }
      if (lower.includes("gps") || lower.includes("uav") || lower.includes("valdus")) {
        return "Navigation & rugged outdoor devices.";
      }
      return "Quality electronics and gadgets with reliable performance.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Electronics() {
  // Shuffle once on component mount (consistent with other pages)
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

        /* Two columns layout: left and right columns stacked vertically
           IMPORTANT: keep two columns ALWAYS (never collapse to single column).
           On very narrow viewports the grid scrolls horizontally to preserve layout.
        */
        .two-column-vertical {
          display: grid;
          grid-template-columns: 1fr 1fr; /* always two columns */
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Allow horizontal scrolling if the viewport gets very narrow so we never collapse to 1 column */
        @media (max-width: 520px) {
          .two-column-vertical {
            overflow-x: auto;
            padding: 0 12px;
            grid-auto-flow: column;
            grid-auto-columns: minmax(240px, 1fr);
            align-items: start;
          }
        }

        /* Column container holds 4 stacked cards */
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
        {/* Hero Section: background uses the imported Electronics.png asset */}
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
            <h2 className="shoes-category">Electronics</h2>
            <h1 className="shoes-title">Explore Our Collection For Electronics</h1>
            <p className="shoes-subtitle">
              Updated weekly with new flash sales from top electronics brands.
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
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/electronics/${p.id}`}
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

            <div className="column-stack" role="list">
              {rightColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/electronics/${p.id}`}
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
