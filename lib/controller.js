'use strict';
const request = require('request');
const _ = require('lodash');
const base_url = 'https://api.github.com/';
const token = require('../config.json').token;
const credentials = require('../config.json').proxy;
const r = request.defaults({'proxy':`${credentials}`});

// handle search and display statistics
exports.index = (req, res) => {
  const query = req.query.username
  const username = query
  const options = {
    url: `https://api.github.com/users/${query}/repos?access_token=${token}`,
    headers: {
      'User-Agent': 'request'
    }
  }
  request.get(options, (err, response, body) => {
    let languages = {}, total, showResult = 'hide';
    if(query == undefined){
        languages = {}, total = "";
    } else {
      console.log(response)
      if(response){
          showResult = '';
          const data = JSON.parse(response.body)
          const length = data.length;
          total = length;
          let e;
          for (var i = 0,l=data.length; i < l; i++) {
              e = data[i];
              languages[e.language] = (languages[e.language] || 0) + 1;
          }
        }
        else {
          console.log('no response!');
        }
      }
    res.render('index', {title: "Homepage", username, languages, total, showResult});
  })
}
