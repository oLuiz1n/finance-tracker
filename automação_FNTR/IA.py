from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

keyApi = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=keyApi)

def relatorio_ia(texto_prompt):
    resposta = client.models.generate_content(
        model='gemini-3.5-flash',
        contents=texto_prompt
    )
    return resposta.text