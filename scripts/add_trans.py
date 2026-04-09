import json
import os

base_path = r"x:\Study\Projects\KrishiSense AI\frontend\src\locales"

new_keys = {
    "en": {
        "prof_member_since": "KrishiSense Member since", "prof_settings": "Profile Settings", "prof_full_name": "Full Name",
        "prof_dob": "Date of Birth", "prof_gender": "Gender", "prof_male": "Male", "prof_female": "Female", "prof_other": "Other",
        "prof_preferred_lang": "Preferred Language", "prof_app_theme": "App Theme", "prof_theme_desc": "Switch between light and dark mode",
        "prof_dark_mode": "Dark Mode", "prof_light_mode": "Light Mode", "prof_save_changes": "Save Changes", 
        "prof_recent_searches": "Recent Crop Searches", "prof_comm_activity": "Community Activity",
        
        "mkt_title": "Market Intelligence", "mkt_desc": "Access live crop price trends from verified government mandis across India",
        "mkt_source": "Official Agmarknet", "mkt_results": "results found", "mkt_loc_btn": "Your Location", "mkt_pan_btn": "Pan India",
        "mkt_search_placeholder": "Search crops like Banana, Wheat, Ginger...", "mkt_search_btn": "Search", 
        "mkt_loading": "Fetching live mandi prices...", "mkt_quintal": "/ Quintal", "mkt_update": "Mandi Update:",
        "mkt_min": "Min", "mkt_max": "Max",
        
        "anl_engine": "AI Processing Engine", "anl_step1_title": "Analyzing Soil Quality", "anl_step1_desc": "Evaluating pH, Nitrogen, Phosphorus & Potassium",
        "anl_step2_title": "Processing Climate Data", "anl_step2_desc": "Correlating Temperature, Humidity & Rainfall Patterns",
        "anl_step3_title": "Market Profitability Check", "anl_step3_desc": "Querying real-time Mandi market trends",
        "anl_step4_title": "Generating ML Recommendation", "anl_step4_desc": "Running Random Forest predictive model",
        "anl_metrics_title": "Soil Metrics", "anl_metrics_sub": "Tell us about your soil health", "anl_auto_fill": "Auto-filled for",
        "anl_ph": "pH Level", "anl_n": "Nitrogen (%)", "anl_p": "Phosphorus (ppm)", "anl_k": "Potassium (ppm)", "anl_soil_type": "Soil Type",
        "anl_climate_title": "Climate Conditions", "anl_climate_sub": "Current weather details", "anl_temp": "Temperature (°C)",
        "anl_hum": "Humidity (%)", "anl_rain": "Rainfall (mm)", "anl_season": "Season",
        "anl_pref_title": "Preferences", "anl_pref_sub": "Language and final review", "anl_lang": "Report Language",
        "anl_new_analysis": "New Analysis", "anl_back": "Back", "anl_next": "Next", "anl_submit": "Get Recommendation"
    },
    "hi": {
        "prof_member_since": "सदस्य:", "prof_settings": "प्रोफ़ाइल सेटिंग", "prof_full_name": "पूरा नाम",
        "prof_dob": "जन्म की तारीख", "prof_gender": "लिंग", "prof_male": "पुरुष", "prof_female": "महिला", "prof_other": "अन्य",
        "prof_preferred_lang": "पसंदीदा भाषा", "prof_app_theme": "ऐप थीम", "prof_theme_desc": "लाइट/डार्क मोड बदलें",
        "prof_dark_mode": "डार्क", "prof_light_mode": "लाइट ", "prof_save_changes": "सेव करें", 
        "prof_recent_searches": "हाल की खोजें", "prof_comm_activity": "सामुदायिक गतिविधियां",
        
        "mkt_title": "बाज़ार की जानकारी", "mkt_desc": "मंडी के ताज़ा भाव देखें",
        "mkt_source": "एगमार्कनेट", "mkt_results": "परिणाम", "mkt_loc_btn": "आपका स्थान", "mkt_pan_btn": "पूरा भारत",
        "mkt_search_placeholder": "फसल खोजें...", "mkt_search_btn": "खोजें", 
        "mkt_loading": "भाव लाए जा रहे हैं...", "mkt_quintal": "/ क्विंटल", "mkt_update": "अपडेट:",
        "mkt_min": "न्यूनतम", "mkt_max": "अधिकतम",
        
        "anl_engine": "एआई इंजन", "anl_step1_title": "मिट्टी की जांच", "anl_step1_desc": "pH, NPK का मूल्यांकन",
        "anl_step2_title": "मौसम डेटा", "anl_step2_desc": "तापमान, नमी और बारिश",
        "anl_step3_title": "बाज़ार में लाभ", "anl_step3_desc": "मंडी के भाव",
        "anl_step4_title": "मशीन लर्निंग", "anl_step4_desc": "सर्वश्रेष्ठ फसल",
        "anl_metrics_title": "मिट्टी", "anl_metrics_sub": "मिट्टी की जानकारी दें", "anl_auto_fill": "स्वतः भरा:",
        "anl_ph": "pH", "anl_n": "नाइट्रोजन (%)", "anl_p": "फास्फोरस (ppm)", "anl_k": "पोटेशियम (ppm)", "anl_soil_type": "मिट्टी का प्रकार",
        "anl_climate_title": "मौसम", "anl_climate_sub": "मौसम की जानकारी", "anl_temp": "तापमान (°C)",
        "anl_hum": "नमी (%)", "anl_rain": "बारिश (mm)", "anl_season": "मौसम",
        "anl_pref_title": "पसंद", "anl_pref_sub": "भाषा", "anl_lang": "रिपोर्ट की भाषा",
        "anl_new_analysis": "नया विश्लेषण", "anl_back": "पीछे", "anl_next": "आगे", "anl_submit": "अनुशंसा पाएं"
    },
    "mr": {
        "prof_member_since": "सदस्य:", "prof_settings": "प्रोफाइल सेटिंग्ज", "prof_full_name": "पूर्ण नाव",
        "prof_dob": "जन्मतारीख", "prof_gender": "लिंग", "prof_male": "पुरुष", "prof_female": "स्त्री", "prof_other": "इतर",
        "prof_preferred_lang": "पसंतीची भाषा", "prof_app_theme": "अॅप थीम", "prof_theme_desc": "लाइट/डार्क मोड",
        "prof_dark_mode": "डार्क", "prof_light_mode": "लाइट ", "prof_save_changes": "सेव्ह करा", 
        "prof_recent_searches": "शोधलेले पिके", "prof_comm_activity": "सामाजिक क्रियाकलाप",
        
        "mkt_title": "बाजार माहिती", "mkt_desc": "थेट मंडी भाव",
        "mkt_source": "अॅगमार्कनेट", "mkt_results": "निकाल", "mkt_loc_btn": "तुमचे ठिकाण", "mkt_pan_btn": "संपूर्ण भारत",
        "mkt_search_placeholder": "पीक शोधा...", "mkt_search_btn": "शोधा", 
        "mkt_loading": "भाव मिळवत आहे...", "mkt_quintal": "/ क्विंटल", "mkt_update": "अपडेट:",
        "mkt_min": "किमान", "mkt_max": "कमाल",
        
        "anl_engine": "एआय इंजिन", "anl_step1_title": "मातीचे विश्लेषण", "anl_step1_desc": "pH आणि NPK",
        "anl_step2_title": "हवामान", "anl_step2_desc": "तापमान आणि पाऊस",
        "anl_step3_title": "बाजार नफा", "anl_step3_desc": "थेट बाजार भाव",
        "anl_step4_title": "शिफारस", "anl_step4_desc": "एआय आधारित पीक",
        "anl_metrics_title": "माती", "anl_metrics_sub": "मातीची माहिती", "anl_auto_fill": "स्वयं-भरले:",
        "anl_ph": "pH", "anl_n": "नायट्रोजन (%)", "anl_p": "फॉस्फरस (ppm)", "anl_k": "पोटॅशियम (ppm)", "anl_soil_type": "मातीचा प्रकार",
        "anl_climate_title": "हवामान", "anl_climate_sub": "सद्य हवामान", "anl_temp": "तापमान (°C)",
        "anl_hum": "आर्द्रता (%)", "anl_rain": "पाऊस (mm)", "anl_season": "हंगाम",
        "anl_pref_title": "पसंती", "anl_pref_sub": "भाषा", "anl_lang": "रिपोर्टची भाषा",
        "anl_new_analysis": "नवीन विश्लेषण", "anl_back": "मागे", "anl_next": "पुढे", "anl_submit": "शिफारस मिळवा"
    },
    "gu": {
         "prof_member_since": "સભ્ય:", "prof_settings": "પ્રોફાઈલ સેટિંગ્સ", "prof_full_name": "પૂરું નામ",
        "prof_dob": "જન્મ તારીખ", "prof_gender": "લિંગ", "prof_male": "પુરુષ", "prof_female": "સ્ત્રી", "prof_other": "અન્ય",
        "prof_preferred_lang": "ભાષા", "prof_app_theme": "થીમ", "prof_theme_desc": "લાઇટ/ડાર્ક મોડ",
        "prof_dark_mode": "ડાર્ક", "prof_light_mode": "લાઇટ ", "prof_save_changes": "સેવ", 
        "prof_recent_searches": "શોધેલ પાક", "prof_comm_activity": "સમુદાય પ્રવૃત્તિ",
        
        "mkt_title": "બજાર માહિતી", "mkt_desc": "જીવંત મંડી ભાવો",
        "mkt_source": "એગમાર્કનેટ", "mkt_results": "પરિણામો", "mkt_loc_btn": "તમારું સ્થાન", "mkt_pan_btn": "સમગ્ર ભારત",
        "mkt_search_placeholder": "પાક શોધો...", "mkt_search_btn": "શોધો", 
        "mkt_loading": "ભાવ લાવી રહ્યા છે...", "mkt_quintal": "/ ક્વિન્ટલ", "mkt_update": "અપડેટ:",
        "mkt_min": "લઘુત્તમ", "mkt_max": "મહત્તમ",
        
        "anl_engine": "AI એન્જિન", "anl_step1_title": "જમીન", "anl_step1_desc": "pH, NPK",
        "anl_step2_title": "હવામાન", "anl_step2_desc": "તાપમાન અને વરસાદ",
        "anl_step3_title": "બજાર", "anl_step3_desc": "મંડી અંદાજ",
        "anl_step4_title": "મુખ્ય પાક", "anl_step4_desc": "AI આધારિત પાક",
        "anl_metrics_title": "જમીન", "anl_metrics_sub": "જમીનની માહિતી", "anl_auto_fill": "ઓટો ભરેલ:",
        "anl_ph": "pH", "anl_n": "નાઇટ્રોજન (%)", "anl_p": "ફોસ્ફરસ (ppm)", "anl_k": "પોટેશિયમ (ppm)", "anl_soil_type": "જમીન પ્રકાર",
        "anl_climate_title": "હવામાન", "anl_climate_sub": "હવામાન વિગતો", "anl_temp": "તાપમાન (°C)",
        "anl_hum": "ભેજ (%)", "anl_rain": "વરસાદ (mm)", "anl_season": "સિઝન",
        "anl_pref_title": "પસંદગીઓ", "anl_pref_sub": "ભાષા", "anl_lang": "રિપોર્ટ ભાષા",
        "anl_new_analysis": "નવું વિશ્લેષણ", "anl_back": "પાછળ", "anl_next": "આગળ", "anl_submit": "ભલામણ મેળવો"
    }
}

for lang in ["en", "hi", "mr", "gu"]:
    path = os.path.join(base_path, lang, "translation.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        for k, v in new_keys[lang].items():
            data[k] = v
            
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("Translations generated successfully.")
