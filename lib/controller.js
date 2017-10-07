'use strict';
const request = require('request');
const _ = require('lodash');
const base_url = 'https://api.github.com/';
const config = require('../config.json');
const credentials = require('../config.json').proxy;
const r = request.defaults({'proxy':`${credentials}`});

// handle search and display statistics
exports.index = (req, res) => {
  const query = req.query.username;
  const username = query;

  // Assumption : max repo 999999 per page
  const limit = 999999;
  const options = {
    url: `https://api.github.com/users/${query}/repos?per_page=1000&client_id=${config.client_id}&client_secret=${config.client_secret}`,
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
