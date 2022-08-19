/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.createTable('notes', (table) => {
        table
            .increments('id')
            .primary()
            .comment('Идентификатор');
        table
            .string('note')
            .notNullable()
            .comment('Запись');
        table
            .timestamp('created_at', {useTz: false})
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Дата создания');
        table
            .timestamp('updated_at', {useTz: false})
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Дата обновления');
        table
            .string('status')
            .notNullable()
            .defaultTo('active')
            .comment('Статус');
        table.comment('Записи');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.dropTable('notes');
};
