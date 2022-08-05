const knex = require('../database/connection');

const listProducts = async (req, res) => {
    const { user } = req;
    const { category } = req.query;

    try {
        const products = await knex('products')
            .where({ user_id: user.id })
            .where(query => {
                if (category) {
                    return query.where('category', 'ilike', `%${category}%`);
                };
            });

        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const getProduct = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const product = await knex('products').where({
            id,
            user_id: user.id
        }).first();

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const registerProduct = async (req, res) => {
    const { user } = req;
    const { name, inventory, price, category, description, image } = req.body;

    if (!name || !inventory || !price || !description) {
        return res.status(404).json({ message: 'All fields are mandatory.' });
    };

    try {
        const product = await knex('products').insert({
            user_id: user.id,
            name,
            inventory,
            price,
            category,
            description,
            image
        }).returning('*');

        if (!product) {
            return res.status(400).json({ message: 'Product has not been registered.' });
        };

        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const updateProduct = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { name, inventory, price, category, description, image } = req.body;

    if (!name && !inventory && !price && !category && !description && !image) {
        return res.status(404).json({ message: 'It is mandatory to update at least one information.' });
    };

    try {
        const foundProduct = await knex('products').where({
            id,
            user_id: user.id
        }).first();

        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        };

        const product = await knex('products')
            .where({ id })
            .update({
                name,
                inventory,
                price,
                category,
                description,
                image
            });

        if (!product) {
            return res.status(400).json({ mensagem: 'Product has not been updated.'});
        };

        return res.status(200).json({ mensagem: 'Product successfully updated.'});
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

const deleteProduct = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const foundProduct = await knex('products').where({
            id,
            user_id: user.id
        }).first();

        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        };

        const deletedProduct = await knex('products').where({
            id,
            user_id: user.id
        }).del();

        if (!deletedProduct) {
            return res.status(400).json({ mensagem: 'The product has not been deleted.'});
        };

        return res.status(200).json({ mensagem: 'The product was successfully deleted.'});
    } catch (error) {
        return res.status(400).json({ message: `Internal error: ${erro.message}` });
    };
};

module.exports = {
    listProducts,
    getProduct,
    registerProduct,
    updateProduct,
    deleteProduct
}