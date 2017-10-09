'use strict';
const request = require('request');
const dotenv = require('dotenv');
const _ = require('lodash');

// load environment file
dotenv.load();

// proxy
const r = request.defaults({ proxy:process.env.PROXY });

// const langs = ['javascript','java','python','css','php','ruby','c++','c','shell','c#',
//     'objective-c','r','viml','go','perl','coffeescript','text','swift','scala','emacs lisp',
//     'haskell','lua','matlab','arduino','makefile','groovy','puppet','rust','powershell'];

// const colors = [];
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

// handle search and display statistics
exports.index = (req, res) => {
    const username = req.query.username;
    const headers = { 'User-Agent': `${username}` };

    const userOptions = {
        url: `https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`,
        headers
    };

    const repoOptions = {
        url: `https://api.github.com/users/${username}/repos?client_id=${client_id}&client_secret=${client_secret}&per_page=100`,
        headers
    };

    let languages = {}, showResult = 'none', showLanguage = '';
    let repos = '', msg = '', avatar;

    if (username === undefined) {
        console.log('HOMEPAGE');
        showResult = 'none';
        res.render('index', { title:
            'Github Language Checker',
        username,
        avatar,
        languages,
        showResult,
        showLanguage,
        msg,
        repos
        });
    } else {
        r.get(userOptions, (err, response, body) => {
        // if user not found
            const data = JSON.parse(body);
            if (data.message === 'Not Found') {
                msg = 'Username not found';
                showResult = 'none';
                res.render('index', { title:
                    'Github Language Checker',
                username,
                avatar,
                languages,
                showResult,
                showLanguage,
                msg,
                repos
                });
            } else {
                showResult = '';
                avatar = data.avatar_url;
                // get repo
                r.get(repoOptions, (err, response, body) => {
                    const dataRepo = JSON.parse(body);
                    const repoLength = dataRepo.length;
                    const statements = [
                                        "You've got skills on",
                                        "Wow! You really like",
                                        "Good job on",
                                        "Keep going on"
                                      ]
                    if (repoLength === 0) {
                        repos = `${username} has no repo`, showLanguage = 'none';
                        res.render('index', { title:
                            'Github Language Checker',
                        username,
                        avatar,
                        languages,
                        showResult,
                        showLanguage,
                        msg,
                        repos
                        });
                    } else {
                        showResult = '';
                        (repoLength === 1) ? repos = `${repoLength} repo` : repos = `${repoLength} repos`;
                        let e;
                        for (let i = 0; i < repoLength; i++) {
                            e = dataRepo[i];
                            languages[e.language] = (languages[e.language] || 0) + 1;
                        }
                        languages = _.fromPairs(_.sortBy(_.toPairs(languages), (a) => a[1]).reverse());
                        res.render('index', { title:
                            'Github Language Checker',
                        username,
                        avatar,
                        languages,
                        showResult,
                        showLanguage,
                        msg,
                        repos
                        });
                    }
                });
            }
        });
    }
};
