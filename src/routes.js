const express = require('express');
const { registerUser, getProfile, updateProfile } = require('./controllers/users');
const { login } = require('./controllers/login');
const verifyLogin = require('./middleware/checkLogin');
const { listProducts, getProduct, registerProduct, updateProduct, deleteProduct } = require('./controllers/products');

const routes = express();

routes.post('/users', registerUser);

routes.post('/login', login);

routes.use(verifyLogin);

routes.get('/profile', getProfile);
routes.put('/profile', updateProfile);

routes.get('/produtos', listProducts);
routes.get('/produtos/:id', getProduct);
routes.post('/produtos', registerProduct);
routes.put('/produtos/:id', updateProduct);
routes.delete('/produtos/:id', deleteProduct);

module.exports = routes;