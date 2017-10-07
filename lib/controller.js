'use strict';
const request = require('request');
const _ = require('lodash');
const base_url = 'https://api.github.com/';
const config = require('../config.json');
const credentials = require('../config.json').proxy;
const r = request.defaults({'proxy':`${credentials}`});

// handle search and display statistics
exports.index = (req, res) => {
  const username = req.query.username;
  const options = {
    url: `https://api.github.com/users/${username}/repos?per_page=100&client_id=${config.client_id}&client_secret=${config.client_secret}`,
    headers:{
      'User-Agent': 'wildan3105'
    }
  }
  let languages = {}, total, showResult = 'none';
  let repos = '', message = ''
  request.get(options, (err, response, body) => {
      const data = JSON.parse(body);
      if(data.length == 0){
        message = `${username} does not have any repo`
      } else {
        if(data.message){
          message = data.message;
        } else {
          if(data[0].owner.login == 'undefined'){
            // github with 'undefined' username
          } else {
            repos = data.length;
            showResult = ''
            let total = repos;
            let e;
            for (var i = 0,l=data.length; i < l; i++) {
                e = data[i];
                languages[e.language] = (languages[e.language] || 0) + 1;
            }
            languages = _.fromPairs(_.sortBy(_.toPairs(languages), function(a){return a[1]}).reverse())
          }
      }
    }
    res.render('index', {title:
      "Github Language Checker",
      username,
      languages,
      total,
      showResult,
      message,
      repos
    });
  })
}
