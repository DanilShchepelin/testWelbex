/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex)=> {
    await knex.schema.createTable('users', (table) => {
        table
            .increments('id')
            .primary()
            .comment('Идентификатор');
        table   
            .string('email', 64)
            .notNullable()
            .comment('Email');
        table
            .string('password')
            .notNullable()
            .comment('Пароль');
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
            .defaultTo('active')
            .notNullable()
            .comment('Статус');
        table.comment('Пользователи');        
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await knex.schema.dropTable('users');
};
