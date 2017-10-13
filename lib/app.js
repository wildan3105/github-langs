const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const controller = require('./controller');


// app setup
const app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${__dirname}/public`));
app.set('port', process.env.PORT || 5000);


// Routes
app.get('/', controller.index);
app.use('*', controller.notFound);


// Enable monitoring in prod env only
if (process.env.NODE_ENV === 'production') {
    const { OPBEAT_APP_ID: appId } = process.env || false;
    const { OPBEAT_ORGANIZATION_ID: organizationId } = process.env || false;
    const { OPBEAT_SECRET_TOKEN: secretToken } = process.env || false;

    if (!(appId && organizationId && secretToken)) {
        throw 'Missing OPBEAT credentials!';
    }

    const opbeat = require('opbeat').start({ appId, organizationId, secretToken });
    app.use(opbeat.middleware.express());
}


module.exports = app;
