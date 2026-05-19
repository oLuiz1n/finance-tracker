import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryPage from "../components/HistoryPage.jsx";
import "./History.css";

function History() {
    const navigate = useNavigate();

    const [item, setItem] = useState([]);
    const [erro, setErro] = useState("");
    useEffect(() => {
        async function buscarHistory() {
          try {
              const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions`)
              const data = await response.json();
  
              if(!response.ok) {
                  const data = await response.json();
                  setErro(data.mensagem || "Erro ao mostrar insight");
                  navigate("/");
                  return;
              };

              console.log(data);

          setItem(data)
          } catch (error) {
              setErro("Erro ao conectar com o servidor", error);
          }
        };

        buscarHistory();
    }, [navigate])
    return(
        <div>
            <HistoryPage item={item}/>
        </div>
    )
};

export default History;