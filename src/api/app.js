const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

const { ENV_MISSING_ERROR_MESSAGE } = require('../config');

if (!process.env.ENV) {
    throw ENV_MISSING_ERROR_MESSAGE;
}

// template engine setup
app.set('views', 'src/pages');
app.engine('.handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir:'src/pages/layouts',
    partialsDir:'src/pages/partials'
}));
app.set('view engine', '.handlebars');

// useful middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.use('/', require('./routes'));

module.exports = app;
