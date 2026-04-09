from google import genai
import logging
import asyncio
from config import GEMINI_API_KEY

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

    async def generate_detailed_analysis(self, crop: str, context_data: dict, language: str = "en") -> str:
        """
        Use Google Gemini to generate a tailored, detailed analysis in the requested language.
        """
        if not client:
             return f"AI Engine Offline. {crop} is suitable for your soil."
             
        try:
            target_lang = self._get_target_lang_name(language)
            logger.info(f"🧠 Generating Expert Analysis for {crop} in {target_lang}...")
            
            prompt = f"""
            SYSTEM ROLE: You are 'KrishiSense AI', the world's most helpful agricultural AI assistant.
            TASK: Generate a detailed crop recommendation report for a farmer regarding {crop}.
            
            CRITICAL INSTRUCTION:
            - YOU MUST WRITE THE ENTIRE RESPONSE IN {target_lang.upper()} (NATIVE SCRIPT).
            - DO NOT USE ANY ENGLISH WORDS.
            - ALL HEADERS, BULLETS, AND ANALYSIS MUST BE IN {target_lang}.
            
            REPORT CONTENT:
            Context Data: {context_data}
            
            STRUCTURE:
            1. Single summary sentence at the top in {target_lang}.
            2. Sections with Emoji Headers for:
               🌱 Soil analysis
               🌦️ Weather impact
               📈 Market outlook (Mention {context_data.get('market_profit_margin', 0)}% margin)
            
            Strictly respond in {target_lang}.
            """
            
            # Expanded model list including gemini-2.5-flash as it appeared in logs
            models_to_try = [
                'models/gemini-2.5-flash',
                'models/gemini-1.5-flash', 
                'models/gemini-2.0-flash', 
                'models/gemini-pro',
                'gemini-2.5-flash',
                'gemini-1.5-flash'
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
                raise last_error
            return "Unable to generate analysis. Please try again."
            
        except Exception as e:
            logger.error(f"❌ Gemini Detailed Analysis Error: {str(e)}")
            return f"Detailed analysis for {crop} is currently unavailable. Recommended based on regional data."

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
                'models/gemini-1.5-flash', 
                'models/gemini-2.0-flash', 
                'gemini-1.5-flash'
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
