import asyncio
from services.gemini import gemini_service
import logging

logging.basicConfig(level=logging.DEBUG)

async def main():
    try:
        report = await gemini_service.generate_detailed_analysis("Cotton", {"market_profit_margin": 15}, "en")
        print(report)
    except Exception as e:
        print("EXCEPTION:", e)

if __name__ == "__main__":
    asyncio.run(main())
