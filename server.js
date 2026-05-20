const express = require("express");
const pedidoService = require("./pedidoService");

const app = express();
const porta = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Food Truck The Hungry Dev funcionando!");
});

app.get("/produtos", (req, res) => {
    const produtos = pedidoService.listarProdutos();
    res.json(produtos);
});

app.get("/pedidos", (req, res) => {
    const pedidos = pedidoService.listarPedidos();
    res.json(pedidos);
});

app.post("/pedidos", (req, res) => {
    try {
        const { cliente, produtosIds } = req.body;

        const novoPedido = pedidoService.criarPedido(cliente, produtosIds);

        res.status(201).json(novoPedido);
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.delete("/pedidos/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        const resultado = pedidoService.excluirPedido(id);

        res.status(200).json(resultado);

    } catch (erro) {
        if (erro.message === "Pedido não encontrado") {
            res.status(404).json({ erro: erro.message });
        } else {
            res.status(400).json({ erro: erro.message });
        }
    }
});

app.patch("/pedidos/:id/status", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const pedidoAtualizado = pedidoService.atualizarStatus(id, status);

        res.status(200).json(pedidoAtualizado);
    } catch (erro) {
        if (erro.message === "Pedido não encontrado") {
            res.status(404).json({ erro: erro.message });
        } else {
            res.status(400).json({ erro: erro.message });
        }
    }
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});