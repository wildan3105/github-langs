const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const githubApi = require('github');
const dotenv = require('dotenv');
const controller = require('./controller');
const app = express();

// load environment file
dotenv.load();

// app setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app controller
app.get('/', controller.index);

// Github API setup
const github = new githubApi({
  version: '3.0.0',
  debug: false,
  protocol: 'https',
  host: 'api.github.com',
  timeout: 5000,
  headers: {
    'user-agent': 'Github Language Checker'
  }
});

if (process.env.GITHUB_TOKEN){
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
  });
} else {
  console.log('No token specified!');
}

app.set('port', process.env.PORT || 5000);

module.exports = app;
