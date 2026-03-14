import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
import ShoesHero from "../assets/images/dashboard/Commodities.png";

/* Helper: friendly name */
function friendlyNameFromUrl(url) {
  try {
    const parts = url.split("/");
    let name = parts[parts.length - 1] || url;
    name = name.replace(/\.[a-zA-Z0-9]+$/, "");
    name = name.replace(/(_\d+){1,3}$/, "");
    name = name.replace(/[_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (name.length > 70) return name.slice(0, 67) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* Commodities product URLs provided by you */
const productUrls = [
  /* (list unchanged) */
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094428/products/Electric_Mini_Smart_Car_Electric_Four-wheeler_New_Energy_Hom_Electric_Mini_Smart_Car_Electric_Four-wheeler_New_Energy_Hom_3069.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094422/products/Electric_Hot_Water_Boiler_for_Bathroom_Smart_Kitchen_Applian_Electric_Hot_Water_Boiler_for_Bathroom_Smart_Kitchen_Applian_625_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094414/products/Electric_Cooking_Home_Machine_And_Cooking_Pot_Making_Machine_Electric_Cooking_Home_Machine_And_Cooking_Pot_Making_Machine_527_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094418/products/Electric_Flour_Mixer_For_Cuisine_Robot_1500w_Bakery_Dough_Ho_Electric_Flour_Mixer_For_Cuisine_Robot_1500w_Bakery_Dough_Ho_506.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094440/products/Electric_patient_lifts_adjustable_hospital_chair_lifting_hea_Electric_patient_lifts_adjustable_hospital_chair_lifting_hea_541_97.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094436/products/Electric_Stainless_Steel_Wheat_Flour_Milling_Machine_Wet_And_Electric_Stainless_Steel_Wheat_Flour_Milling_Machine_Wet_And_430_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119265/products/Outdoor_portable_power_station_2000W_for_EV_auto_car_Electri_Outdoor_portable_power_station_2000W_for_EV_auto_car_Electri_968.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092967/products/Built-in_electric_ovens_household_oven_pizza_oven_electric_o_Built-in_electric_ovens_household_oven_pizza_oven_electric_o_487_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120711/products/Window_cleaner_electric_glass_limpiacristales_remote_control_Window_cleaner_electric_glass_limpiacristales_remote_control_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091419/products/45L_wholesale_electric_appliance_industrial_pressure_cooker_45L_wholesale_electric_appliance_industrial_pressure_cooker_528.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119470/products/Professional_Commercial_Kitchen_Equipment_Industrial_Electri_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Professional_Commercial_Kitchen_Equipment_Industrial_Electri.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091652/products/65L_Built_In_Electric_Ovens_65L_Built_In_Electric_Ovens_65L_Built_In_Electric_Ovens_286.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117913/products/Medical_Supplies_Wheelchair_Handicapped_Steel_Electric_Wheel_Medical_Supplies_Wheelchair_Handicapped_Steel_Electric_Wheel_360.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120253/products/Water_heater_price_for_shower_electrical_storage_blue_enamel_Water_heater_price_for_shower_electrical_storage_blue_enamel_513_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118362/products/Multifunction_Elderly_Electric_Patient_Handicap_Lifting_Equi_Multifunction_Elderly_Electric_Patient_Handicap_Lifting_Equi_572.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093235/products/Chefmax_Commercial_Intelligent_Automatic_Cooker_Electric_Ene_Chefmax_Commercial_Intelligent_Automatic_Cooker_Electric_Ene_1040.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117226/products/Lightweight_Aluminum_Alloy_Manual_Electric_Power_Wheelchair_Lightweight_Aluminum_Alloy_Manual_Electric_Power_Wheelchair_696.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093012/products/CNTECH_Factory_2600W_Multifunction_Electric_Carpet_Mattress_CNTECH_Factory_2600W_Multifunction_Electric_Carpet_Mattress_239_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096106/products/High_Quality_Electromagnetic_Oven_Electric_Appliance_Inducti_High_Quality_Electromagnetic_Oven_Electric_Appliance_Inducti_1219_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094447/products/Electronic_Adult_Wheelchair_Disability_Electric_Wheelchair_R_Electronic_Adult_Wheelchair_Disability_Electric_Wheelchair_R_364.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118550/products/New_Designs_Commercial_Coffee_Machine_Electric_Appliance_New_New_Designs_Commercial_Coffee_Machine_Electric_Appliance_562_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120692/products/Wholesales_boneng_electric_appliance_belt_drive_ebike_72v150_Wholesales_boneng_electric_appliance_belt_drive_ebike_72v150_1573.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117917/products/Medical_Used_Portable_Electric_Stair_Climbing_Wheelchair_for_Medical_Used_Portable_Electric_Stair_Climbing_Wheelchair_for_3300.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096321/products/High_Thermal_Efficiency_3_Burner_Commercial_Electric_Inducti_High_Thermal_Efficiency_3_Burner_Commercial_Electric_Inducti_618.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089991/products/110V_household_electric_multifunction_smart_food_processor_1_110V_household_electric_multifunction_smart_food_processor_548_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118505/products/New_Carbon_Fiber_Disabled_Powerful_Electric_Automatic_Wheelc_New_Carbon_Fiber_Disabled_Powerful_Electric_Automatic_Wheelc_1155.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117917/products/Medical_Used_Portable_Electric_Stair_Climbing_Wheelchair_for_Medical_Used_Portable_Electric_Stair_Climbing_Wheelchair_for_3300.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117930/products/Medical_health_device_adjustable_foldable_electric_power_wid_Medical_health_device_adjustable_foldable_electric_power_wid_3300.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092550/products/Bathroom_Electric_Toilet_Lift_health_care_supplies_products_Bathroom_Electric_Toilet_Lift_health_care_supplies_products_755_64.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121272/products/miniPro_China_follow_electric_balance_scooter_mope_miniPro_C_miniPro_China_follow_electric_balance_scooter_mope_389_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117933/products/Medical_motorised_wheelchair_with_electric_and_manual_model_Medical_motorised_wheelchair_with_electric_and_manual_model_660.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120493/products/Wholesale_Manufacturer_3_Burner_Electric_Induction_Cooker_Bu_Wholesale_Manufacturer_3_Burner_Electric_Induction_Cooker_Bu_91_3.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094754/products/Factory_Wholesale_Smart_Office_Table_Electric_Desk_Standing_Factory_Wholesale_Smart_Office_Table_Electric_Desk_Standing_435_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092086/products/Aluminum_Alloy_Easy_Folding_Joystick_Controller_Electric_Pow_Aluminum_Alloy_Easy_Folding_Joystick_Controller_Electric_Pow_650.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120455/products/Wholesale_High_Quality_Cheap_Electric_Commercial_Automatic_E_Wholesale_High_Quality_Cheap_Electric_Commercial_Automatic_E_623_75.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121568/products/wholesale_factory_price_electric_central_heating_boiler_floo_wholesale_factory_price_electric_central_heating_boiler_floo_329_45.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121231/products/medical_portable_electric_wheelchair_toilet_move_wheel_nursi_medical_portable_electric_wheelchair_toilet_move_wheel_nursi_754_78.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097211/products/Kitchen_robot_automatic_electric_cooker_mixer_chopper_blende_Kitchen_robot_automatic_electric_cooker_mixer_chopper_blende_1168_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095734/products/Gym_Treadmill_Running_Machine_Foldable_Electric_Walking_Fitn_Gym_Treadmill_Running_Machine_Foldable_Electric_Walking_Fitn_306_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090435/products/2021_new_kitchen_appliances_electric_drum_type_multifunction_2021_new_kitchen_appliances_electric_drum_type_multifunction_2013_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120067/products/Tiansta_380V_15000W_Single_Burner_Induction_Cooktop_Electric_Tiansta_380V_15000W_Single_Burner_Induction_Cooktop_Electric_628_57.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119998/products/TAP_New_Professional_Cardio_Gym_Equipment_Electric_Commercia_TAP_New_Professional_Cardio_Gym_Equipment_Electric_Commercia_845_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091495/products/4_burners_china_induction_cooker_commercial_electric_automat_4_burners_china_induction_cooker_commercial_electric_automat_437_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096592/products/Hot_Sale_Factory_Wholesale_Electric_Powered_Stair_Climbing_C_Hot_Sale_Factory_Wholesale_Electric_Powered_Stair_Climbing_C_845.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093462/products/Commercial_16KW_Customized_Vertical_4_Head_Cooker_Electric_C_Commercial_16KW_Customized_Vertical_4_Head_Cooker_Electric_C_2483.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096268/products/High_Quality_Leg_Lift_Full_Body_Electric_Adjustable_Homecare_High_Quality_Leg_Lift_Full_Body_Electric_Adjustable_Homecare_510.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091710/products/7L_mini_Colorful_Electric_Food_kitchen_home_appliances_stand_7L_mini_Colorful_Electric_Food_kitchen_home_appliances_stand_418.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092515/products/Bakery_Home_Cooking_Appliances_Horno_1_Single_Deck_Electric_Bakery_Home_Cooking_Appliances_Horno_1_Single_Deck_Electric_242.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094136/products/Dayoo_1800w_electric_home_appliances_for_cleaning_handheld_d_Dayoo_1800w_electric_home_appliances_for_cleaning_handheld_d_137_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092966/products/Built-in_Electric_Hob_6_burners_induction_cooktop_Built-in_E_Built-in_Electric_Hob_6_burners_induction_cooktop_825.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120478/products/Wholesale_Highway_4wd_40kmh_Speed_Quick_Charge_Electric_Long_Wholesale_Highway_4wd_40kmh_Speed_Quick_Charge_Electric_Long_247_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094522/products/European_warehouse_IE-B2_electric_bike_Outdoor_Sport_14Inch_European_warehouse_IE-B2_electric_bike_Outdoor_Sport_14Inch_598_13.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091282/products/240v_Wall_Mounted_stainless_steel_Cover_tankless_Electric_Sh_240v_Wall_Mounted_stainless_steel_Cover_tankless_Electric_Sh_317_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091807/products/80l_Built_In_Electric_Multifunction_Oven_digital_timer_contr_80l_Built_In_Electric_Multifunction_Oven_digital_timer_contr_291_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091253/products/20KW_Tankless_Instant_Electric_Water_Heater_for_Shower_Home_20KW_Tankless_Instant_Electric_Water_Heater_for_Shower_Home_312_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119171/products/Original_New_Stock_Electric_Power_Steering_Pump_For_Peugeot_Original_New_Stock_Electric_Power_Steering_Pump_For_Peugeot_192_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117847/products/Manufacturer_90cm_Multi_Function_Electric_Wall_Oven_Bakery_O_Manufacturer_90cm_Multi_Function_Electric_Wall_Oven_Bakery_O_310_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093483/products/Commercial_Pancake_Cake_Making_Non-Stick_Electric_Crepe_Make_Commercial_Pancake_Cake_Making_Non-Stick_Electric_Crepe_Make_289_3.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092961/products/Brewista_Electric_Gooseneck_coffee_Kettle_Pour_Over_Kettle_E_Brewista_Electric_Gooseneck_coffee_Kettle_Pour_Over_Kettle_E_301_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095179/products/Fitness_Home_Sports_Running_Machine_Electric_Health-Mate_Tou_Fitness_Home_Sports_Running_Machine_Electric_Health-Mate_Tou_949_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119510/products/Public_electric_freestanding_water_dispensers_with_hot_and_c_Public_electric_freestanding_water_dispensers_with_hot_and_c_2259_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094655/products/Factory_Price_Dough_Mixer_Home_Appliances_Electric_Hand_Mixe_Factory_Price_Dough_Mixer_Home_Appliances_Electric_Hand_Mixe_280_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091403/products/45L_non-stick_cooker_intelligent_electric_pressure_cooker_ex_45L_non-stick_cooker_intelligent_electric_pressure_cooker_ex_1112_15.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117334/products/Luxury_Electric_Genuine_LeatherHigh_Quality_Luxury_E_Home_Th_Luxury_Electric_Genuine_LeatherHigh_Quality_Luxury_E_Home_Th_1758_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094540/products/FEST_Electric_Beater_for_Cakes_5L_home_appliances_kitchen_Do_FEST_Electric_Beater_for_Cakes_5L_home_appliances_kitchen_Do_220.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119818/products/Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_Smart_Home_1500mm_Single_Side_Openning_Electric_Log_Bio_Etha_575.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090325/products/2021_Boyueda_Beast_High_Speed_S3_5600W_Electric_Scooter_for_2021_Boyueda_Beast_High_Speed_S3_5600W_Electric_Scooter_for_1056.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093031/products/Car_parts_of_auto_steering_system_electric_power_steering_co_Car_parts_of_auto_steering_system_electric_power_steering_co_198.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091976/products/ADO_A20F_500W_folding_electric_bicycle_city_bike_exercise_mo_ADO_A20F_500W_folding_electric_bicycle_city_bike_exercise_mo_648.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119604/products/RUITAI_Professional_4_Range_gas_Stove_Machine_Electric_Gas_C_RUITAI_Professional_4_Range_gas_Stove_Machine_Electric_Gas_C_275.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094401/products/Easy_Cleaned_Stove_And_Oven_Outdoor_Electric_Cooktop_4_Burne_Easy_Cleaned_Stove_And_Oven_Outdoor_Electric_Cooktop_4_Burne_1342.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119816/products/Smad_65L_Built-in_Household_Electric_High_Quality_Pizza_Bake_Smad_65L_Built-in_Household_Electric_High_Quality_Pizza_Bake_293_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089986/products/10L_Induction_fast_heat_safety_and_energy_saving_Electric_wa_10L_Induction_fast_heat_safety_and_energy_saving_Electric_wa_587_64.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096523/products/Horno_electrico_Home_major_kitchen_appliances_inbuilt_wall_c_Horno_electrico_Home_major_kitchen_appliances_inbuilt_wall_c_1105.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091831/products/8kw_single_Phase_wholesale_wall_hang_electric_boiler_for_hea_8kw_single_Phase_wholesale_wall_hang_electric_boiler_for_hea_409_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097205/products/Kitchen_Electric_Cooktop_4_6_Burner_Gas_Stove_For_Cooking_Ki_Kitchen_Electric_Cooktop_4_6_Burner_Gas_Stove_For_Cooking_1586.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095768/products/HOBOT_298_Electric_Windows_Robot_Vacuum_Cleaner_Low_Price_Wi_HOBOT_298_Electric_Windows_Robot_Vacuum_Cleaner_Low_Price_Wi_769_98.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091251/products/20KW_Tankless_Instant_Electric_Water_Heater_380_Volt_50_Hz_C_20KW_Tankless_Instant_Electric_Water_Heater_380_Volt_50_Hz_C_275.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095244/products/Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_Foshan_Electric_built_in_Oven_High_Quality_Built-In_wall_Ove_110.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091698/products/7-speed_electric_mountain_bike_frame_500_750W_48V_fat_tire_7-speed_electric_mountain_bike_frame_500_750W_48V_fat_tire_1077_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096336/products/High_end_mid_drive_motor_ebike_sport_electric_bike_ready_to_High_end_mid_drive_motor_ebike_sport_electric_bike_ready_to_1143_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092077/products/All_In_One_Touch_Turkish_Electric_Turkish_Bean_To_Cup_Brand_All_In_One_Touch_Turkish_Electric_Turkish_Bean_To_Cup_Brand_383_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096529/products/Horus_HR-20_Best_Price_Top_Quality_Blender_Electric_Mixer_Fo_Horus_HR-20_Best_Price_Top_Quality_Blender_Electric_Mixer_Fo_299_27.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096590/products/Hot_Sale_Electrical_Appliances_Home_Office_Automatic_Espress_Hot_Sale_Electrical_Appliances_Home_Office_Automatic_Espress_748.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094561/products/FOTOVO_Electrical_appliances_carrying_rated_power_less_than_FOTOVO_Electrical_appliances_carrying_rated_power_less_than_3250.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094578/products/Factory_Cheap_Price_Quality_Electrical_Kitchen_Appliances_Sl_Factory_Cheap_Price_Quality_Electrical_Kitchen_Appliances_Sl_315_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093002/products/CES_medical_brain_stimulator_electrical_brain_stimulation_to_CES_medical_brain_stimulator_electrical_brain_stimulation_to_130_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117830/products/Magnificent_EcoRider_E7-2_2000W_Golf_Electric_Skateboard_Sco_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Magnificent_EcoRider_E7-2_2000W_Golf_Electric_Skateboard_Sco.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119689/products/Restaurant_2_5Kw_4_Burner_Stove_Cooker_Kitchen_Electric_Cera_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Restaurant_2_5Kw_4_Burner_Stove_Cooker_Kitchen_Electric_Cera.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119117/products/Offroad_electric_scooter_NANROBOT_D4_3_0_Dual_motor_Folding_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_Offroad_electric_scooter_NANROBOT_D4_3_0_Dual_motor_Folding.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096754/products/Household_Hot_Sales_Built-in_90cm_100L_Gas_Electrical_Oven_H_Household_Hot_Sales_Built-in_90cm_100L_Gas_Electrical_Oven_702_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118472/products/New_Arrival_Commercial_Rower_Machines_Use_Rowing_Machine_New_New_Arrival_Commercial_Rower_Machines_Use_Rowing_Machine_228_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092210/products/Automatic_Espresso_Machine_Coffee_Machine_Coffee_Maker_for_O_Automatic_Espresso_Machine_Coffee_Machine_Coffee_Maker_for_O_1419.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094414/products/Electric_Cooking_Home_Machine_And_Cooking_Pot_Making_Machine_Electric_Cooking_Home_Machine_And_Cooking_Pot_Making_Machine_527_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096507/products/Home_training_exercise_sport_machine_Home_training_exercise_Home_training_exercise_sport_machine_880.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091533/products/500L_Herb_Ultrasonic_Extraction_machine_500L_Herb_Ultrasonic_500L_Herb_Ultrasonic_Extraction_machine_16225.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118358/products/Multi-functional_exercise_squats_training_machine_Commercial_Multi-functional_exercise_squats_training_machine_Commercial_1313.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120143/products/Treadmill_fitness_equipment_treadmill_running_machine_sport_Treadmill_fitness_equipment_treadmill_running_machine_sport_782.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093506/products/Commercial_running_track_machine_curved_treadmill_Commercial_Commercial_running_track_machine_curved_treadmill_154_31.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118550/products/New_Designs_Commercial_Coffee_Machine_Electric_Appliance_New_New_Designs_Commercial_Coffee_Machine_Electric_Appliance_562_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090228/products/2020_hot_selling_automatic_bread_proofing_machine_commercial_2020_hot_selling_automatic_bread_proofing_machine_commercial_1560.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095734/products/Gym_Treadmill_Running_Machine_Foldable_Electric_Walking_Fitn_Gym_Treadmill_Running_Machine_Foldable_Electric_Walking_Fitn_306_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093471/products/Commercial_Gym_equipment_Hoist_machine_Seated_Dip_Guarantee_Commercial_Gym_equipment_Hoist_machine_Seated_Dip_Guarantee_764_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096061/products/High-end_Fitness_Equipment_Rear_DeltPec_Fly_Machine_professi_High-end_Fitness_Equipment_Rear_DeltPec_Fly_Machine_professi_561.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119808/products/Single_disc_chassis_13_inch_polishing_cleaning_floor_machine_Single_disc_chassis_13_inch_polishing_cleaning_floor_machine_295.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091292/products/24_hour_automatically_medicine_condom_vending_machine_for_ph_24_hour_automatically_medicine_condom_vending_machine_for_ph_4800.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095989/products/Health_Care_Supplies_Foot_Detox_Machine_Hydrogen_Ion_Massage_Health_Care_Supplies_Foot_Detox_Machine_Hydrogen_Ion_Massage_1100.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094436/products/Electric_Stainless_Steel_Wheat_Flour_Milling_Machine_Wet_And_Electric_Stainless_Steel_Wheat_Flour_Milling_Machine_Wet_And_430_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117486/products/Luxury_table_home_appliance_shop_use_coffee_machine_espresso_Luxury_table_home_appliance_shop_use_coffee_machine_espresso_137_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120134/products/Transfer_Chair_Multi-function_Shift_Machine_Patient_Lift_Mac_Transfer_Chair_Multi-function_Shift_Machine_Patient_Lift_Mac_511_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096683/products/Hot_sale_Professional_Hotel_Office_Sports_Running_Machine_Co_Hot_sale_Professional_Hotel_Office_Sports_Running_Machine_Co_2200.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092630/products/Best_Gym_Smith_Machine_Strength_Training_Cable_Crossover_Tra_Best_Gym_Smith_Machine_Strength_Training_Cable_Crossover_Tra_1313.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096845/products/Indoor_body_building_home_gym_equipment_fitness_machine_exer_Indoor_body_building_home_gym_equipment_fitness_machine_exer_86_9.jpg"
];

/* Shuffle at runtime */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Build product objects and a category-aware description */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (
        lower.includes("electric") ||
        lower.includes("stove") ||
        lower.includes("oven") ||
        lower.includes("induction") ||
        lower.includes("cooktop") ||
        lower.includes("kitchen") ||
        lower.includes("appliance") ||
        lower.includes("cooker") ||
        lower.includes("blender") ||
        lower.includes("mixer") ||
        lower.includes("coffee")
      ) {
        return "Home & commercial appliances — reliable, efficient electrical equipment.";
      }
      if (
        lower.includes("wheelchair") ||
        lower.includes("medical") ||
        lower.includes("patient") ||
        lower.includes("rehabilitation") ||
        lower.includes("ultrasound") ||
        lower.includes("dental")
      ) {
        return "Medical & healthcare equipment — professional-grade solutions.";
      }
      if (
        lower.includes("treadmill") ||
        lower.includes("gym") ||
        lower.includes("fitness") ||
        lower.includes("rowing") ||
        lower.includes("exercise") ||
        lower.includes("spin")
      ) {
        return "Fitness & gym equipment — built for performance and durability.";
      }
      if (lower.includes("bike") || lower.includes("scooter") || lower.includes("ebike") || lower.includes("motor")) {
        return "Personal mobility & electric vehicles — e-bikes, scooters & accessories.";
      }
      if (lower.includes("car") || lower.includes("auto") || lower.includes("engine") || lower.includes("spare") || lower.includes("parts") || lower.includes("bumper")) {
        return "Automotive parts & accessories — OEM-style replacements and upgrades.";
      }
      if (lower.includes("power") || lower.includes("battery") || lower.includes("station") || lower.includes("ups")) {
        return "Power solutions & charging — robust energy systems and stations.";
      }
      return "High quality commodities across appliances, medical, automotive and fitness.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Commodities() {
  // Shuffle once on mount for consistent behavior with other category pages
  const shuffledUrls = useMemo(() => shuffleArray(productUrls), []);
  const products = useMemo(() => productsFromUrls(shuffledUrls), [shuffledUrls]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage, products]);

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
            <h2 className="shoes-category">Commodities</h2>
            <h1 className="shoes-title">Explore Our Collection For Commodities</h1>
            <p className="shoes-subtitle">
              Updated weekly with new arrivals and curated selections.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "10px auto 6px", padding: "0 12px", color: "#071e3d", fontWeight: 700 }}>
          {total} products found.
        </div>

        <div className="shoes-grid-outer" aria-hidden="false">
          <div className="two-column-vertical">
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/commodities/${p.id}`}
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
                  href={`/commodities/${p.id}`}
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
