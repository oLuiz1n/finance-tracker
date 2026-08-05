from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from promptFormulado import criar_prompt
from IA import relatorio_ia
from criarPDF import criar_pdf
from flask import send_file

app = Flask(__name__)
CORS(app)

load_dotenv()

api_uri= os.getenv("VITE_API_URI")


@app.post("/generate-report")
def generate_report():
    dadosRecebidos = request.json

    mes = dadosRecebidos["mes"]

    link_api = f'{api_uri}/transactions/report?month={mes}'

    requisicao = requests.get(link_api)

    requisicaoJson = requisicao.json()

    prompt = criar_prompt(requisicaoJson)

    resposta_ia = relatorio_ia(prompt)

    pdf_criado = criar_pdf(resposta_ia, dadosRecebidos["mes"])

    return send_file(
        pdf_criado,
        as_attachment=True,
        download_name=f"RelatorioFinanceiro{mes}.pdf"
    )

if __name__ == '__main__':
    app.run(debug=True)