from google import genai
import sys

client = genai.Client(api_key="AIzaSyDscNOtY3lXVAMCNpU9qZzsMVbd6xMolrU")

for m in ['gemini-2.5-flash', 'models/gemini-2.5-flash', 'gemini-1.5-flash', 'models/gemini-1.5-flash']:
    try:
        res = client.models.generate_content(model=m, contents="hello")
        print(m, "WORKS!", res.text[:20])
    except Exception as e:
        print(m, "FAILED!", e)
