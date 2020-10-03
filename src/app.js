const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const enforce = require('express-sslify');
const app = express();

const { ENV_MISSING } = require('../config/error_messages');

const enableHttps = () => {
    if (!process.env.ENV) {
        throw ENV_MISSING;
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
app.use('/public', express.static('public'));

app.use('/', require('./routes'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`github-langs running on port: ${server.address().port}`);
});

module.exports = app;
