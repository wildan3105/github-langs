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
    url: `https://api.github.com/users/${query}`,
    headers:{
      'User-Agent': 'wildan3105'
    }
  }
  let languages = {}, total, showResult = 'none';
  let repos = '', message = ''
  request.get(options, (err, response, body) => {
      const data = JSON.parse(body);
      if(data.message){
        console.log('user not found')
        message = "Couldn't find any data or we hit an error, try again?";
      } else {
        console.log(data.public_repos)
        repos = data.public_repos
        showResult = ''
      }
      // showResult = '';
      // const data = JSON.parse(response.body)
      // const length = data.length;
      // total = length;
      // let e;
      // for (var i = 0,l=data.length; i < l; i++) {
      //     e = data[i];
      //     languages[e.language] = (languages[e.language] || 0) + 1;
      // }
    res.render('index', {title:
      "Homepage",
      username,
      languages,
      total,
      showResult,
      message,
      repos
    });
  })
}
