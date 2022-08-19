const config = require('../config');
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    getUser: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {email, password} = req.body;

            const user = await db
                .first({
                    id: 'id',
                    email: 'email',
                    password: 'password'
                })
                .from('users')
                .where({email});

            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'});
            }

            const isMatch = bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({message: 'Пароль неверный'});
            }

            const token = jwt.sign(
                {userId: user.id},
                'super sectet',
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id});

        } catch (err) {
            res.status(500).json({message: 'Что-то пошло не так'});
        }
    },
    createNote: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {text} = req.body;

            await db 
                .insert({
                    text,
                    'updated_at': new Date().toISOString(),
                    'created_at': new Date().toISOString()
                })
                .into('notes');

            res.status(200).json({message: 'Запись успешно создана'});

        } catch (err) {
            res.status(500).json({message: 'Что-то пошло не так'});
        }
    },
    getNotes: async (req, res) => {
        try {
            const db = knex(config.development.database);

            const notes = await db 
                .select({
                    id: 'id',
                    note: 'note'
                })
                .from('notes');

            if (!notes) {
                return res.json({message: 'Записей еще нет'});
            }

            res.json({notes: notes});

        } catch (err) {
            res.status(500).json({message: 'Что-то пошло не так'});
        }
    },
    deleteNote: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const noteId = req.params;

            await db 
                .update({
                    'status': 'deleted',
                    'updated_at': new Date().toISOString
                })
                .from('notes')
                .where({ id: noteId });

            res.status(200).json({message: 'Запись удалена'})

        } catch (err) {
            return res.status(500).json({message: 'Что-то пошло не так'});
        }
    },
    updateNote: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const noteId = req.params;
            const {note} = req.body;

            await db 
                .update({
                    note,
                    'updated_at': new Date().toISOString()
                })
                .from('notes')
                .where({ id: noteId });

            res.status(200).json({message: 'Запись изменена'});

        } catch (err) {
            return res.status(500).json({message: 'Что-то пошло не так'});
        }
    }
}