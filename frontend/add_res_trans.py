import json
import os

base_path = r"x:\Study\Projects\KrishiSense AI\frontend\src\locales"

new_keys = {
    "en": {
        "anl_res_title": "Recommended Crop", "anl_confidence": "Confidence", "anl_why_crop": "Why {{crop}}?",
        "anl_expert_badge": "Expert Analysis", "anl_view_report": "View Full Expert Report", "anl_show_less": "Show Less",
        "anl_analyzing": "Analyzing Soil & Market...", "anl_profit": "Market Profit", "anl_margin": "current margin",
        "anl_price": "Current Price", "anl_quintal": "per quintal", "anl_weather": "Weather Score",
        "anl_soil": "Soil Quality", "anl_soil_asmnt": "soil assessment", "anl_risk": "Risk Factor",
        "anl_risk_asmnt": "risk assessment", "anl_ml": "ML Prediction", "anl_ml_source": "from AI model",
        "anl_finance": "Financial Future", "anl_alts": "Alternative Crops", "anl_margin_plus": "margin",
        "anl_btn_translate": "Translate to {{lang}}", "anl_btn_translating": "Translating..."
    },
    "hi": {
        "anl_res_title": "अनुशंसित फसल", "anl_confidence": "आत्मविश्वास", "anl_why_crop": "{{crop}} क्यों?",
        "anl_expert_badge": "विशेषज्ञ विश्लेषण", "anl_view_report": "पूर्ण विशेषज्ञ रिपोर्ट देखें", "anl_show_less": "कम दिखाएं",
        "anl_analyzing": "मिट्टी और बाजार का विश्लेषण...", "anl_profit": "बाजार लाभ", "anl_margin": "वर्तमान मार्जिन",
        "anl_price": "वर्तमान मूल्य", "anl_quintal": "प्रति क्विंटल", "anl_weather": "मौसम स्कोर",
        "anl_soil": "मिट्टी की गुणवत्ता", "anl_soil_asmnt": "मिट्टी मूल्यांकन", "anl_risk": "जोखिम कारक",
        "anl_risk_asmnt": "जोखिम मूल्यांकन", "anl_ml": "एमएल भविष्यवाणी", "anl_ml_source": "एआई मॉडल से",
        "anl_finance": "वित्तीय भविष्य", "anl_alts": "वैकल्पिक फसलें", "anl_margin_plus": "मार्जिन",
        "anl_btn_translate": "{{lang}} में अनुवाद करें", "anl_btn_translating": "अनुवाद हो रहा है..."
    },
    "mr": {
        "anl_res_title": "शिफारस केलेली पीक", "anl_confidence": "आत्मविश्वास", "anl_why_crop": "{{crop}} का?",
        "anl_expert_badge": "तज्ञ विश्लेषण", "anl_view_report": "पूर्ण तज्ञ अहवाल पहा", "anl_show_less": "कमी दाखवा",
        "anl_analyzing": "माती आणि बाजार विश्लेषण...", "anl_profit": "बाजार नफा", "anl_margin": "सध्याचा मार्जिन",
        "anl_price": "सध्याची किंमत", "anl_quintal": "प्रति क्विंटल", "anl_weather": "हवामान स्कोअर",
        "anl_soil": "मातीची गुणवत्ता", "anl_soil_asmnt": "माती मूल्यमापन", "anl_risk": "धोका घटक",
        "anl_risk_asmnt": "धोका मूल्यमापन", "anl_ml": "एमएल अंदाज", "anl_ml_source": "एआई मॉडेलवरून",
        "anl_finance": "वित्तीय भविष्य", "anl_alts": "पर्यायी पिके", "anl_margin_plus": "मार्जिन",
        "anl_btn_translate": "{{lang}} मध्ये अनुवाद करा", "anl_btn_translating": "अनुवाद करत आहे..."
    },
    "gu": {
        "anl_res_title": "ભલામણ કરેલ પાક", "anl_confidence": "આત્મવિશ્વાસ", "anl_why_crop": "{{crop}} કેમ?",
        "anl_expert_badge": "નિષ્ણાત વિશ્લેષણ", "anl_view_report": "પૂર્ણ નિષ્ણાત અહેવાલ જુઓ", "anl_show_less": "ઓછું બતાવો",
        "anl_analyzing": "જમીન અને બજારનું વિશ્લેષણ...", "anl_profit": "બજાર નફો", "anl_margin": "વર્તમાન માર્જિન",
        "anl_price": "વર્તમાન કિંમત", "anl_quintal": "ક્વિન્ટલ દીઠ", "anl_weather": "હવામાન સ્કોર",
        "anl_soil": "જમીનની ગુણવત્તા", "anl_soil_asmnt": "જમીન મૂલ્યાંકન", "anl_risk": "જોખમ પરિબળ",
        "anl_risk_asmnt": "જોખમ મૂલ્યાંકન", "anl_ml": "ML આગાહી", "anl_ml_source": "AI મોડેલથી",
        "anl_finance": "નાણાકીય ભવિષ્ય", "anl_alts": "વૈકલ્પિક પાક", "anl_margin_plus": "માર્જિન",
        "anl_btn_translate": "{{lang}} માં અનુવાદ કરો", "anl_btn_translating": "અનુવાદ થઈ રહ્યો છે..."
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

print("Result translations generated successfully.")
