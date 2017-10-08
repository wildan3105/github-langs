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
const client_id = config.client_id
const client_secret = config.client_secret

// handle search and display statistics
exports.index = (req, res) => {
  const username = req.query.username;

  const userOptions = {
    url: `https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`,
    headers:{
      'User-Agent':'wildan3105'
    }
  }

  const repoOptions = {
    url: `https://api.github.com/users/${username}/repos?client_id=${client_id}&client_secret=${client_secret}`,
    headers:{
      'User-Agent':'wildan3105'
    }
  }

    let languages = {}, total, showResult = 'none';
    let repos = '', msg = '', avatar;

    if(username == undefined) {
      console.log('HOMEPAGE')
      showResult = 'none';
      res.render('index', {title:
        "Github Language Checker",
        username,
        avatar,
        languages,
        total,
        showResult,
        msg,
        repos
      });
    } else {
      request.get(userOptions, (err, response, body) => {
        // if user not found
        const data = JSON.parse(body)
        if(data.message === 'Not Found'){
          console.log('USER NOT FOUND')
          msg = 'Username not found'
          showResult = 'none';
          res.render('index', {title:
            "Github Language Checker",
            username,
            avatar,
            languages,
            total,
            showResult,
            msg,
            repos
          });
        } else {
          showResult = ''
          avatar = data.avatar_url
          // get repo
          request.get(repoOptions, (err, response, body) => {
            const dataRepo = JSON.parse(body)
            if(dataRepo.length === 0){
              console.log('USER HAS NO REPO')
              repos = 'User has no repo'
              res.render('index', {title:
                "Github Language Checker",
                username,
                avatar,
                languages,
                total,
                showResult,
                msg,
                repos
              });
            } else {
              console.log('USER HAS REPO YEAY!')
              showResult = ''
              repos = dataRepo.length;
              let total = repos;
              let e;
              for (var i = 0,l=dataRepo.length; i < l; i++) {
                  e = dataRepo[i];
                  languages[e.language] = (languages[e.language] || 0) + 1;
              }
              languages = _.fromPairs(_.sortBy(_.toPairs(languages), function(a){return a[1]}).reverse())
              res.render('index', {title:
                "Github Language Checker",
                username,
                avatar,
                languages,
                total,
                showResult,
                msg,
                repos
              });
            }
          })
        }
      })
    }
}
