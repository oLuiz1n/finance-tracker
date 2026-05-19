import { useState } from "react";

function DeleteTransaction({ id }) {

    const [erro, setErro] = useState("");

    async function handleDeletar(e) {
        e.preventDefault();
        setErro("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URI}/transactions/delete/${id}`, {
                method: "DELETE",
                headers: { "Content-Type" : "application/json" }
            });

        if (!response.ok) {
            const data = await response.json();
            setErro(alert(data.mensagem));
            window.location.reload();
            return;
        }
            alert("Transação deletada com sucesso");
            window.location.reload();
        } catch (error) {
            setErro("Erro ao conectar com o servidor", error);
        };
    };

    return (
        <div>

            <button button className="btnConfirmarDelete" onClick={handleDeletar}>Excluir Transação</button>
            {erro && <p>{erro}</p>}
    
        </div>
    )
};

export default DeleteTransaction;