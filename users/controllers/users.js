const config = require('../config');
const knex = require('knex');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
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
    createUser: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {email, password} = req.body;
            let testEmailAccount = await nodemailer.createTestAccount()

            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testEmailAccount.user,
                    pass: testEmailAccount.pass,
                },
            })

            const user = await db
                .first({
                    id: 'id',
                    email: 'email',
                    password: 'password'
                })
                .from('users')
                .where({email});

            if (user) {
                return res.status(400).json({message: 'Такой пользователь уже существует'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db
                .insert({
                    email,
                    password: hashedPassword
                })
                .into('users');

            res.status(200).json({message: 'Пользователь создан'});

            let result = await transporter.sendMail({
                from: '"Node js" <nodejs@example.com>',
                to: `${email}, ${email}`,
                subject: 'Добро пожаловать',
                text: 'Добро пожаловать, ваш аккаунт успешно создан.',
                html:
                  'This <i>message</i> was sent from <strong>Node js</strong> server.',
            });
              
            console.log(result);

        } catch (err) {
            res.status(500).json({message: 'Что-то пошло не так'});
        }
    },
    updateUser: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {userId} = req.params;
            const {email, password} = req.body;

            await db
                .update({
                    email,
                    password,
                    'updated_at': new Date().toISOString()
                })
                .from('users')
                .where({ id: userId });

            res.status(200).json({message: 'Данные обновлены'});

        } catch (err) {
            res.status(500).json({message: 'Что-то пошло не так'});
        }
    },
    deleteUser: async (req, res) => {
        try {
            const db = knex(config.development.database);
            const {userId} = req.params;

            await db
                .update({
                    status: 'deleted'
                })
                .from('users')
                .where({ id: userId });

            res.status(200).json({message: 'Позьзователь удален'});
        } catch (err) {
            res.status(500).json({message: 'Что-то пошло не так'});
        }
    }
}