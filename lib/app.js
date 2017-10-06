const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('index', {title:'Homepage'});
});

app.set('port', process.env.PORT || 5000);

module.exports = app;
