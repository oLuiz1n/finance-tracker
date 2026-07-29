import express from "express";
import pool from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config({ path: '../.env' });
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('Conectado ao Banco de Dados');
    } catch (error) {
        console.log('Erro ao conectar com o Banco de Dados', error);
    }
};

connectDB();

app.get('/transactions', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM transactions');
  res.json(rows);
});

app.post('/transactions', async (req, res) => {
    try {

        const description = req.body.description?.trim();
        const type = req.body.type?.trim().toLowerCase();
        const category = req.body.category?.trim();
        const transaction_date = req.body.transaction_date?.trim();
        const amount = Number(req.body.amount);

        if (!description || !type || !category || !transaction_date || !req.body.amount) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
        };

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ mensagem: 'Amount deve ser um número maior que zero' });
        };

        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({ mensagem: 'Type deve ser income ou expense' });
        };

        const[resultado] = await pool.query('INSERT INTO transactions (description, amount, type, category, transaction_date) VALUES (?,?,?,?,?);', [description, amount, type, category, transaction_date]);

        res.json({
            mensagem: "Transação criada com sucesso",
            id: resultado.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    };
});

app.get('/transactions/summary', async (req, res) => {
    try {
        const[resultado] = await pool.query(`SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense, 
            SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance FROM transactions;`);

        return res.json(resultado[0]);
    } catch (error) {
        res.status(500).json({ error: error.message});
    };
});

app.get('/transactions/monthExpense', async (req, res) => {
    try {
        const[resultado] = await pool.query(`SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS month,  SUM(amount) AS total
                FROM transactions
                WHERE type = 'expense'
                GROUP BY month
                ORDER BY month ASC;`
            );

        return res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    };
});

app.get('/transactions/monthExpense/details', async (req, res) => {
    try {
        const { day } = req.query;

        
            const[resultado] = await pool.query(`SELECT DATE_FORMAT(transaction_date, '%Y-%m-%d') AS day, description, category, amount
                FROM transactions
                WHERE type = 'expense'
                AND DATE_FORMAT(transaction_date, '%Y-%m-%d') = ?
                ORDER BY transaction_date DESC;`,
                [day]
            );

            if ( resultado.length === 0) {
                return res.json({ message: 'Nenhum gasto encontrado para este mês' });
            };
    
            return res.json(resultado);    
    } catch (error) {
        res.status(500).json({ error: error.message});
    };
});

app.get('/transactions/expenseByCategory/perMonth', async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
           const[resultado] = await pool.query (`SELECT category, sum(amount) AS total, DATE_FORMAT(transaction_date, '%Y-%m') AS month
                FROM transactions
                WHERE type = 'expense'
                GROUP BY category, month;`
            );
            return res.json(resultado);
        };

        const[resultado] = await pool.query(`SELECT category, sum(amount) AS total
                FROM transactions
                WHERE type = 'expense'
                AND DATE_FORMAT(transaction_date, '%Y-%m') = ?
                GROUP BY category;`,
                [month]
            );
        
        if ( resultado.length === 0) {
            const [zerado] = await pool.query(`SELECT category, sum(amount) AS total, DATE_FORMAT(transaction_date, '%Y-%m') AS month
                FROM transactions
                WHERE type = 'expense'
                AND DATE_FORMAT(transaction_date, '%Y-%m') = ?
                GROUP BY category;`,
                [month]
            );
            return res.json(zerado);
        };

        return res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    };
});

app.get('/transactions/expenseRanking', async (req, res) => {
    try {
        const { month } = req.query;

        if(!month) {
            const[resultado] = await pool.query(`SELECT category, sum(amount) AS total
                FROM transactions
                WHERE type = 'expense'
                GROUP BY category 
                ORDER BY total DESC limit 5;`
            );

            return res.json(resultado);
        }

        const[resultado] = await pool.query(`SELECT category, sum(amount) AS total
                FROM transactions
                WHERE type = 'expense'
                AND DATE_FORMAT(transaction_date, '%Y-%m') = ?
                GROUP BY category 
                ORDER BY total desc limit 5;`,
                [month]
            );

        if ( resultado.length === 0) {
            return res.json({ message: 'Nenhum gasto encontrado para este mês' });
        };

        return res.json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.get(`/transactions/incomeRanking`, async (req, res) => {
    try {
        const { month } = req.query;

        if(!month) {
            const [resultado] = await pool.query(`SELECT category, sum(amount) AS total
                FROM transactions
                WHERE type = 'income'
                GROUP BY category 
                ORDER BY total desc limit 5;`
            );

            return res.json(resultado);
        };

            const [resultado] = await pool.query(`SELECT category, sum(amount) AS total
                FROM transactions
                WHERE type = 'income'
                AND DATE_FORMAT(transaction_date, '%Y-%m') = ?
                GROUP BY category 
                ORDER BY total desc limit 5;`,
                [month]
            );

            if ( resultado.length === 0) {
            return res.json({ message: 'Nenhum gasto encontrado para este mês' });
            };

            return res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
})

app.get('/transactions/expenseByCategory/perDay', async (req, res) => {
    try {
        const { month } = req.query;

        if(!month) {
            const[resultado] = await pool.query(`SELECT category, DATE_FORMAT(transaction_date, '%Y-%m-%d') AS dia, SUM(amount) AS amount
                FROM transactions
                WHERE type = 'expense'
                GROUP BY dia
                ORDER BY dia ASC;`
            );
        return res.json(resultado);
        }

        const[resultado] = await pool.query(`SELECT category, DATE_FORMAT(transaction_date, '%Y-%m-%d') AS dia, SUM(amount) AS amount
                FROM transactions
                WHERE type = 'expense'
                AND DATE_FORMAT(transaction_date, '%Y-%m') = ?
                GROUP BY dia
                ORDER BY dia ASC;`,
                [month]
            );

        if (resultado.length === 0 ) {
            return res.json({ message: 'Nenhum gasto encontrado para este mês' })
        };

        return res.json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.get('/transactions/averageMonth', async (req, res) => {
    try {
        const[resultado] = await pool.query(`SELECT ROUND(AVG(total_mensal), 2) AS mediaMensal
                FROM (
                    SELECT 
                    DATE_FORMAT(transaction_date, '%Y-%m') AS month,
                    SUM(amount) AS total_mensal
                    FROM transactions
                    WHERE type = 'expense'
                    GROUP BY month
                ) AS gastos_por_mes;`
            );

            return res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.get('/transactions/month-comparison', async (req, res) => {
    try {
        const[resultado] = await pool.query(`SELECT * FROM 
                    vw_data_atual, 
                    vw_total_atual, 
                    vw_mes_anterior, 
                    vw_total_anterior, 
                    vw_atual_anterior, 
                    vw_percentage_change, 
                    vw_trend;`
            );

            return res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.get('/transactions/report', async (req, res) => {
    try {
        
        const { month } = req.query;

        const [
            [saldoMensal],
            [receita],
            [despesas],
            [transacoes],
            [topGastos],
            [topRecebimentos]
        ] = await Promise.all([
            pool.query(`SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS saldo FROM transactions
                        WHERE date_format(transaction_date, '%Y-%m') = ?`, [month]),
            pool.query(`SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome FROM transactions
                        WHERE date_format(transaction_date, '%Y-%m') = ?;`, [month]),
            pool.query(`SELECT COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense FROM transactions
                        WHERE date_format(transaction_date, '%Y-%m') = ?;`, [month]),
            pool.query(`SELECT * FROM transactions
                        WHERE date_format(transaction_date, '%Y-%m') = ?
                        ORDER BY transaction_date DESC;`, [month]),
            pool.query(`SELECT category, COALESCE(sum(amount), 0) AS total
                        FROM transactions
                        WHERE type = 'expense'
                        AND date_format(transaction_date, '%Y-%m') = ?
                        GROUP BY category 
                        ORDER BY total DESC limit 5;`, [month]),
            pool.query(`SELECT category, COALESCE(sum(amount), 0) AS total
                        FROM transactions
                        WHERE type = 'income'
                        AND date_format(transaction_date, '%Y-%m') = ?
                        GROUP BY category 
                        ORDER BY total DESC limit 5;`, [month])
        ])

            return res.json({
                saldoMensal,
                receita: receita[0].totalIncome,
                despesas: despesas[0].totalExpense,
                transacoes,
                topGastos,
                topRecebimentos
            });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.delete(`/transactions/delete/:id`, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ mensagem: "ID é obrigatório" });
        };

        const[resultado] = await pool.query(`DELETE FROM transactions WHERE id = ?`, [id])

        if(resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada'});
        }

        return res.json({ 
            mensagem: "Transação excluida com sucesso"
         });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.listen(port, () => {
    try {
        console.log('Servidor esta conectado');
    } catch (error) {
        console.log('Não foi possviel conectar com o servido', error);
    }
});