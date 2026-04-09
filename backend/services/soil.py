"""
Soil analysis and estimation services
"""
from typing import Dict, Optional, List
from config import SOIL_TYPES

class SoilService:
    def __init__(self):
        self.soil_types = SOIL_TYPES

    def estimate_soil_from_weather(self, rainfall: float, temperature: float) -> Dict:
        """
        Estimate soil type and properties from weather data
        Using satellite logic simulation
        """
        # Simple heuristic estimation
        if rainfall > 200:
            if temperature > 25:
                soil_type = "alluvial"  # High rainfall + high temp
            else:
                soil_type = "laterite"  # High rainfall + moderate temp
        else:
            if temperature > 30:
                soil_type = "sandy"  # Low rainfall + high temp
            else:
                soil_type = "black"  # Low rainfall + moderate temp

        soil_data = self.soil_types.get(soil_type, self.soil_types["alluvial"])
        
        return {
            "estimated_soil_type": soil_type,
            "pH_range": soil_data["pH_range"],
            "nitrogen_level": soil_data["nitrogen"],
            "reliability_score": 0.65,  # 65% confidence from weather estimation
            "recommendation": f"Based on rainfall ({rainfall}mm) and temperature ({temperature}°C), soil is estimated to be {soil_type}"
        }

    def get_regional_soil_defaults(self, state: str, district: str = None) -> Dict:
        """
        Get typical soil properties for Indian states and districts (cities)
        """
        state = (state or "").lower()
        district = (district or "").lower()
        
        # 1. Check District specific data (High Granularity)
        district_defaults = {
            "nashik": {"pH": 7.2, "nitrogen": 0.55, "phosphorus": 26, "potassium": 195, "soil_type": "black"},
            "jalgaon": {"pH": 7.8, "nitrogen": 0.48, "phosphorus": 20, "potassium": 210, "soil_type": "black"},
            "nagpur": {"pH": 7.4, "nitrogen": 0.42, "phosphorus": 18, "potassium": 180, "soil_type": "black"},
            "sangli": {"pH": 7.6, "nitrogen": 0.50, "phosphorus": 24, "potassium": 200, "soil_type": "laterite"},
            "ratnagiri": {"pH": 5.8, "nitrogen": 0.45, "phosphorus": 22, "potassium": 150, "soil_type": "laterite"},
            "pune": {"pH": 7.3, "nitrogen": 0.52, "phosphorus": 25, "potassium": 190, "soil_type": "black"}
        }
        
        if district in district_defaults:
            return district_defaults[district]

        # 2. Check State defaults (Standard Fallback)
        state_defaults = {
            "maharashtra": {"pH": 7.5, "nitrogen": 0.45, "phosphorus": 22, "potassium": 190, "soil_type": "black"},
            "punjab": {"pH": 8.0, "nitrogen": 0.6, "phosphorus": 30, "potassium": 210, "soil_type": "alluvial"},
            "haryana": {"pH": 7.8, "nitrogen": 0.55, "phosphorus": 28, "potassium": 200, "soil_type": "alluvial"},
            "karnataka": {"pH": 6.8, "nitrogen": 0.4, "phosphorus": 18, "potassium": 160, "soil_type": "red"},
            "tamil nadu": {"pH": 6.5, "nitrogen": 0.35, "phosphorus": 15, "potassium": 140, "soil_type": "red"},
            "uttar pradesh": {"pH": 7.2, "nitrogen": 0.5, "phosphorus": 25, "potassium": 180, "soil_type": "alluvial"},
            "gujarat": {"pH": 8.2, "nitrogen": 0.4, "phosphorus": 20, "potassium": 170, "soil_type": "black"},
            "madhya pradesh": {"pH": 7.4, "nitrogen": 0.45, "phosphorus": 22, "potassium": 180, "soil_type": "black"},
            "west bengal": {"pH": 6.2, "nitrogen": 0.5, "phosphorus": 24, "potassium": 160, "soil_type": "alluvial"},
            "andhra pradesh": {"pH": 7.0, "nitrogen": 0.4, "phosphorus": 20, "potassium": 170, "soil_type": "red"},
            "rajasthan": {"pH": 8.5, "nitrogen": 0.3, "phosphorus": 12, "potassium": 150, "soil_type": "sandy"},
            "kerala": {"pH": 5.5, "nitrogen": 0.45, "phosphorus": 20, "potassium": 140, "soil_type": "laterite"}
        }
        
        return state_defaults.get(state, {"pH": 7.0, "nitrogen": 0.5, "phosphorus": 25, "potassium": 150, "soil_type": "alluvial"})

    def analyze_soil_quality(self, pH: float, nitrogen: float, phosphorus: float, potassium: float) -> str:
        """
        Analyze overall soil quality
        """
        score = 0
        
        # pH scoring (6.5-7.5 is ideal)
        if 6.5 <= pH <= 7.5:
            score += 40
        elif 6.0 <= pH <= 8.0:
            score += 30
        else:
            score += 10
        
        # NPK scoring
        if nitrogen > 0.25 and phosphorus > 20 and potassium > 150:
            score += 60
        elif nitrogen > 0.15 and phosphorus > 10 and potassium > 100:
            score += 40
        else:
            score += 20
        
        # Return quality assessment
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        else:
            return "Poor"

    def get_farm_recommendations(self, pH: float, nitrogen: float) -> List[str]:
        """
        Get farming recommendations based on soil
        """
        recommendations = []
        
        if pH < 6.5:
            recommendations.append("Add lime to increase pH")
        elif pH > 7.5:
            recommendations.append("Add sulfur to decrease pH")
        
        if nitrogen < 0.2:
            recommendations.append("Apply nitrogen fertilizer")
        
        if not recommendations:
            recommendations.append("Soil conditions are favorable for most crops")
        
        return recommendations

soil_service = SoilService()
