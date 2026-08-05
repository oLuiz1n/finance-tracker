from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
import markdown2

def criar_pdf(relatorio_ia, dadosRecebidos):

    caminho_pdf = f'Relatorio financeiro do mes {dadosRecebidos}.pdf'

    document_pdf = SimpleDocTemplate(caminho_pdf, pagesize=A4)

    styles = getSampleStyleSheet()

    elementos = []

    titulo = Paragraph(f'Relatorio financeiro do mes {dadosRecebidos}', styles["Title"])

    elementos.append(titulo)
    elementos.append(Spacer(1, 20))

    html = markdown2.markdown(relatorio_ia)

    blocos = html.split("\n")

    for bloco in blocos:
        if bloco.strip():
            elementos.append(Paragraph(bloco, styles["BodyText"]))
            elementos.append(Spacer(1, 10))

    document_pdf.build(elementos)

    return caminho_pdf