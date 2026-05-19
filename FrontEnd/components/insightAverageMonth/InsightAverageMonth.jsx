function InsightAverageMonth ({ mediaMensal }) {
    return(
        <div className="dashboard-header">
            <div className="card average">
                <h1>Media Gastos</h1>
                <p>{Number(mediaMensal.mediaMensal).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    })}
                </p>
            </div>
        </div>
    );
};

export default InsightAverageMonth;