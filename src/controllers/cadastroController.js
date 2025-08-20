const Login = require('../models/cadastroModel')

exports.index = (req, res) => {
    res.render('cadastro');
}

exports.cadastro = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(() => {
                return res.redirect(req.get('Referrer') || '/');
            });
            return;
        }
        
        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.save(() => {
            return res.redirect(req.get('Referrer') || '/');
        });
    } catch (err) {
        console.error(err);
        return res.render('404');
    }
}