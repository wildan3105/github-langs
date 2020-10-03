const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const enforce = require('express-sslify');
const app = express();

const error_messages = require('./config/error_messages');

process.env.CLIENT_ID = "a99a1c2c6c80b08dc479";
process.env.CLIENT_SECRET = "8925d0b11a3749337d6e397954095a13f77ed1b7";
process.env.ENV = "local";

const enableHttps = () => {
    if (!process.env.ENV) {
        throw error_messages.ENV_MISSING;
    }
    const enableScript = process.env.ENV === 'local' ? null : app.use(enforce.HTTPS({ trustProtoHeader: true }));
    return enableScript;
};

enableHttps();

// app setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${__dirname}/public`));

app.use('/', require('./routes'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`github-langs running on port: ${server.address().port}`);
});

module.exports = app;
