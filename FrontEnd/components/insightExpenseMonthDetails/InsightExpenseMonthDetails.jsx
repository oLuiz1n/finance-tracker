import { useEffect, useState } from "react";

const InsightExpenseMonthDetails = ({ diaSelecionado, setDiaSelecionado }) => {
    const [detalhes, setDetalhes] = useState([]);

    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/monthExpense/details?day=${diaSelecionado}`);
                const jsonResponse = await response.json();

                setDetalhes(jsonResponse);

            } catch (error) {
                console.log("Erro no grafico", error);
            }
        };
        if(diaSelecionado){
            pegarInfosAPI();
        }; 
    }, [diaSelecionado])

    return (
        <div className="details-head">
                <h1>Gastos Detalhados ({diaSelecionado})</h1>
            <div className="details-container">
                {detalhes.map((item, index) => (
                        <div className="card detail" key={index}>

                                <p>Transação: {index + 1}</p>

                            <p>Descrição: {item.description}</p>
                            <p>Categoria: {item.category}</p>
                            <p>Valor: {Number(item.amount).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                        })}
                            </p>
                            <p>Data da Transação: {item.day}</p>

                        </div>
                    ))
                }
            </div>
            <div className="btn-back">
                <button onClick={() => setDiaSelecionado(null)}> Voltar </button>
            </div>
        </div>
    );
};

export default InsightExpenseMonthDetails;