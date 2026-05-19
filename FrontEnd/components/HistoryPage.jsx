import DeleteTransaction from "../components/deleteTransaction/DeleteTransaction.jsx";

function HistoryPage ({ item }) {
    return(
        <div className="cards-history">
            {item.map((transaction, index) =>(
                <div className="cards-unique" key={index}>

                        <p>Transação: {index + 1}</p>

                    <p>Id Da Transação: {transaction.id}</p>
                    <p>Descrição: {transaction.description}</p>
                    <p>Total: {Number(transaction.amount).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                        })}
                    </p>
                    <p>Tipo Transação: {transaction.type}</p>
                    <p>Categoria: {transaction.category}</p>
                    <p>Data Transação: {transaction.transaction_date.split("T")[0]}</p>
                    <p>Data Criação: {transaction.created_at.split("T")[0]}</p>

                    <DeleteTransaction id={transaction.id}/>
                </div>
            ))}
        </div>
    )
};

export default HistoryPage;