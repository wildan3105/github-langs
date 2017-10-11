const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const controller = require('./controller');
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

app.set('port', process.env.PORT || 5000);

module.exports = app;
