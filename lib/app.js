const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const enforce = require('express-sslify');
const controller = require('./controller');
const error_message = require('./error_messages');
const app = express();

const enableHttps = () => {
    if (!process.env.ENV) {
        throw error_message.ENV_MISSING;
    }
    const enableScript =
        process.env.ENV === 'local'
            ? null
            : app.use(enforce.HTTPS({ trustProtoHeader: true }));
    return enableScript;
};

enableHttps();

// app setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${__dirname}/public`));

// app controller
app.get('/', controller.index);
// 404
app.use('*', controller.notFound);

app.set('port', process.env.PORT || 5000);

module.exports = app;
