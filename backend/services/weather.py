"""
Weather data fetching and integration
"""
import requests
from typing import Dict, Optional
from config import OPENWEATHER_API, WEATHER_API_KEY

class WeatherService:
    def __init__(self):
        self.api_key = WEATHER_API_KEY
        self.base_url = OPENWEATHER_API

    def get_estimated_rainfall(self, month: int) -> float:
        """
        Since the live API only returns rainfall if it is currently raining this exact hour,
        provide a realistic estimated seasonal average for the ML model and UI.
        """
        if month in [6, 7, 8, 9]:
            return 145.5  # Heavy Monsoon
        elif month in [10, 11, 12]:
            return 45.0   # Post-monsoon / Winter
        elif month in [1, 2]:
            return 25.0   # Late Winter
        else:
            return 15.0   # Summer / Pre-monsoon

    async def get_weather(self, latitude: float, longitude: float) -> Dict:
        """
        Fetch real-time weather data from OpenWeatherMap
        """
        try:
            params = {
                "lat": latitude,
                "lon": longitude,
                "appid": self.api_key,
                "units": "metric"
            }
            
            response = requests.get(self.base_url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # Use real rain if it's currently raining, otherwise use a historical seasonal estimate
            real_rain = data.get("rain", {}).get("1h", 0)
            if real_rain == 0:
                from datetime import datetime
                real_rain = self.get_estimated_rainfall(datetime.now().month)
            
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "rainfall": round(real_rain, 1),
                "wind_speed": data["wind"]["speed"],
                "weather_desc": data["weather"][0]["description"],
                "pressure": data["main"]["pressure"],
                "success": True
            }
        except Exception as e:
            from datetime import datetime
            return {
                "error": str(e),
                "success": False,
                # Fallback demo data
                "temperature": 28.0,
                "humidity": 65,
                "rainfall": self.get_estimated_rainfall(datetime.now().month),
                "wind_speed": 10.0
            }

    def get_season_from_month(self, month: int) -> str:
        """
        Determine season based on month
        """
        if month in [6, 7, 8, 9]:
            return "kharif"  # Monsoon crop
        elif month in [10, 11, 12, 1, 2]:
            return "rabi"    # Winter crop
        else:
            return "zaid"    # Summer crop

weather_service = WeatherService()
