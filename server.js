require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

// Importa o módulo Express, um framework para criar aplicações web em Node.js
const express = require('express');

// Cria uma instância da aplicação Express
const app = express();

// Importa o módulo Mongoose, uma biblioteca para modelar objetos MongoDB em Node.js
const mongoose = require('mongoose');

// Conecta ao banco de dados MongoDB usando a string de conexão definida
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('BDconectado'); // Emite um evento quando a conexão com o banco de dados é bem-sucedida
    }).catch((err) => {
        console.log("Erro ao conectar no BD: " + err);
    });

// Importa o módulo 'express-session' para gerenciar sessões de usuário
const session = require('express-session');

// Importa o módulo 'connect-mongo' para armazenar sessões no MongoDB
// Isso permite que as sessões sejam persistentes entre reinicializações do servidor
// O módulo 'connect-mongo' é usado para armazenar sessões do Express em um banco de dados MongoDB
// Isso é útil para manter o estado do usuário entre requisições, como login e preferências
const MongoStore = require('connect-mongo'); 

// Importa o módulo 'connect-flash' para exibir mensagens flash (notificações temporárias)
const flash = require('connect-flash');

// Define a porta em que o servidor será executado (neste caso, 3000)
const port = 3000;

// Importa o módulo de rotas definido em um arquivo separado chamado 'routes'
const routes = require('./routes');

// Importa o módulo 'path' do Node.js, usado para manipular caminhos de arquivos
const path = require('path');

// Importa o módulo 'helmet', que ajuda a proteger a aplicação Express definindo cabeçalhos HTTP seguros
const helmet = require('helmet');

// Importa o módulo 'csrf' para proteção contra ataques CSRF (Cross-Site Request Forgery)
// O CSRF é um tipo de ataque onde um site malicioso tenta fazer requisições
const csrf = require('csurf')

// Importa um middleware global definido em um arquivo separado
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// Configura o middleware Helmet para proteger a aplicação Express
// Helmet ajuda a proteger a aplicação definindo cabeçalhos HTTP seguros, como Content Security Policy
app.use(helmet());

// Configura o middleware para processar dados de requisições no formato URL-encoded (ex.: dados de formulários HTML)
// O parâmetro extended: true permite o parsing de objetos aninhados usando a biblioteca 'qs'
app.use(express.urlencoded({ extended: true }));

// Configura o middleware para processar requisições com corpo JSON
// Isso permite que a aplicação receba dados no formato JSON, como APIs RESTful
app.use(express.json());

// Configura o middleware express.static para servir arquivos estáticos (como CSS, JavaScript, imagens) a partir do diretório 'public'
// path.resolve(__dirname, 'public') cria um caminho absoluto para a pasta 'public' no diretório atual da aplicação
// Isso permite que o navegador acesse diretamente arquivos estáticos, como http://localhost:3000/estilo.css
app.use(express.static(path.resolve(__dirname, 'public')));

// Configura o middleware de sessão com opções específicas
const sessionOptions = session({
    secret: 'asdasdasdasdasdasdasdasdasd', 
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTIONSTRING
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

// Registra o middleware de sessão e flash na aplicação
app.use(sessionOptions);

// Registra o middleware de flash para exibir mensagens temporárias entre requisições
app.use(flash());

// Define o diretório onde as views (templates) da aplicação estão localizadas
// Usa path.resolve para criar um caminho absoluto até a pasta 'src/views' a partir do diretório atual (__dirname)
app.set('views', path.resolve(__dirname, 'src', 'views'));

// Configura o motor de templates como 'ejs', permitindo o uso de arquivos .ejs para renderizar páginas dinâmicas
app.set('view engine', 'ejs');

// Registra o middleware CSRF para proteger a aplicação contra ataques CSRF
app.use(csrf());

// Registra o middleware global para ser executado em todas as requisições
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// Registra as rotas definidas no módulo 'routes' para serem usadas pela aplicação
// Todas as requisições HTTP serão encaminhadas para as rotas definidas no arquivo importado
app.use(routes);

// Define um evento personalizado 'BDconectado' que será emitido quando a conexão com o banco de dados for bem-sucedida
app.on('BDconectado', () => {
    // Inicia o servidor na porta especificada (3000) e executa uma função de callback quando o servidor está ativo
    // A função exibe mensagens no console indicando que o servidor está online e a URL de acesso
    app.listen(port, () => {
        console.log(`Servidor ON-LINE!`);
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
})
