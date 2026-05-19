import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title } from "chart.js";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title );

const InsightExpenseMonth = ({ setMesSelecionado }) => {
    const [arrTotalExpense, setArrTotalExpense] = useState([]);

    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/monthExpense`);
                const jsonResponse = await response.json();

                const dadosFormatados = jsonResponse.map(v => ({
                    mes: v.month,
                    totalExpense: Number(v.total)
                }));

                setArrTotalExpense(dadosFormatados);

            } catch (error) {
                console.log("Erro no grafico", error);
            }
        };

        pegarInfosAPI();
    });

    const data = {
        labels: arrTotalExpense.map(v => v.mes),
        datasets: [
            {
                label: "Total Gasto",
                data: arrTotalExpense.map(v => v.totalExpense),

                borderColor: '#a855f7', 
                borderWidth: 3,
                tension: 0,
                
                pointBackgroundColor: '#fff',
                pointBorderColor: '#a855f7',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,

                fill: true,
                
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
                    
                    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');  
                    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.3)'); 
                    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)'); 
                    
                    return gradient;
                },
                },
        ],
    };

    const options = {
        responsive: true,

        onClick: (event, element) => {
            if (!element.length) return;

            const index = element[0].index;

            const mesClicado = arrTotalExpense[index].mes;

            setMesSelecionado(mesClicado);
        },

        plugins: {
            legend: {
                display: false,
            },
            
            title: {
                display: true,
                text: "Gastos Mensais",
                color: "White",

                font: {
                    size: 20,
                    weight: "bold",
                },

                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },

        scales: {
                x: {
                display: true,
                grid: { display: false }
            },
                y: {
                display: false,
                grid: { display: false }
                }
        }
    };

    return (
        <div>
            <div className="grafico">
                <Line data={data} options={options}/>
            </div>
        </div>
    );
};

export default InsightExpenseMonth;