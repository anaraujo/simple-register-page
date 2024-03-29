const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const mainTemplate = require('./views/template');
const { requireEmail, requireCPF, requireBirth, requirePassword, requirePolicy } = require('./public/scripts/validators');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(mainTemplate({}));
});

const handleErrors = (templateFunc) => {
    return async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send(mainTemplate({ errors, inputValues: req.body }));
        }
        next();
    };
};

app.post(
    '/', 
    [ requireEmail, requireCPF, requireBirth, requirePassword, requirePolicy ],
    handleErrors(mainTemplate),
    (req, res) => {
        res.send(mainTemplate({
            success: `
                <div class="success-msg">
                    <p>Parabéns! Cadastro realizado com sucesso!</p>
                </div>
            `
        }));
    }
);

app.listen(process.env.PORT || 3000, function() {
	console.log('Listening');
});

module.exports = app;