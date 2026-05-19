import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend);

const InsightExpenseCategoryMonth = ({ mesSelecionado }) => {
    const [arrExpenseCategory, setArrExpenseCategory] = useState([]);
    const mesAtual = new Date().toISOString().slice(0, 7);
    const mesFiltro = mesSelecionado || mesAtual;
    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {

                const mesAtual = new Date().toISOString().slice(0, 7);

                const mesFiltro = mesSelecionado || mesAtual;

                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/expenseByCategory/perMonth?month=${mesFiltro}`);
                const jsonResponse = await response.json();

                const dadosFormatados = jsonResponse.map(v => ({
                    categoria: v.category,
                    total: v.total
                }))

                setArrExpenseCategory(dadosFormatados);
            } catch (error) {
                console.log("Erro no grafico", error);
            }
        };
            pegarInfosAPI();
    }, [mesSelecionado]);

    const data = {
        labels: arrExpenseCategory.map(v => v.categoria),
        datasets: [
            {
                label: "Total Gasto",
                data: arrExpenseCategory.map(v => v.total),

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
        indexAxis: 'y',

        plugins: {
            legend: {
                display: false,
            },
            
            title: {
                display: true,
                text: `Gastos Por Categoria do mes ${mesFiltro}`,
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
                display: true,
                grid: { display: false }
                }
        },
    };
    return (
        <div>
            <div className='grafico'>
                <Bar data={data} options={options}/>
            </div>
        </div>
    );
};



export default InsightExpenseCategoryMonth;