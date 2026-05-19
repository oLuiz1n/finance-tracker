import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title } from "chart.js";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title );

const InsightExpenseDay = ({ mesSelecionado, setMesSelecionado, setDiaSelecionado }) => {
    const [arrExpenseDay, setArrExpenseDay] = useState([]);

    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {

                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/expenseByCategory/perDay?month=${mesSelecionado}`);
                const jsonResponse = await response.json();

                const dadosFormatados = jsonResponse.map(v => ({
                    dia: v.dia,
                    total: Number(v.amount)
                }));

                setArrExpenseDay(dadosFormatados);

            } catch (error) {
                console.log("Erro no grafico", error);
            }
        };
        if(mesSelecionado){
            pegarInfosAPI();
        }; 
    }, [mesSelecionado]);

    const data = {
        labels: arrExpenseDay.map(v => v.dia),
        datasets: [
            {
                label: "Total Gasto",
                data: arrExpenseDay.map(v => v.total),
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

            const diaClicado = arrExpenseDay[index].dia;

            setDiaSelecionado(diaClicado);
        },

        plugins: {
            legend: {
                display: false,
            },
            
            title: {
                display: true,
                text: `Gastos Por dia do mes ${mesSelecionado}`,
                color: "white",

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
        <div className='grafico'>
            <Line data={data} options={options}/>
            <button onClick={() => setMesSelecionado(null)}> Voltar </button>
        </div>
    )
};

export default InsightExpenseDay;