const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.erros = [];
        this.user = null;
    }

    async register() {
        this.valida();
        if (this.erros.length > 0) return;

        try {
            await this.userExists();
        } catch (err) {
            console.error(err);
        }
        
        if (this.erros.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        try {
            this.user = await LoginModel.create(this.body);
        } catch (err) {
            console.error(err);
        }
    }

    async userExists () {
        try {
           const userEmail = await LoginModel.findOne({ email: this.body.email });

           if (userEmail) this.erros.push('O usuário já existe.')
        }catch (err) {
            console.error(err);
        }
    }

    valida() {
        this.cleanUp();

        if (!validator.isEmail(this.body.email)) this.erros.push('E-mail inválido.');

        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.erros.push('A senha precisa ter entre 3 e 50 caracteres.')
        }
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;