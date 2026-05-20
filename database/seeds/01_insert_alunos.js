/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('alunos').del()
  await knex('alunos').insert([
    { nome: 'João Pereira', idade: 15, numero_chamada: 1 },
    { nome: 'Diego Santos', idade: 18, numero_chamada: 2 },
    { nome: 'Maria Silva', idade: 16, numero_chamada: 3 }
  ]);
};
