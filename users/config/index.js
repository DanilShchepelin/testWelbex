module.exports = {
    development: {
        database: {
            client: 'postgresql',
            connection: {
                database: 'test1',
                user: 'user1',
                password: 'Passw0rd'
            },
            migrations: {
                tableName: 'knex_migrations',
                directory: './db/migrations'
            },
            seeds: {
                directory: './db/seeds'
            }
        }
    }
}