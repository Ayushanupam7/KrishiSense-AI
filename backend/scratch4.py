import os
filepath = r"x:\Study\Projects\KrishiSense AI\backend\services\gemini.py"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

def fix():
    old_func = re.search(r"async def generate_detailed_analysis.*?def generate_market_analysis", content, re.DOTALL)
    if not old_func: return content
    old_str = old_func.group(0)
    
    prompt_str = """
            lang_extra = "- DO NOT USE ANY ENGLISH WORDS except for technical terms if absolutely necessary." if target_lang.lower() != "english" else ""
            
            prompt = f\"\"\"
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
            \"\"\"
"""
    new_str = re.sub(r'prompt = f\"\"\"[\s\S]*?\"\"\"', prompt_str.strip(), old_str)
    return content.replace(old_str, new_str)

new_content = fix()

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
