exports.paginaInicial = (req, res) => {
    res.send(`
        <form action="/cadastro" method="POST">
        Name: <input type="text" name="nome"> <br>
        Sobrenome: <input type="text" name="sobrenome"> <br>
        <button>Enviar</button> 
        `)
}

exports.trataPost = (req, res) => {
    res.send('Sua nova rota de POST!');
}