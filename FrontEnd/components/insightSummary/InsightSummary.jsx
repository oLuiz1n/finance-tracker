function summaryBalance ({ balance }) {
    return (
        <div className="itens-cards">
            <div className="card saldo">
                <h1>Saldo</h1>
                <p>{Number(balance.balance).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    })}
                </p>
            </div>
            <div className="card entrada">
                <h1>Entradas</h1>
                <p>{Number(balance.totalIncome).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    })}
                </p>
            </div>
            <div className="card despesa">
                <h1>Despesas</h1>
                <p>{Number(balance.totalExpense).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                    })}
                </p>
            </div>
        </div>
    );
};

export default summaryBalance;