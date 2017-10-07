'use strict';
const request = require('request');
const axios = require('axios');
const _ = require('lodash');
const base_url = 'https://api.github.com/';
const config = require('../config.json');
const credentials = require('../config.json').proxy;
const r = request.defaults({'proxy':`${credentials}`});

const langs = ['javascript','java','python','css','php','ruby','c++','c','shell','c#',
'objective-c','r','viml','go','perl','coffeescript','text','swift','scala','emacs lisp',
'haskell','lua','matlab','arduino','makefile','groovy','puppet','rust','powershell'];

const colors = []

// handle search and display statistics
exports.index = (req, res) => {
  const username = req.query.username;
  const user_endpoint = `https://api.github.com/users/${username}?client_id=${config.client_id}&client_secret=${config.client_secret}`
  const repo_endpoint = `https://api.github.com/users/${username}/repos?per_page=100&client_id=${config.client_id}&client_secret=${config.client_secret}`
  const options = {
    headers:{
      'User-Agent': 'wildan3105'
    }
  }

  let languages = {}, total, showResult = 'none';
  let repos = '', message = '', avatar, data;

  // axios
  axios.all([
      axios
        .get(user_endpoint, options),
      axios
        .get(repo_endpoint, options)
        .catch(err => console.log("repo catch : ", err.response.status))
    ])
    .then(axios.spread(function (userResponse, reposResponse) {
      avatar = userResponse.data.avatar_url;
      data = reposResponse.data;
        if(userResponse.data.message){
          message = `${username} not found`
        } else {
          if(data.message){
            message = data.message;
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

      if(username == undefined) showResult = 'none';

      res.render('index', {title:
        "Github Language Checker",
        username,
        avatar,
        languages,
        total,
        showResult,
        message,
        repos
      });
    }))
}
