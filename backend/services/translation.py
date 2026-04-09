"""
Translation and localization services
"""
from typing import Dict, Optional

class TranslationService:
    def __init__(self):
        # Simple translation dictionary (in production, use Google Translate API)
        self.translations = {
            "recommended_crop": {
                "en": "Recommended Crop",
                "hi": "अनुशंसित फसल",
                "mr": "शिफारस केलेली पीक",
                "gu": "ભલામણ કરેલ પાક"
            },
            "weather_suitability_score": {
                "en": "Weather Suitability",
                "hi": "मौसम उपयुक्तता",
                "mr": "हवामान उपयुक्तता",
                "gu": "હવામાન યોગ્યતા"
            },
            "market_profit_margin": {
                "en": "Profit Margin",
                "hi": "लाभ मार्जिन",
                "mr": "नफा मार्जिन",
                "gu": "નફો માર્જિન"
            },
            "Excellent": {
                "en": "Excellent", "hi": "उत्कृष्ट", "mr": "उत्तम", "gu": "ઉત્તમ"
            },
            "Good": {
                "en": "Good", "hi": "अच्छा", "mr": "छान", "gu": "સારું"
            },
            "Fair": {
                "en": "Fair", "hi": "ठीक है", "mr": "योग्य", "gu": "ઠીક"
            },
            "Poor": {
                "en": "Poor", "hi": "खराब", "mr": "कमजोर", "gu": "ખરાબ"
            },
            "High Risk": {
                "en": "High Risk", "hi": "उच्च जोखिम", "mr": "उच्च धोका", "gu": "ઉચ્ચ જોખમ"
            },
            "Moderate Risk": {
                "en": "Moderate Risk", "hi": "मध्यम जोखिम", "mr": "मध्यम धोका", "gu": "મધ્યમ જોખમ"
            },
            "Low Risk": {
                "en": "Low Risk", "hi": "कम जोखिम", "mr": "कम धोका", "gu": "ઓછું જોખમ"
            },
            # Crop common names
            "Muskmelon": {
                "en": "Muskmelon", "hi": "खरबूजा", "mr": "खरबूज", "gu": "શક્કર ટેટી"
            },
            "Wheat": {
                "en": "Wheat", "hi": "गेहूं", "mr": "गहू", "gu": "ઘઉં"
            },
            "Rice": {
                "en": "Rice", "hi": "चावल (धान)", "mr": "तांदूळ", "gu": "ચોખા"
            },
            "Maize": {
                "en": "Maize", "hi": "मक्का", "mr": "मका", "gu": "મકાઈ"
            },
            "Turmeric": {
                "en": "Turmeric", "hi": "हल्दी", "mr": "हळद", "gu": "હળદર"
            },
            "Pomegranate": {
                "en": "Pomegranate", "hi": "अनार", "mr": "डालिंब", "gu": "દાડમ"
            },
            "Cotton": {
                "en": "Cotton", "hi": "कपास", "mr": "कापूस", "gu": "કપાસ"
            },
             "Onion": {
                "en": "Onion", "hi": "प्याज", "mr": "कांदा", "gu": "ડુંગળી"
            }
        }

    def translate(self, text: str, target_language: str = "hi") -> str:
        """
        Simple translation (basic dictionary lookup)
        """
        if not text or target_language == "en":
            return text
        
        return self.translations.get(text, {}).get(target_language, text)

    def build_localized_output(self, recommendation_data: Dict, language: str = "hi") -> Dict[str, str]:
        """
        Build complete localized output
        """
        output = {}
        crop_val = recommendation_data.get("recommended_crop", "")
        
        # Main recommendation (Translate labels AND the crop name!)
        output["recommended_crop_label"] = self.translate("recommended_crop", language)
        output["recommended_crop_value"] = self.translate(crop_val, language)
        
        # Profit info
        output["profit_label"] = self.translate("market_profit_margin", language)
        output["profit_value"] = f"{recommendation_data.get('market_profit_margin', 0):.1f}%"
        
        # Risk
        output["risk_label"] = self.translate("Risk Factor", language)
        output["risk_value"] = self.translate(recommendation_data.get("risk_factor", "Low Risk"), language)
        
        # Quality
        output["soil_quality_value"] = self.translate(recommendation_data.get("soil_quality", "Good"), language)
        
        # Analysis (Already translated in gemini.py or using this basic template)
        output["analysis"] = recommendation_data.get("descriptive_analysis", "")
            
        return output

translation_service = TranslationService()
