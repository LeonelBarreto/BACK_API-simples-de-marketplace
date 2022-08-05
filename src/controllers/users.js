const knex = require('../conexao');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password, name_store } = req.body;

    if (!name || !email || password || !name_store) {
        return res.status(404).json({ message: 'All fields are mandatory.' });
    };

    try {
        const numberOfUsers = await knex('users').where({ email }).first();

        if (numberOfUsers) {
            return res.status(400).json({ message: 'This email is already registered.' });
        };

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await knex('users').insert({
            name,
            email,
            password: encryptedPassword,
            name_loja
        }).returning('*');

        if (!user) {
            return res.status(400).json({ message: 'User has not been registered.' });
        };

        return res.status(200).json(user[0]);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const getProfile = async (req, res) => {
    return res.status(200).json(req.user);
}

const updateProfile = async (req, res) => {
    const { name, email, password, name_store } = req.body;
    const { id } = req.user;

    if (!name && !email && !password && !name_store) {
        return res.status(404).json({ message: 'It is mandatory to update at least one information.' });
    };

    try {
        const userExists = await knex('users').where({ id }).first();

        if (!userExists) {
            return res.status(404).json({ message: 'User not found.' });
        };

        if (password) {
            password = await bcrypt.hash(password, 10);
        };

        if (email !== req.user.email) {
            const registeredEmail = await knex('users').where({ email }).first();

            if (registeredEmail) {
                return res.status(404).json({ mensagem: 'Email is already registered.'});
            };
        };

        const updatedUser = await knex('users')
            .where({ id })
            .update({
                name,
                email,
                password,
                name_store
            });

        if (!updatedUser) {
            return res.status(400).json({ mensagem: 'The user has not been updated.'});
        };

        return res.status(200).json({ mensagem: 'User successfully updated.'});
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

module.exports = {
    registerUser,
    getProfile,
    updateProfile
};