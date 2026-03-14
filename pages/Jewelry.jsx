import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
import JewelryHero from "../assets/images/dashboard/Jewery.png";

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

/* All Jewelry product URLs provided by you */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300547/products/gorjana_Women_s_Sunset_Necklace_Sunset_Coin_Necklace_Inspire_gorjana_Women_s_Sunset_Necklace_68.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300546/products/Zawadee_11mm_14k_Yellow_Gold_Semi_Solid_Miami_Cuban_Bracelet_Zawadee_11mm_14k_Yellow_Gold_Semi_Solid_Miami_Cuban_Bracelet_5001_06.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300544/products/Vogati_12_00_Cts_Black_Diamond_Jewelry_Set_in_Platinum_This_This_magnificent_Black_Diamond_Jewelry_Set_highlights_a_pair_Vogati_12_00_Cts_Black_Diamond_Jewelry_Set_in_Platinum.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300543/products/Verona_Jewelers_Mens_925_Sterling_Silver_3MM_5_5MM_Franco_Ch_Verona_Jewelers_Men_s_925_Sterling_Silver_Franco_Chain_Neckl_Verona_Jewelers_Mens_925_Sterling_Silver_3MM_5_5MM_Fr.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300542/products/VIR_JEWELS_1_cttw_Diamond_Wedding_Anniversary_Band_for_Women_Exquisite_elegant_1_cttw_princess_diamond_wedding_band_in_1_VIR_JEWELS_1_cttw_Diamond_Wedding_Anniversary_Band_for_Women.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300542/products/VIR_JEWELS_1_cttw_Diamond_Wedding_Anniversary_Band_for_Women_Exquisite_elegant_1_cttw_princess_diamond_wedding_band_in_1_VIR_JEWELS_1_cttw_Diamond_Wedding_Anniversary_Band_for_Women.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300541/products/VIR_JEWELS_1_carat_ctw_Diamond_Wedding_Anniversary_Band_fo_Lovely_elegant_1_cttw_diamond_wedding_band_in_14k_white_gol_VIR_JEWELS_1_carat_ctw_Diamond_Wedding_Anniversary_Band_fo.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300539/products/Urban_Jewelry_Amazing_Stainless_Steel_Men_s_link_Bracelet_Ur_Urban_Jewelry_Amazing_Stainless_Steel_Men_s_link_Bracelet_25_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300538/products/TriJewels_Gemstone_4mm_Women_Eternity_Tennis_Bracelet_14K_Ro_TriJewels_Gemstone_4mm_Women_Eternity_Tennis_Bracelet_14K_Ro_11699.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300537/products/The_World_Jewelry_Center_14k_REAL_Yellow_OR_White_OR_RosePin_This_brilliant_item_is_crafted_from_magnificent_14_karat_gol_The_World_Jewelry_Center_14k_REAL_Yellow_OR_White_OR_RosePin.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300535/products/THELANDA_14k_White_Gold_2_5mm_Petite_Twisted_Vine_Simulated_Made_of_real_14k_white_gold_-_Accented_with_24_round-cut_cl_THELANDA_14k_White_Gold_2_5mm_Petite_Twisted_Vine_Simulated.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300533/products/TGDJ_10k_Yellow_Gold_Miami_Cuban_Chain_Necklace_5_0_mm_Sol_This_gold_chain_necklace_is_made_with_real_10k_yellow_soli_TGDJ_10k_Yellow_Gold_Miami_Cuban_Chain_Necklace_5_0_mm_Sol.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300532/products/Swarovski_Sparking_Dance_Crystal_Necklace_and_Earring_Set_Je_Swarovski_Sparking_Dance_Crystal_Necklace_and_Earring_Set_Je_5725.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300531/products/Swarovski_Millenia_Jewelry_Collection_Green_Octagon_Cut_Cry_Swarovski_Millenia_Jewelry_Collection_Green_Octagon_Cut_Cry_18064.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300529/products/Swarovski_Infinity_Heart_Jewelry_Collection_Link_adoration_i_Swarovski_Infinity_Heart_Jewelry_Collection_10402.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300527/products/Stfery_Womens_Ring_Flower_Rose_Gold_Wedding_Ring_18K_Inlaid_Our_rings_are_made_of_real_gold_and_set_with_shiny_gemstones_Stfery_Womens_Ring_Flower_Rose_Gold_Wedding_Ring_18K_Inlaid.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300528/products/Swarovski_Crystal_Jewelry_Set_Collection_featuring_Necklace_Swarovski_Crystal_Jewelry_Set_Collection_featuring_Necklace_126_62.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300526/products/Special_Pin_Faberge_Style_Material_Pearl_Clasp_type_Butterfl_Special_Pin_Faberge_Style_3520.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300524/products/Solid_14k_White_Gold_Round_Diamond_Bridal_Wedding_Engagement_Solid_14k_White_Gold_Round_Diamond_Bridal_Wedding_Engagement_12400_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300523/products/Solid_14k_White_Gold_3_6_ctw_Natural_Diamond_Full_Eternity_W_This_natural_diamond_full_eternity_ring_handcrafted_in_soli_Solid_14k_White_Gold_3_6_ctw_Natural_Diamond_Full_Eternity_W.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300522/products/Solid_14k_Gold_Heart_Necklace_for_Women_Fine_Gold_Love_Jewe_Solid_14k_Gold_Heart_Necklace_for_Women_Fine_Gold_Love_Jewe_2219.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300521/products/Solid_14K_Yellow_Gold_Princess_Cut_Real_Natural_Diamond_Halo_Introducing_our_stunning_Solid_14K_Yellow_Gold_Princess_Cut_Solid_14K_Yellow_Gold_Princess_Cut_Real_Natural_Diamond_Halo.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300520/products/Silvadore_246mm_CUBAN_Link_Chain_for_Men_Necklace_-_Silver_Silvadore_246mm_CUBAN_Link_Chain_for_Men_Necklace_-_Silver_29_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300518/products/SZUL_AGS_Certified_1_14_Carat_TW_Diamond_Engagement_Ring_in_SZUL_AGS_Certified_1_14_Carat_TW_Diamond_Engagement_Ring_in_1189.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300517/products/SWAROVSKI_Subtle_Bracelet_Jewelry_Collection_Clear_Crystals_SWAROVSKI_Subtle_Bracelet_Jewelry_Collection_Clear_Crystals_70_42.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300516/products/SISGEM_Solid_18k_Gold_Anklets_for_Women_Gold_Mesh-Link_Chai_Made_of_75_pure_gold_nickel-free_and_hypoallergenic_Mini_SISGEM_Solid_18k_Gold_Anklets_for_Women_Gold_Mesh-Link_Chai.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300515/products/SISGEM_18k_Yellow_Gold_Bracelet_for_Women_3mm_Width_Real_Go_18_Karat_Gold_Genuine_18k_gold_made_up_of_75_gold_and_25_SISGEM_18k_Yellow_Gold_Bracelet_for_Women_3mm_Width_Real_Go.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300514/products/Round_GIA_Certified_Natural_Diamond_Lab_Grown_Diamond_58_c_All_of_our_jewelry_and_gemstones_are_sourced_are_non-conflic_Round_GIA_Certified_Natural_Diamond_Lab_Grown_Diamond_58_c.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300512/products/RYLOS_Mens_Rings_14K_Yellow_Gold_-_Mens_Diamond_Blue_Onyx_GREAT_GIFT_for_birthday_anniversary_holidays_stocking_stu_RYLOS_Mens_Rings_14K_Yellow_Gold_-_Mens_Diamond_Blue_Onyx.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300511/products/RMC_Martin_Ksohoh_Precious_Stone_Ruby_custom_made_button_set_RMC_Martin_Ksohoh_Precious_Stone_Ruby_custom_made_button_set_6974_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300510/products/Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_3102.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300509/products/PORI_JEWELERS_14K_Gold_1_8MM_2_5MM_or_3_5MM_Round_Box_Chai_Metal_Type_14K_gold_Finish_High_polish_for_extra_fine_shin_PORI_JEWELERS_14K_Gold_1_8MM_2_5MM_or_3_5MM_Round_Box_Chai.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300507/products/Natural_Black_Diamond_Beads_Necklace_16_Inch_Full_Strand_4_t_Natural_Black_Diamond_Beads_Necklace_16_Inch_Full_Strand_4_t_5445_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300506/products/NONNYL_Real_Tahitian_Black_Pearl_Pendant_Necklaces_for_Women_NONNYL_Real_Tahitian_Black_Pearl_Pendant_Necklaces_for_Women_4298.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300504/products/Myshiwu_Designer_Jewelry_Inspired_Twisted_Cable_Wire_Cross_N_Myshiwu_Designer_Jewelry_Inspired_Twisted_Cable_Wire_Cross_N_23_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300501/products/Mens_Princess_Cut_Diamond_Wedding_Band_in_14_kt_White_Gold_C_Mens_Princess_Cut_Diamond_Wedding_Band_in_14_kt_White_Gold_3899.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300502/products/Murtoo_Viking_Bracelets_for_Men_The_Murtoo_Viking_Bracelet_f_Murtoo_Viking_Bracelets_for_Men_24_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300500/products/Large_Wedding_Band_with_Baguette_Round_Diamonds_in_18_kt_W_Present_her_with_a_diamond_surprise_on_that_special_day_with_Large_Wedding_Band_with_Baguette_Round_Diamonds_in_18_kt_W.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300498/products/Lanmi_Men_s_14K18K_Yellow_White_Gold_Natural_Emerald_Ring_Sa_Lanmi_Men_s_14K18K_Yellow_White_Gold_Natural_Emerald_Ring_Sa_5116.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300497/products/Ladybug_Flower_Clip_On_Earrings_Brilliantly_bejeweled_and_tr_Ladybug_Flower_Clip_On_Earrings_266.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300496/products/La4ve_Diamonds_12-3_00_Carat_ctw_14K_White_Gold_4_Prong_Set_Rou_Stunning_14k_White_Gold_Eye-catching_round_cut_lab-grown_dia_La4ve_Diamonds_12-3_00_Carat_ctw_14K_Princess_White.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300492/products/King_Will_Classic_Tungsten_Carbide_Ring_SilverBlackRedGreen_King_Will_Classic_Tungsten_Carbide_Ring_SilverBlackRedGreen_24.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300493/products/Kobelli_2_38_ct_tw_The_Pear_Hidden_Halo_Diamond_Ring_GIA_Ce_GIA_Certified_Pear_Diamond_Hidden_Halo_Design_Smooth_High-Po_Kobelli_2_38_ct_tw_The_Pear_Hidden_Halo_Diamond_Ring_GIA_Ce.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300495/products/LUXURMAN_Men_s_18K_Gold_Unique_4_Carat_Round_and_Oval_Diamon_LUXURMAN_Men_s_18K_Gold_Unique_4_Carat_Round_and_Oval_Diamon_44500.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300490/products/Jewels_By_Lux_10K_Yellow_Or_Rose_Gold_Mens_Baguette_Diamond_Jewels_By_Lux_10K_Yellow_Or_Rose_Gold_Mens_Baguette_Diamond_3719_94.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300491/products/Jewels_By_Lux_14K_Rose_Gold_Round_Diamond_Solitaire_Bridal_W_Jewels_By_Lux_14K_Rose_Gold_Round_Diamond_Solitaire_Bridal_W_7670_84.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300489/products/Jewels_By_Lux_10K_Yellow_Gold_Mens_Round_Diamond_Franco_Link_Find_the_perfect_jewelry_gifts_for_anyone_in_our_extensive_c_Jewels_By_Lux_10K_Yellow_Gold_Mens_Round_Diamond_Franco_Link.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300488/products/Jewelry_by_ARSA_Solid_14k_Two_Tone_Gold_Pendant_for_Women_Se_This_natural_sapphire_diamond_pendant_handcrafted_in_soli_Jewelry_by_ARSA_Solid_14k_Two_Tone_Gold_Pendant_for_Women_Se.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300487/products/Jewelry_Bliss_18k_White_Gold_Oval_Natural_Diamond_Halo_Engag_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_Jewelry_Bliss_18k_White_Gold_Oval_Natural_Diamond_Halo_Engag.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300485/products/Jewelplus_Platinum_7_7mm_Solid_Cuban_Curb_Link_Chain_Bracele_Platinum_7_7mm_Solid_Cuban_Curb_Link_Chain_Bracele.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300484/products/Jewelili_Enchanted_Disney_Fine_Jewelry_14K_White_Gold_and_Ro_Jewelili_Enchanted_Disney_Fine_Jewelry_14K_White_Gold_and_Ro_17121.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300483/products/Jewelili_Enchanted_Disney_Fine_Jewelry_10K_White_Gold_and_Ro_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_3910.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300481/products/Jewelili_3_Pair_Box_Set_Stud_Earrings_with_White_Round_Cubic_Jewelili_3_Pair_Box_Set_Stud_Earrings_with_White_Round_Cubic_1673.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300480/products/Jewel_Zone_US_Round_Cubic_Zirconia_Flip-Flop_Pendant_Necklac_Jewel_Zone_US_Round_Cubic_Zirconia_Flip-Flop_Pendant_Necklac_41_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300479/products/Jewel_Zone_US_Heart_Cut_Simulated_Birthstone_Cubic_Zirconi_Jewel_Zone_US_Heart_Cut_Simulated_Birthstone_Cubic_Zirconi_45_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300478/products/JYX_Pearl_AAAA_Natural_Tahitian_Black_Pearl_Necklace_12-14m_Luxurious_12-14mm_round_black_Tahiti_pearl_necklace_Every_pi_JYX_Pearl_AAAA_Natural_Tahitian_Black_Pearl_Necklace_12-14m.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300477/products/JO_WISDOM_925_Sterling_Silver_Cubic_Zirconia_Rose_Gold_Cladd_At_JO_WISDOM_Jewelry_we_prioritize_quality_and_service_cra_JO_WISDOM_925_Sterling_Silver_Cubic_Zirconia_Rose_Gold_Cladd.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300476/products/Ipetboom_6_Pcs_Our_Lady_s_Headband_Star_for_Women_Dreadlock_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_Ipetboom_6_Pcs_Our_Lady_s_Headband_Star_for_Women_Dreadlock.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300474/products/Iefil_Mothers_Day_Gifts_-_925_Sterling_Silver_Rose_Heart_Bir_Iefil_Mothers_Day_Gifts_-_925_Sterling_Silver_Rose_Heart_Bir_12988.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300473/products/IGI_Certified_14-2_Carat_Lab_Grown_Diamond_Stud_Earrings_in_IGI_Certified_14-2_Carat_Lab_Grown_Diamond_Stud_Earrings_in_2420.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300471/products/Houston_Diamond_District_1-8_Carat_ctw_White_Gold_Round_Cu_Houston_Diamond_District_1-8_Carat_ctw_White_Gold_Round_Cu_16600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300470/products/Heart_Pendant_Necklace_Gifts_for_Wife_Engraved_I_LOVE_YOU_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_7850.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300469/products/Hand_Crafted_AAA_Rubellite_Tourmaline_Long_Layering_Necklac_Hand_Crafted_AAA_Rubellite_Tourmaline_Long_Layering_Necklac_5554_74.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300468/products/Gin_and_Grace_14K_White_Genuine_Blue_Sapphire_Ring_with_Diam_Gin_and_Grace_14K_White_Genuine_Blue_Sapphire_Ring_with_Diam_1350.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300466/products/Gin_and_Grace_14K_Two_Tone_Gold_Genuine_Morganite_Ring_with_Gin_and_Grace_14K_Two_Tone_Gold_Genuine_Morganite_Ring_with_1595.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300465/products/Gift_for_Mother_s_Day_Infinity_Love_Heart_Pendant_Necklaces_Gift_for_Mother_s_Day_Infinity_Love_Heart_Pendant_Necklaces_45_97.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300459/products/FANCIME_Birthstone_Necklaces_925_Sterling_Silver_Moon_and_St_FANCIME_Birthstone_Necklaces_925_Sterling_Silver_Moon_and_St_47_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300458/products/Ewatchparts_2_30CT_DIAMOND_CHANNEL_SET_DIAMOND_BEZEL_Introdu_Introducing_our_brand_new_2_30CT_Round_Diamond_Bezel_for_Rol_Ewatchparts_2_30CT_DIAMOND_CHANNEL_SET_DIAMOND_BEZEL.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300456/products/Dazzlingrock_Collection_3_00_Carat_ctw_14K_Princess_White_Crafted_in_14K_Yellow-gold_this_ring_features_di_Dazzlingrock_Collection_3_00_Carat_ctw_14K_Princess_White.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300455/products/Dazzlingrock_Collection_2_50_Carat_ctw_14K_Round_White_Dia_Crafted_in_14K_Yellow-gold_this_engagement_ring_features_di_Dazzlingrock_Collection_2_50_Carat_ctw_14K_Round_White_Dia.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300454/products/Dazzlingrock_Collection_10kt_Yellow_Gold_Mens_Round_Diamond_Yellow_Gold_in_colour_Spring_Ring_clasp_White-diamond_Dazzlingrock_Collection_10kt_Yellow_Gold_Mens_Round_Diamond.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300452/products/Dazzlingrock_Collection_10kt_Yellow_Gold_Mens_Round_Diamond_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_Dazzlingrock_Collection_10kt_Yellow_Gold_Mens_Round_Diamond.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300451/products/Dazzlingrock_Collection_10K_Round_Blue_Sapphire_And_White_Di_Dazzlingrock_Collection_10K_Round_Blue_Sapphire_And_White_Di_3176.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300450/products/Cts_Black_Diamond_Jewelry_Set_This_resplendent_Black_Diamond_Cts_Black_Diamond_Jewelry_Set_2898_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300449/products/COOLSTEELANDBEYOND_Mens_Women_Stainless_Steel_Foxtail_Wheat_COOLSTEELANDBEYOND_Mens_Women_Stainless_Steel_Foxtail_Wheat_21_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300448/products/Bonyak_Jewelry_Lab-Created_Emerald_Platinum_Lab-Grown_Emeral_Bonyak_Jewelry_Lab-Created_Emerald_Platinum_Lab-Grown_Emeral_2080_45.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300447/products/Betsey_Johnson_Butterfly_Necklace_Betsey_Johnson_y-shaped_ne_Betsey_Johnson_Butterfly_Necklace_58.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300446/products/Ben_Amun_Jewelry_Gold_Ball_and_Pearl_Timeless_fusion_of_gold_Ben_Amun_Jewelry_Gold_Ball_and_Pearl_1405_29.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300444/products/Auriga_Fine_Jewelry_14k_Yellow_Gold_9_7mm_Hand_Polished_Flat_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Auriga_Fine_Jewelry_14k_Yellow_Gold_9_7mm_Hand_Polished_Flat.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300443/products/Angara_Natural_Round_Shape_Faceted-Cut_Loose_Blue_Sapphire_Angara_Natural_Round_Shape_Faceted-Cut_Loose_Blue_Sapphire_61309.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300442/products/Angara_Natural_Emerald_Solitaire_Pendant_Necklace_for_Women_Angara_Natural_Emerald_Solitaire_Pendant_Necklace_for_Women_4923.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300440/products/Angara_Natural_Diamond_Solitaire_Pendant_Necklace_for_Women_Angara_Natural_Diamond_Solitaire_Pendant_Necklace_for_Women_12890.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300435/products/Angara_Classic_Lab-Grown_Diamond_Linear_Tennis_Bracelet_in_S_Angara_Classic_Lab-Grown_Diamond_Linear_Tennis_Bracelet_in_S_22699.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300434/products/American_West_Jewelry_Sterling_Silver_Women_s_Pendant_Neckla_American_West_Jewelry_Sterling_Silver_Women_s_Pendant_Neckla_14591.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300432/products/Amazon_Collection_IGI_Certified_Platinum_Round-Cut_Diamond_S_Amazon_Collection_IGI_Certified_Platinum_Round-Cut_Diamond_S_66500.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300437/products/Angara_Classic_Round_Shape_Lab-Grown_Emerald_Solitaire_Penda_Angara_Classic_Round_Shape_Lab-Grown_Emerald_Solitaire_Penda_62736.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300431/products/Amazon_Collection_Certified_14k_Gold_Round-Cut_Diamond_Stud_Amazon_Collection_Certified_14k_Gold_Round-Cut_Diamond_Stud_5173_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300430/products/AliveRose_Real_Rose_Gold_Dipped_Necklace_This_pendant_neckla_AliveRose_Real_Rose_Gold_Dipped_Necklace_7502.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300414/products/1928_Jewelry_3_Sided_Flower_Spinner_Locket_Pendant_Necklace_1924.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300413/products/18K_YellowWhiteRose_Gold_By_The_Yard_Necklace_With_1_38_TCW_NATURAL_DIAMONDS_All_our_diamonds_and_their_colors_are_compl_18K_YellowWhiteRose_Gold_By_The_Yard_Necklace_With_1_38_TCW.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300412/products/18K_Gold_Necklace_Gold_Chunky_Necklace_Gold_Horseshoe_Neck_18K_Gold_Necklace_Gold_Chunky_Necklace_Gold_Horseshoe_Neck_3750.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300411/products/14kt_Solid_Gold_Cross_Necklace_for_Women_Real_Gold_Classic_227.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300416/products/1_to_5_Carat_14K_Gold_Round_White_Diamond_Ladies_Huggies_Hoo_5139_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300417/products/2_00_Cts_Black_Diamond_Jewelry_Set_in_Platinum.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300418/products/2_05_ct_t_w_Ladies_Round_and_Baguette_Cut_Diamond_Cross_Pen.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300408/products/14k_Yellow_Gold_Classic_Shiny_Polished_Round_Hoop_Earrings_L_14k_Yellow_Gold_Classic_Shiny_Polished_Round_Hoop_Earrings_59_95.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300409/products/14k_Yellow_OR_White_Gold_SOLID_Wedding_Engagement_Ring_This_14k_Yellow_OR_White_Gold_SOLID_Wedding_Engagement_Ring_207_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300410/products/14kt_Solid_Gold_Cross_Necklace_for_Women_Real_Gold_Classic_14kt_Solid_Gold_Cross_Necklace_for_Women_Real_Gold_Classic_227.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300406/products/14K_REAL_Yellow_Gold_5_00mm_Shiny_SOLID_Diamond-Cut_Round_Fr.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300405/products/14KY_14mm_Cuban_WP_Chain_for_Women_and_Men_14K_Solid_Gold_L_14KY_14mm_Cuban_WP_Chain_for_Women_and_Men_14K_Solid_Gold_L_13300_47.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300404/products/12X10_MM_Size_Sparkling_Oval_Ruby_Halo_Earring.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300403/products/12-16MM_Ethiopian_Opal_90Pcs_Cabochon_AAA_Quality_Ethiopian.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300401/products/10_00_Carat_Handcrafted_Finger_Ring_Zircon_is_highly_recomme_Zircon_is_highly_recommended_for_people_who_want_peace_in_th_10_00_Carat_Handcrafted_Finger_Ring.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300400/products/1_11Cts_Mix_of_Fancy_Color_Loose_Diamond_Natural_Color_Heart.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300399/products/1-8_Carat_ctw_White_Gold_Round_Cut_LAB_GROWN_Diamond_Heart.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300398/products/0_91_ct_Ladies_Cuban_Link_Round_Cut_Diamond_Bracelet_in_14kt.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300397/products/0_65Cts_Fancy_Intense_Green_Loose_Diamond_Natural_Color_Roun.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300396/products/0_60_Carat_Fancy_Vivid_Yellow_Color_Natural_Loose_Diamond_Ra.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300395/products/0_50_Carat_Total_Weight_-_2_Natural_Loose_Diamond_Side_Stone.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300394/products/0_42_Carat_Fancy_Intense_Pink_Color_Natural_Diamond_Round_Sh.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300393/products/0_40_Carat_Fancy_Intense_Purple_Color_Natural_Loose_Diamond.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300391/products/0_15_Carat_Fancy_Intense_Pink_Color_Natural_Loose_Diamond_Ro.jpg"
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

/* Build product objects with name and a short description (jewelry-focused) */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (lower.includes("diamond") || lower.includes("carat") || lower.includes("ct") || lower.includes("gia")) {
        return "Premium diamond jewelry — certified and crafted for timeless elegance.";
      }
      if (lower.includes("gold") || lower.includes("14k") || lower.includes("18k") || lower.includes("platinum")) {
        return "Fine gold & platinum piece — classic craftsmanship and lasting value.";
      }
      if (lower.includes("pearl") || lower.includes("tahiti")) {
        return "Beautiful pearl jewelry — lustrous and elegant.";
      }
      if (lower.includes("necklace") || lower.includes("pendant")) {
        return "Stylish necklace/pendant — perfect for everyday or special occasions.";
      }
      if (lower.includes("bracelet") || lower.includes("bangle") || lower.includes("tennis")) {
        return "Elegant bracelet — a refined finishing touch.";
      }
      if (lower.includes("ring") || lower.includes("band") || lower.includes("engagement")) {
        return "Expertly crafted ring — ideal for proposals and celebrations.";
      }
      if (lower.includes("earring") || lower.includes("hoop") || lower.includes("stud")) {
        return "Beautiful earrings — crafted for comfort and sparkle.";
      }
      return "High quality jewelry with excellent craftsmanship and design.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Jewelry() {
  // Shuffle once on component mount (consistent with other pages)
  const shuffledUrls = useMemo(() => shuffleArray(productUrls), []);
  const products = useMemo(() => productsFromUrls(shuffledUrls), [shuffledUrls]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // exactly 8 products per page (2 columns x 4 rows)
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

        /* Two-column grid that keeps two columns always and ensures equal-height cards */
        .two-column-vertical {
          display: grid;
          grid-template-columns: 1fr 1fr; /* always two columns */
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* On very narrow viewports allow horizontal scrolling to preserve the 2x4 layout */
        @media (max-width: 520px) {
          .two-column-vertical {
            overflow-x: auto;
            padding: 0 12px;
            grid-auto-flow: column;
            grid-auto-columns: minmax(240px, 1fr);
            align-items: start;
          }
        }

        .column-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /*
         FIXED CARD HEIGHT:
         - Keep cards identical height so a single tall image/title can't stretch the row.
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
          flex: 0 0 92px;
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
          min-height: 0;
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

        /* Pagination: constrained and horizontally scrollable on small viewports */
        .pagination-wrap {
          display:flex;
          justify-content:center;
          padding: 22px 12px 44px;
          box-sizing: border-box;
        }
        .pagination-inner {
          display:inline-flex;
          gap:10px;
          align-items:center;
          max-width:1200px;
          width:100%;
          margin:0 auto;
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
          padding:6px;
          box-sizing:border-box;
        }
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
        {/* Hero */}
        <section
          className="shoes-hero"
          style={{
            backgroundImage: `url(${JewelryHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "320px"
          }}
        >
          <div className="shoes-hero-content" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="shoes-category">Jewelry</h2>
            <h1 className="shoes-title">Explore Our Collection For Jewelry</h1>
            <p className="shoes-subtitle">Updated weekly with new arrivals and curated selections.</p>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "10px auto 6px", padding: "0 12px", color: "#071e3d", fontWeight: 700 }}>
          {total} products found.
        </div>

        <div className="shoes-grid-outer" aria-hidden="false">
          <div className="two-column-vertical">
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a key={p.id} href={`/jewelry/${p.id}`} className="shoe-card-frame" role="listitem" title={`${p.name} — ${p.desc}`}>
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
                <a key={p.id} href={`/jewelry/${p.id}`} className="shoe-card-frame" role="listitem" title={`${p.name} — ${p.desc}`}>
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
              <button key={n} onClick={() => goTo(n)} className={n === currentPage ? "active" : ""} aria-current={n === currentPage ? "page" : undefined}>
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
