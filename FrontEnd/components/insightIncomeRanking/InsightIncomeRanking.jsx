import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InsightIncomeRanking = ({ mesSelecionado }) => {
    const [arrIncomes, setArrIncomes] = useState([]);
    const mesFiltro = (mesSelecionado || "") ? mesSelecionado : "Todos os meses";

    useEffect(() => {
            const pegarInfosAPI = async () => {
                try {

                    const mesFiltro = mesSelecionado || "";
                    
                    const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/incomeRanking?month=${mesFiltro}`);
                    const jsonResponse = await response.json();

                    const dadosFormatados = jsonResponse.map(v => ({
                        categoria: v.category,
                        valor: Number(v.total)
                    }));

                    setArrIncomes(dadosFormatados);

                } catch (error) {
                    console.log("Erro no grafico", error);
                }
            };

            pegarInfosAPI();
    }, [mesSelecionado]);

    const data = {
        labels: arrIncomes.map(v => v.categoria),
        datasets: [
            {
                label: 'Total Gasto',
                data: arrIncomes.map(v => v.valor),
                backgroundColor:
                    [
                        '#a855f7',
                        '#f97316',
                        '#ef4444',
                        '#06b6d4',
                        '#10b981'
                    ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,

        cutout: '60%',

        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: 'white',
                    font: {
                        family: 'Montserrat',
                        size: 14
                    }
                }
            },
            
            title: {
                display: true,
                text: `Top 5 categorias de receita do mes: ${mesFiltro}`,
                color: "white",

                font: {
                    size: 20,
                    weight: "bold",
                },
            },
        },

    scales: {
        x: {
        display: false,
        grid: { display: false }
    },
        y: {
        display: false,
        grid: { display: false }
        }
    },
};

    return (
        <div className='grafico2'>
            <Doughnut data={data} options={options}/>
        </div>
    )
};

export default InsightIncomeRanking;