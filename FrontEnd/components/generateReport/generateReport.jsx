import { useEffect } from "react";
import { useState } from "react";

const GenerateReport = () => {
    const [dados, setDados] = useState([]);
    const [mesEscolhido, setMesEscolhido] = useState("");

    const gerarRelatorio = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URIP}/generate-report`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mes: mesEscolhido
                    })
                });

                const pdf = await response.blob();

                const urlPDF =  window.URL.createObjectURL(pdf);

                const link = document.createElement("a");

                link.href = urlPDF;
                link.download = `RelatorioFinanceiro${mesEscolhido}.pdf`;

                document.body.appendChild(link);

                link.click();
                link.remove();

            } catch (error) {
                console.log("Erro ao gerar relatório:", error);
            }
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