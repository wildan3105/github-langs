const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const controller = require('./controller');

// ignore this, only for monitoring over heroku
const dotenv = require('dotenv');
dotenv.config();
const opbeat = require('opbeat').start({
  appId: process.env.OPBEAT_APP_ID,
  organizationId: process.env.OPBEAT_ORGANIZATION_ID,
  secretToken: process.env.OPBEAT_SECRET_TOKEN
});

const app = express();

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

// also ignore this if you run on your local machine
app.use(opbeat.middleware.express());

app.set('port', process.env.PORT || 5000);

module.exports = app;
