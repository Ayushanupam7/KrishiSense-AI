from google import genai
import logging
import asyncio
from config import GEMINI_API_KEY, SUPPORTED_CROPS

logger = logging.getLogger(__name__)

# Initialize the new Gemini Client
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    logger.error(f"❌ Failed to initialize Gemini Client: {e}")
    client = None

class GeminiService:
    def _get_target_lang_name(self, language_code: str) -> str:
        """Helper to get full language name from code (handles 'hi-IN' etc)"""
        if not language_code: return "English"
        code = language_code.split('-')[0].lower()
        lang_map = {
            "hi": "Hindi", 
            "mr": "Marathi", 
            "gu": "Gujarati", 
            "en": "English"
        }
        return lang_map.get(code, "English")

    async def predict_crop(self, soil_data: dict, weather_data: dict, location_data: dict) -> dict:
        """
        Use Google Gemini to predict the best crop based on soil, weather, and market context.
        Returns format identical to ML model:
        {
            "predicted_crop": "rice",
            "confidence_score": 0.85,
            "top_3_predictions": [["rice", 0.85], ["maize", 0.10], ["jute", 0.05]]
        }
        """
        default_result = {
            "predicted_crop": "rice",
            "confidence_score": 0.50,
            "top_3_predictions": [["rice", 0.50], ["maize", 0.30], ["jute", 0.20]]
        }
        
        if not client:
             logger.warning("Gemini Client offline. Returning default prediction.")
             return default_result
             
        try:
            prompt = f"""
            SYSTEM ROLE: You are an expert agricultural AI crop predictor.
            TASK: Predict the best crop to grow given the following local conditions.
            
            CONDITIONS:
            - Soil: {soil_data}
            - Weather: {weather_data}
            - Location: {location_data}
            
            CRITICAL INSTRUCTION:
            - Output YOUR ENTIRE RESPONSE as a STRICT JSON object ONLY. NO markdown formatting, NO backticks like ```json.
            - MUST ONLY PREDICT CROPS FROM THIS EXACT LIST: {', '.join(SUPPORTED_CROPS)}. Do not predict Mango, Apple, or anything else not in the list.
            - Ensure the JSON format precisely matches this:
            {{
                "predicted_crop": "cropname_in_lowercase",
                "confidence_score": 0.95,
                "top_3_predictions": [
                    ["cropname1", 0.95],
                    ["cropname2", 0.03],
                    ["cropname3", 0.02]
                ]
            }}
            """
            
            models_to_try = [
                'models/gemini-2.5-flash',
                'models/gemini-2.0-flash', 
                'models/gemini-flash-latest',
                'models/gemini-flash-lite-latest',
                'models/gemini-2.5-flash-lite'
            ]
            
            for model_name in models_to_try:
                try:
                    logger.debug(f"Trying Gemini Model for prediction: {model_name}")
                    response = await client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    text = response.text.strip()
                    # Strip any possible markdown
                    if text.startswith("```json"):
                        text = text[7:]
                    if text.startswith("```"):
                        text = text[3:]
                    if text.endswith("```"):
                        text = text[:-3]
                    text = text.strip()
                    
                    import json
                    result = json.loads(text)
                    
                    if "predicted_crop" in result and "confidence_score" in result:
                        logger.info(f"✅ Prediction generated successfully using {model_name}")
                        return result
                except Exception as e:
                    logger.warning(f"⚠️ Model {model_name} failed prediction: {str(e)}")
                    continue
            
            return default_result
        except Exception as e:
            logger.error(f"❌ Gemini Predict Crop Error: {str(e)}")
            return default_result

    async def generate_detailed_analysis(self, crop: str, context_data: dict, language: str = "en") -> str:
        """
        Use Google Gemini to generate a tailored, detailed analysis in the requested language.
        """
        if not client:
             return f"AI Engine Offline. {crop} is suitable for your soil."
             
        try:
            target_lang = self._get_target_lang_name(language)
            logger.info(f"🧠 Generating Expert Analysis for {crop} in {target_lang}...")
            
            lang_extra = "- DO NOT USE ANY ENGLISH WORDS except for technical terms if absolutely necessary." if target_lang.lower() != "english" else ""
            
            prompt = f"""
            SYSTEM ROLE: You are 'KrishiSense AI', the world's most helpful agricultural AI assistant.
            TASK: Generate a detailed crop recommendation report for a farmer regarding {crop}.
            
            CRITICAL INSTRUCTION:
            - YOU MUST WRITE THE ENTIRE RESPONSE IN {target_lang.upper()} (NATIVE SCRIPT).
            {lang_extra}
            
            REPORT CONTENT:
            Context Data: {context_data}
            
            STRUCTURE:
            1. Single summary sentence at the top.
            2. Use Markdown headings (### ) for the following sections:
               ### 🌱 Soil analysis
               ### 🌦️ Weather impact
               ### 📈 Market outlook
            
            Use Markdown bullet points (- ) where beneficial for readability.
            Strictly respond in {target_lang}.
            """
            
            models_to_try = [
                'models/gemini-2.5-flash',
                'models/gemini-2.0-flash', 
                'models/gemini-flash-latest',
                'models/gemini-flash-lite-latest',
                'models/gemini-2.5-flash-lite'
            ]
            
            last_error = None
            for model_name in models_to_try:
                try:
                    logger.debug(f"Trying Gemini Model: {model_name}")
                    response = await client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    text = response.text.strip()
                    if text: 
                        logger.info(f"✅ Analysis generated successfully using {model_name}")
                        return text
                except Exception as e:
                    last_error = e
                    logger.warning(f"⚠️ Model {model_name} failed: {str(e)}")
                    continue
            
            
            if last_error:
                error_str = str(last_error)
                if "429" in error_str or "quota" in error_str.lower() or "exhausted" in error_str.lower():
                    return "🌟 *Expert Analysis is currently in ultra-high demand!* Please wait about 15-20 seconds and click again to generate your deeply personalized, localized report."
                raise last_error
            return "Unable to generate analysis. Please try again."
            
        except Exception as e:
            logger.error(f"❌ Gemini Detailed Analysis Error: {str(e)}")
            return f"Detailed analysis for {crop} is currently unavailable. (Error: {str(e)[:50]})"

    async def generate_market_analysis(self, crop: str, prediction_data: dict, language: str = "en") -> str:
        """
        AI Explanation for the Market Forecast in the requested language.
        """
        if not client:
             return f"Market AI Engine Offline for {crop}."
             
        try:
            target_lang = self._get_target_lang_name(language)
            logger.info(f"📈 Generating Market Reasoning for {crop} in {target_lang}...")

            prompt = f"""
            SYSTEM ROLE: You are a commodities market analyst specializing in Indian Agriculture.
            TASK: Explain the 3-month price forecast for {crop} for a farmer.
            
            CRITICAL INSTRUCTION:
            - YOU MUST WRITE THE ENTIRE RESPONSE IN {target_lang.upper()} (NATIVE SCRIPT).
            - DO NOT USE ENGLISH.
            
            FORECAST DATA: {prediction_data}
            
            INSTRUCTIONS:
            - Explain WHY the price is predicted to {prediction_data.get('trend_direction')} (rise/fall).
            - Use 3-4 short bullet points in {target_lang}.
            
            Strictly respond in {target_lang}.
            """
            
            models_to_try = [
                'models/gemini-2.5-flash',
                'models/gemini-2.0-flash', 
                'models/gemini-flash-latest',
                'models/gemini-flash-lite-latest',
                'models/gemini-2.5-flash-lite'
            ]
            
            for model_name in models_to_try:
                try:
                    response = await client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    text = response.text.strip()
                    if text: return text
                except:
                    continue
            
            return "Market trends analysis currently unavailable."
            
        except Exception as e:
            logger.error(f"❌ Gemini Market API Error: {str(e)}")
            return f"Market forecast reasoning unavailable for {crop}."

gemini_service = GeminiService()
