"""
Crop Price Prediction Service
Analyzes historical trends and predicts future market prices after cultivation
"""
from typing import Dict, List, Optional
import numpy as np
from datetime import datetime, timedelta
import logging
from .mandi import mandi_service

class PricePredictionService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Seasonal weight factors for Indian crops (simplified coefficients)
        # Higher = price likely to peek in that month
        self.seasonal_patterns = {
            "Onion": [1.0, 0.9, 0.8, 1.1, 1.2, 1.3, 1.4, 1.6, 1.8, 2.2, 2.5, 1.8],
            "Tomato": [1.2, 1.4, 1.6, 1.8, 2.2, 2.8, 3.2, 2.8, 2.2, 1.8, 1.4, 1.2],
            "Wheat": [1.1, 1.2, 1.3, 1.0, 0.9, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.5],
            "Rice": [1.2, 1.3, 1.5, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 1.1, 1.2],
            "Default": [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 1.0, 1.0]
        }
        # Typical cultivation duration in months
        self.crop_durations = {
            "Onion": 4, 
            "Tomato": 3,
            "Wheat": 5,
            "Rice": 4,
            "Potato": 4,
            "Ginger": 9,
            "Garlic": 6,
            "Chilli": 5,
            "Cotton": 6,
            "Sugarcane": 12,
            "Default": 4
        }

    async def predict_crop_price(self, crop: str, state: str = None, district: str = None) -> Dict:
        """
        Predict price of a crop after its specific cultivation duration
        """
        try:
            # 1. Get current market price (Live)
            market_data = await mandi_service.get_detailed_results(commodity=crop, state=state, district=district, limit=1)
            current_price = 2500 # Fallback
            if market_data:
                current_price = market_data[0]['price']
            else:
                # Use typical prices fallback if live fails
                typical = mandi_service._get_typical_prices()
                current_price = typical.get(crop, 2500)

            # 2. Simulate historical 6-month trend (or fetch if API allowed deep history)
            # For this MVP, we simulate realistic history based on seasonality + small noise
            history = self._generate_simulated_history(crop, current_price)
            
            # 3. Predict price after cultivation period
            duration = self.crop_durations.get(crop, self.crop_durations["Default"])
            current_month_idx = (datetime.now().month - 1)
            prediction_month_idx = (current_month_idx + duration) % 12
            
            # Simple Prediction Logic: 
            # Future = Current * (Future_Season_Factor / Current_Season_Factor) * Trend_Coefficient
            pattern = self.seasonal_patterns.get(crop, self.seasonal_patterns["Default"])
            current_factor = pattern[current_month_idx]
            future_factor = pattern[prediction_month_idx]
            
            # Calculate trend from history (simple linear slope)
            prices = [h['price'] for h in history]
            x = np.arange(len(prices))
            slope, intercept = np.polyfit(x, prices, 1)
            
            # Composite prediction
            # Base price from slope + seasonality adjustment
            raw_prediction = (current_price + (slope * duration)) * (future_factor / current_factor)
            
            # CRITICAL FIX: Ensure price never goes negative or drops irrationally low
            # A crop price rarely drops more than 40% in a single season
            price_floor = current_price * 0.6 
            predicted_price = max(raw_prediction, price_floor, 100.0)
            
            # 4. Generate Analysis & Explanation
            diff_pct = ((predicted_price / current_price) - 1) * 100
            trend_direction = "rise" if diff_pct > 2 else "fall" if diff_pct < -2 else "stable"
            
            analysis = self._generate_analysis_text(crop, trend_direction, diff_pct, prediction_month_idx, duration)

            return {
                "crop": crop,
                "current_price": round(current_price, 2),
                "predicted_price": round(predicted_price, 2),
                "price_change_percentage": round(diff_pct, 1),
                "trend_direction": trend_direction,
                "prediction_period_months": duration,
                "historical_trend": history,
                "analysis": analysis,
                "prediction_date": (datetime.now() + timedelta(days=30 * duration)).strftime("%B %Y")
            }

        except Exception as e:
            self.logger.error(f"Prediction Error: {str(e)}")
            raise e

    async def get_detailed_report(self, crop: str, prediction_data: dict, language: str = "en") -> str:
        """
        AI-generated reasoning for the market forecast
        """
        try:
            from .gemini import gemini_service
            report = await gemini_service.generate_market_analysis(crop, prediction_data, language)
            return report
        except Exception as e:
            self.logger.error(f"Detailed Report Error: {str(e)}")
            return "Detailed analysis currently unavailable. Our models rely on seasonal mandi trends and supply-chain cycles."

    def _generate_simulated_history(self, crop: str, current_price: float) -> List[Dict]:
        """Generates realistic historical data points for the graph"""
        history = []
        pattern = self.seasonal_patterns.get(crop, self.seasonal_patterns["Default"])
        now = datetime.now()
        
        for i in range(6, 0, -1):
            past_date = now - timedelta(days=30 * i)
            month_idx = (past_date.month - 1)
            
            # Simulate price based on seasonality relative to current
            current_month_idx = (now.month - 1)
            seasonal_ratio = pattern[month_idx] / pattern[current_month_idx]
            
            # Add small random fluctuation (2-5%)
            noise = np.random.uniform(0.95, 1.05)
            price = current_price * seasonal_ratio * noise
            
            history.append({
                "month": past_date.strftime("%b"),
                "price": round(price, 2),
                "is_prediction": False
            })
            
        return history

    def _generate_analysis_text(self, crop: str, trend: str, pct: float, month_idx: int, duration: int) -> str:
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        target_month = months[month_idx]
        
        if trend == "rise":
            return f"{crop} prices are expected to {trend} by {abs(pct):.1f}% by {target_month} (after {duration} months of cultivation). This peak aligns with historical supply cycles."
        elif trend == "fall":
            return f"{crop} prices might {trend} by {abs(pct):.1f}% heading into {target_month}. After the {duration} month growth cycle, fresh harvests typically lower mandi rates."
        else:
            return f"The market for {crop} appears stable. Prices in {target_month} (at harvest time) are projected to remain consistent with current levels."

price_prediction_service = PricePredictionService()
