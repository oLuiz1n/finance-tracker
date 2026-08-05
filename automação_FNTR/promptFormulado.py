def criar_prompt(requisicaoJson):
    prompt = f'''

        Você é um analista financeiro especializado em análise de gastos pessoais.

        Com base nos dados financeiros abaixo, gere um relatório detalhado do mês.

        Analise:
        - saldo final
        - receitas
        - despesas
        - principais categorias de gastos
        - maiores fontes de recebimento
        - padrões de consumo
        - possíveis problemas financeiros
        - recomendações práticas para melhorar a organização financeira

        Seja claro, objetivo e escreva como um relatório profissional para o usuário.

        Dados financeiros: {requisicaoJson}

        O relatório deve conter:
        1. Resumo financeiro do mês
        2. Análise das receitas
        3. Análise dos gastos
        4. Categorias que mais impactaram o orçamento
        5. Pontos positivos
        6. Pontos de atenção
        7. Recomendações para o próximo mês

        '''
    return prompt