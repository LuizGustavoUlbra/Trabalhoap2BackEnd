const express = require('express');

const router = express.Router();

const connection = require('../../database/connection');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const verificarToken = require('../Middleware/authorization');

router.get('/meu-perfil', verificarToken, async (req, res)=>{
    const usuario = req.usuario;

    const aluno = await connection('alunos').where({id: usuario.id}).first();

    if(!aluno){
        return res.status(404).json({error: 'Aluno não encontrado'});
    }

    res.json({
        id: aluno.id,
        nome: aluno.nome
    });
})

router.post('/login', async (req, res)=>{
    const {nome, senha} = req.body;

    if (!nome || !senha){
        return res.status(400).json({error: 'Nome e senha obrigatorios'});
    }

    const usuario = await connection('alunos').where({nome}).first();

    if (!usuario){
        return res.status(404).json({error: 'Usuario não encontrado'});
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if(!senhaValida){
        return res.status(401).json({error: 'Senha incorreta'});
    }

    const payload = {id: usuario.id, nome: usuario.nome, role:'aluno'};

    const segredo = process.env.JWT_SECRET || 'meu-segredo-aqui';

    const token = jwt.sign(
        payload,
        segredo,
        { expiresIn: '1h'}
    );

    res.json({
        message: 'Login bem-sucedido',
        id: usuario.id,
        nome: usuario.nome,
        token});
})

router.post('/novo-aluno', async (req, res)=> {
    const {nome, idade, numero_chamada, senha} = req.body;
    if (!nome || !idade || !numero_chamada || !senha){
        return res.status(400).json({error: 'Todos os campos são obrigatorios'});
    }

    const saltRounds = 10;

    const hashSenha = await bcrypt.hash(senha, saltRounds);

    try{
        const [id] = await connection('alunos')
            .insert({nome, idade, numero_chamada, senha: hashSenha});

        if (!id){
            return res.status(400).json({error: 'Erro ao cadastrar aluno'});
        }

        res.status(201)
            .json({messagem: 'Aluno cadastrado com sucesso',
                id,
                nome,
                idade,
                numero_chamada
            });
    }catch (error){
        res.status(500).json({error: 'Erro ao cadastrar aluno'});
    }
})

router.get('/ping', (req, res) =>{
    res.json({ message: 'pong' });
});

router.get('/alunos', async (req, res) => {
    try{
        const alunos = await connection('alunos').select('*');

        res.json(alunos);
    }catch(error) {
        res.status(500).json({error: 'Erro ao buscar alunos' });
    }
});

router.post('/cadastrar-aluno', async (req, res) => {
    const {nome, idade, numero_chamada } = req.body;
    try { 
            const[id] = await connection('alunos')
            .insert({nome, idade, numero_chamada});

            if (!id){
                return res.status(400).json({error: 'Erro ao cadastrar aluno'});
            }

            res.status(201)
            .json({messagem: 'Aluno cadastrado com sucesso',
                id,
                nome,
                idade,
                numero_chamada
            })
    } catch(error){
        res.status(500).json({error: 'Erro ao cadastrar aluno' });
    }
})

router.get('/aluno/:id', async(req, res)=> {
    try{
        const {id} = req.params;
        const aluno = await connection ('alunos').select('*').where({id}).first();
        if (!aluno) {
            return res.status(404).json({erro: 'Aluno não encontrado'});
        }res.json(aluno);
    }catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar aluno'});
    }
});

router.put('/aluno/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        const {nome, idade, numero_chamada} = req.body;
        const alunoExiste = await connection('alunos').where({id}).first();

        if (!alunoExiste){
            return res.status(404).json({erro: 'Aluno não encontrado'});
        }
        await connection('alunos').where({id}).update({nome,idade,numero_chamada, updated_at: connection.fn.now()});
        const alunoAtualizado = await connection('alunos').where({id}).first();
        res.json(alunoAtualizado);
    } catch (error) {
        res.status(500).json({erro: 'Erro ao atualizar aluno'});
    }
});


router.delete('/aluno/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const alunoExiste = await connection('alunos').where({ id }).first();

        if (!alunoExiste) {
            return res.status(404).json({erro: 'Aluno não encontrado'});
        }

        await connection('alunos').where({ id }).delete();

        res.json({mensagem: 'Aluno deletado com sucesso'});

    } catch (error) {
        res.status(500).json({erro: 'Erro ao deletar aluno'});
    }
});

module.exports = router;