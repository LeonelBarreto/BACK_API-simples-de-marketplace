const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordHash = require('../passwordHash');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: 'All fields are mandatory.' });
    };

    try {
        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        };

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(400).json({ message: 'Email and password do not match.' });
        };

        const token = jwt.sign({ id: user.id }, passwordHash, { expiresIn: '8h' });

        const { password: _, ...dataUser } = user;

        return res.status(200).json({
            user: dataUser,
            token
        });
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    };
};

module.exports = { login };