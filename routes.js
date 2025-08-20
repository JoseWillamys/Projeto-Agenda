const express = require('express');
const route = express.Router();
const loginController = require('./src/controllers/loginController');
const homeController = require('./src/controllers/homeController');
const cadastroController = require('./src/controllers/cadastroController');

// rotas da home
route.get('/', homeController.index);

// rotas de login
route.get('/login/index', loginController.index);

// rotas de cadastro
route.get('/cadastro/index', cadastroController.index);
route.post('/login/cadastro', cadastroController.cadastro);

module.exports = route;