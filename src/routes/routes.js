const express = require('express');
const router = express.Router();

const connection = require('../../database/connection');

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

// buscar aluno id

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

// atualizar aluno
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
// deletar aluno

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