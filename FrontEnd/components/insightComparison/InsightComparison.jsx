function InsightComparison ({ item }) {

    const trendFiltro = (item.trend == "up") ? "▲" : "▼";
    const textoTooltip = item.trend === "up" ? "Economizou" : "Gastou a mais";
    const classeTrend = (item.trend == "up") ? "trend-up" : "trend-down";

    return (
        <div className="container-comparison">
            <div className="atual">
                <h1>Atualmente:</h1>
            <p>Mes: {item.data_atual}</p>
            <p>Saldo mes atual: {Number(item.total_atual).toLocaleString('pt-BR', {
                    style: 'currency',
                currency: 'BRL'
                })}
            </p>
            </div>
            <div className="anterior">
                <h1>Anteriormente:</h1>
            <p>Mês: {item.mes_anterior}</p>
            <p>Saldo mes anterior: {Number(item.total_anterior).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
                })}
            </p>
            </div>
            <div className="insights">
                <h1>Insights:</h1>
            <p>Diferença: {Number(item.difference).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
                })}
            </p>
            <p className={`percentual-texto ${classeTrend}`}>Percentual: {item.percentageChange}% {' '}
                <span 
                    className={`seta-tooltip ${classeTrend}`} 
                    data-tooltip={textoTooltip}
                >
                {trendFiltro}
                </span>
            </p>
            </div>
            </div>
    )
};

export default InsightComparison;