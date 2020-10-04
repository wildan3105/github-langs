const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const enforce = require('express-sslify');
const app = express();
const i18n = require('i18n');

const error_messages = require('./config/error_messages');

const enableHttps = () => {
    if (!process.env.ENV) {
        throw error_messages.ENV_MISSING;
    }
    const enableScript = process.env.ENV === 'local' ? null : app.use(enforce.HTTPS({ trustProtoHeader: true }));
    return enableScript;
};

enableHttps();

i18n.configure({
    locales: ['en', 'id'],
    defaultLocale: 'en',
    directory: __dirname + '/locales',
    autoReload: true,
    updateFiles: true,
    api: {
        '__': '__', 
        '__n': '__n'
    }
});

// app setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${__dirname}/public`));
app.use(i18n.init);

app.use('/', require('./routes'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`github-langs running on port: ${server.address().port}`);
});

module.exports = app;
