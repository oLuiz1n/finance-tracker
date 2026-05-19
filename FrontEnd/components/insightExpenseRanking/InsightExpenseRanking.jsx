import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InsightExpenseRanking = ({mesSelecionado}) => {
    const [arrExpenses, setArrExpenses] = useState([]);
    const mesFiltro = (mesSelecionado || "") ? mesSelecionado : "Todos os meses";
    
    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {

                const mesFiltro = mesSelecionado || "";

                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/expenseRanking?month=${mesFiltro}`);
                const jsonResponse = await response.json();

                const dadosFormatados = jsonResponse.map(v => ({
                    categoria: v.category,
                    total: Number(v.total)
                }));

                setArrExpenses(dadosFormatados);
            } catch (error) {
                console.log("Erro no grafico", error);
            }
        };

        pegarInfosAPI();
    }, [mesSelecionado]);

    const data = {
        labels: arrExpenses.map(v => v.categoria),
        datasets: [
            {
                label: 'Total Gasto',
                data: arrExpenses.map(v => v.total),
                backgroundColor:
                    [
                        '#a855f7',
                        '#f97316',
                        '#ef4444',
                        '#06b6d4',
                        '#10b981',
                        '#3b82f6', 
                        '#ec4899', 
                        '#eab308', 
                        '#84cc16', 
                        '#f43f5e', 
                        '#6366f1',
                        '#14b8a6',
                        '#a1a1aa'
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
      text: `Top 5 categorias gastos do mes: ${mesFiltro}`,

      color: 'white',

      font: {
        size: 20,
        weight: 'bold'
      }
    },

    tooltip: {
      titleColor: 'white',

      borderWidth: 1,

      padding: 12
    }
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
    }
};


    return (
        <div className='grafico2'>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default InsightExpenseRanking;