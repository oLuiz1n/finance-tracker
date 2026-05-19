import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewTransaction from "../components/newTransactions/NewTransaction";
import InsightSummary from "../components/insightSummary/InsightSummary.jsx"
import InsightExpenseMonth from "../components/insightExpenseMonth/InsightExpenseMonth.jsx"
import InsightExpenseMonthDetails from "../components/insightExpenseMonthDetails/InsightExpenseMonthDetails.jsx"
import InsightExpenseCategoryMonth from "../components/insightExpenseCategoryMonth/InsightExpenseCategoryMonth.jsx"
import InsightExpenseRanking from "../components/insightExpenseRanking/InsightExpenseRanking.jsx"
import InsightExpenseDay from "../components/insightExpenseDay/InsightExpenseDay.jsx";
import InsightAverageMonth from "../components/insightAverageMonth/InsightAverageMonth.jsx";
import InsightComparison from "../components/insightComparison/InsightComparison.jsx";
import InsightIncomeRanking from "../components/insightIncomeRanking/InsightIncomeRanking.jsx";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
    
    const [diaSelecionado, setDiaSelecionado] = useState(null);
    const [mesSelecionado, setMesSelecionado] = useState(null);
    const [balance, setBalance] = useState([]);
    const [mediaMensal, setMediaMensal] = useState([]);
    const [item, setItem] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarComparison(){
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/month-comparison`)
            const data = await response.json();

            if(!response.ok) {
              const data = await response.json();
              setErro(data.mensagem || "Erro ao mostrar insight");
              navigate("/");
              return;
            };

            setItem(data[0]);
          } catch (error) {
              setErro("Erro ao conectar com o servidor", error)
          }
        };
        async function buscarAverage(){
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/averageMonth`)
            const data = await response.json();

            if(!response.ok) {
              const data = await response.json();
              setErro(data.mensagem || "Erro ao mostrar insight");
              navigate("/");
              return;
            };

            setMediaMensal(data[0]);
          } catch (error) {
              setErro("Erro ao conectar com o servidor", error)
          }
        };
        async function buscarSumarry(){
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/summary`)
                const data = await response.json()

            if (!response.ok) {
                const data = await response.json();
                setErro(data.mensagem || "Erro ao mostrar insight");
                navigate("/");
                return;
            };

            setBalance(data);
            } catch (error) {
                setErro("Erro ao conectar com o servidor", error);
            }
        }

        buscarSumarry();
        buscarAverage();
        buscarComparison();
    }, [navigate]);

  return (
    <div className="container">
      <div className="head">
        <NewTransaction />
        <button className="btn-history" onClick={() => navigate("/History")}> Historico </button>
      </div>
      <div className="interface">
      <div className="cards-insight">
        <InsightSummary balance={balance}/>
        <InsightAverageMonth mediaMensal={mediaMensal}/>
      </div>
      <div className="graficos">
        <div className="main">
              { !mesSelecionado ? (
                <InsightExpenseMonth
                  setMesSelecionado={setMesSelecionado}/>
                ) : !diaSelecionado ? (
                  <InsightExpenseDay
                  mesSelecionado={mesSelecionado}
                  setMesSelecionado={setMesSelecionado}
                  setDiaSelecionado={setDiaSelecionado}/>
                ) : (
                  <InsightExpenseMonthDetails
                    diaSelecionado={diaSelecionado}
                    setDiaSelecionado={setDiaSelecionado}/>
                )
              }
            <InsightExpenseCategoryMonth mesSelecionado={mesSelecionado}/>
        </div>
        <div className="minor">
            <InsightExpenseRanking mesSelecionado={mesSelecionado}/>
            <InsightIncomeRanking mesSelecionado={mesSelecionado}/>
        </div>
        </div>
        <div className="cards-comparison">
          <InsightComparison item={item}/>
        </div>
        </div>
    </div>
  )
}

export default Home;