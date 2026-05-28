/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('alunos', (table) => {
    table.increments('id').primary(); // Chave primária auto incrementada
    table.string('nome', 100).notNullable(); // VARCHAR de 100, obrigatório
    table.integer('idade').notNullable();
    table.integer('numero_chamada');
    table.string('senha').notNullable();
    table.timestamps(true, true); // Cria colunas created_at e updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('alunos');
};
