const { produtos, pedidos } = require("./database");

function criarPedido(cliente, produtosIds) {
    if (!cliente) {
        throw new Error("Nome do cliente é obrigatório");
    }

    if (!produtosIds || produtosIds.length === 0) {
        throw new Error("A lista de produtos é obrigatória");
    }

    let total = 0;

    for (const id of produtosIds) {
        const produto = produtos.find(produto => produto.id === id);

        if (!produto) {
            throw new Error(`Produto com ID ${id} não encontrado`);
        }

        total += produto.preco;
    }

    const novoPedido = {
        id: pedidos.length + 1,
        cliente: cliente,
        produtosIds: produtosIds,
        status: "Pendente",
        total: total
    };

    pedidos.push(novoPedido);

    return novoPedido;
}

function listarProdutos() {
    return produtos;
}

function listarPedidos() {
    return pedidos;
}

function excluirPedido(id) {
    const indicePedido = pedidos.findIndex(pedido => pedido.id === id);

    if (indicePedido === -1) {
        throw new Error("Pedido não encontrado");
    }

    const pedido = pedidos[indicePedido];

    if (pedido.status === "Em Preparo" || pedido.status === "Entregue") {
        throw new Error("Este pedido não pode mais ser cancelado");
    }

    pedidos.splice(indicePedido, 1);

    return {
        mensagem: "Pedido excluído com sucesso",
        pedidoRemovido: pedido
    };
}

function atualizarStatus(id, novoStatus) {
    const pedido = pedidos.find(pedido => pedido.id === id);

    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    if (pedido.status === "Entregue") {
        throw new Error("Pedido já foi entregue e não pode ser alterado");
    }

    pedido.status = novoStatus;

    return pedido;
}

module.exports = {
    criarPedido,
    listarProdutos,
    listarPedidos,
    excluirPedido,
    atualizarStatus
};
