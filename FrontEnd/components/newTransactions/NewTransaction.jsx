import { useState } from "react";

function NewTransaction() {
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState(""); 
    const [options, setOptions] = useState([]);   
    const [transaction_date, setTransactionDate] = useState("");
    const [amount, setAmount] = useState("");
    const [erro, setErro] = useState("");
    
    const dado = {
        expense: ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Lazer", "Assinaturas", "Compras", "Contas", "Investimentos", "Dívidas", "Impostos", "Outros"],
        income: ["Salário", "Freelance", "Investimentos", "Vendas", "Presentes", "Reembolsos", "Outros"]
    };

    const handleTipoChange = (e) => {
        const selectedType = e.target.value;
        setType(selectedType);      
        setCategory("");           
        setOptions(dado[selectedType] || []); 
    };

    async function handleNewTransaction(e) {
        e.preventDefault();
        setErro("");

        if (!description || !type || !category || !transaction_date || !amount) {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    description: description.trim(), 
                    type, 
                    category,
                    transaction_date, 
                    amount: Number(amount)
                })
            });

            if (!response.ok) {
                const data = await response.json();
                setErro(data.mensagem || "Erro ao cadastrar");
                return;
            }
            alert("Transação cadastrada com sucesso");
            window.location.reload();
        } catch (error) {
            setErro("Erro ao conectar com o servidor", error);
        }
    }

    return (
        <div className="form">
            <form onSubmit={handleNewTransaction}>
                <input className="inp-desc" type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />

                <select value={type} onChange={handleTipoChange}>
                    <option value="">Selecione o Tipo</option>
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                </select>

                <select 
                    disabled={options.length === 0} 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Selecione a categoria</option>
                    {options.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <input className="inp-date" type="date" value={transaction_date} onChange={(e) => setTransactionDate(e.target.value)} />
                <input className="inp-tot" type="number" placeholder="Valor" value={amount} onChange={(e) => setAmount(e.target.value)} />
                
                <button type="submit">Cadastrar</button>
                {erro && <p style={{color: 'red'}}>{erro}</p>}
            </form>
        </div>
    );
}

export default NewTransaction;