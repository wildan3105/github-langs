const express = require('express');
const app = express();

app.get('/', function(req, res){
  res.send('github-langs');
})

app.set('port', process.env.PORT || 5000);

module.exports = app;
