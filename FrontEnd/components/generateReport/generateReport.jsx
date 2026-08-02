import { useEffect } from "react";
import { useState } from "react";

const GenerateReport = () => {
    const [dados, setDados] = useState([]);
    const [mesEscolhido, setMesEscolhido] = useState("");

    function gerarRelatorio () {
            
        };

    const handleMesChange = (e) => {
        const selectedMonth = e.target.value;
        setMesEscolhido(selectedMonth);
    };

    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/months`);
                const jsonResponse = await response.json();

                const dadosFormatados = jsonResponse.map(v => ({
                    mes: v.month
                }))

                setDados(dadosFormatados)
            } catch (error) {
                console.log("Erro ao solicitar relatorio", error);
            }
        };
            pegarInfosAPI();
    }, []);

    return (
        <div>
        <select value={mesEscolhido} onChange={handleMesChange}>
            <option value="">Selecione o mes</option>
            {dados.map((item) => (
                <option key={item.mes} value={item.mes}>
                    {item.mes}
                </option>
            ))}
        </select>
        <button onClick={gerarRelatorio}> Gerar Relatorio</button>
        </div>
    );
};

export default GenerateReport;