from google import genai
import sys
import os

# Add backend to path for config
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from backend.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

try:
    for model in client.models.list():
        print(f"Model ID: {model.name}, Display Name: {model.display_name}")
except Exception as e:
    print(f"Error: {e}")
