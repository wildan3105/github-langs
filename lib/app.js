const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const controller = require('./controller');
const app = express();

// load environment file
// dotenv.load();

// app setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app controller
app.get('/', controller.index);

app.set('port', process.env.PORT || 5000);

module.exports = app;
