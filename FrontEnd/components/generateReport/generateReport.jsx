import { useEffect } from "react";
import { useState } from "react";

const GenerateReport = () => {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        const pegarInfosAPI = async () => {
            try {
                
                const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/months`);
                const jsonResponse = await response.json();

                const dadosFormatados = jsonResponse.map(v => ({
                    mes: v.month
                }))

                console.log(dadosFormatados)

                setDados(dadosFormatados)
            } catch (error) {
                console.log("Erro ao solicitar relatorio", error);
            }
        };
            pegarInfosAPI();
    }, []);

    return (
        <select>
            {dados.map((item) => (
                <option key={item.mes} value={item.mes}>
                    {item.mes}
                </option>
            ))}
        </select>
    );
};

export default GenerateReport;