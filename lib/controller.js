'use strict';
const request = require('request');
const dotenv = require('dotenv');
const _ = require('lodash');

// load environment file
dotenv.load()

// proxy
// const r = request.defaults({ proxy:process.env.PROXY });

// const colors = [];
const client_id = process.env.CLIENT_ID || false;
const client_secret = process.env.CLIENT_SECRET || false;
if (!(client_id && client_secret)) {
    throw 'Missing CLIENT_ID and CLIENT_SECRET environment variables';
}

// getting de repos
const getPageRepos = (repoOptions, dataRepo, page, callBack) => {
    let pageDataRepo = [];

    request.get({ url: `${repoOptions.url}&page=${page}`, headers: repoOptions.headers }, (err, response, body) => {
        pageDataRepo = JSON.parse(body);
        dataRepo.push(...pageDataRepo);
        page++;

        pageDataRepo.length !== 0 ? getPageRepos(repoOptions, dataRepo, page, callBack) : callBack();
    });
};

// handle search and display statistics
exports.index = (req, res) => {
    const username = req.query.username;
    const headers = {
        'User-Agent': `${username}`
    };

    const userOptions = {
        url: `https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`,
        headers
    };

    const repoOptions = {
        url: `https://api.github.com/users/${username}/repos?client_id=${client_id}&client_secret=${client_secret}&per_page=100`,
        headers
    };

    let languages = {},
        showResult = 'none',
        showLanguage = '',
        repos = '',
        msg = '',
        avatar,
        statement;

    if (username === undefined) {
        console.log('HOMEPAGE');
        showResult = 'none';
        res.render('index', {
            title: 'Github Language Checker',
            username,
            avatar,
            languages,
            showResult,
            showLanguage,
            msg,
            repos,
            statement
        });
    } else {
        request.get(userOptions, (err, response, body) => {
            // user not found
            const data = JSON.parse(body);
            if (data.message === 'Not Found') {
                msg = 'Username not found';
                showResult = 'none';
                res.render('index', {
                    title: 'Github Language Checker',
                    username,
                    avatar,
                    languages,
                    showResult,
                    showLanguage,
                    msg,
                    repos,
                    statement
                });
            } else {

                showResult = '';
                avatar = data.avatar_url;
                // get repo
                const emoji = {
                    0: '😪',
                    10: '🙂',
                    20: '👍',
                    50:'👍 😎',
                    75: '👍 😎 👏',
                    100: '💯 👍 😎 👏'
                };
                request.get(repoOptions, (err, response, body) => {
                    const dataRepo = JSON.parse(body);
                    let repoLength = dataRepo.length;
                    let showEmoji;
                    if (repoLength >=100) {
                        showEmoji = emoji[100];
                    } else if (repoLength >= 75) {
                        showEmoji = emoji[75];
                    } else if (repoLength >= 50) {
                        showEmoji = emoji[50];
                    } else if (repoLength >= 20) {
                        showEmoji = emoji[20];
                    } else if (repoLength>0 && repoLength<20) {
                        showEmoji = emoji[10];
                    } else if (repoLength === 0) {
                        showEmoji = emoji[0];
                    }
                    if (repoLength === 0) {
                        repos = `${username} has no repo`, showLanguage = 'none';
                        res.render('index', {
                            title: 'Github Language Checker',
                            username,
                            avatar,
                            languages,
                            showResult,
                            showLanguage,
                            msg,
                            repos,
                            showEmoji,
                            statement
                        });
                    } else {
                        getPageRepos(repoOptions, dataRepo, 2, () => {
                            repoLength = dataRepo.length;
                            showResult = '';
                            (repoLength === 1) ? repos = `${repoLength} repo` : repos = `${repoLength} repos`;
                            let e;
                            for (let i = 0; i < repoLength; i++) {
                                e = dataRepo[i];
                                languages[e.language] = (languages[e.language] || 0) + 1;
                            }
                            languages = _.fromPairs(_.sortBy(_.toPairs(languages), (a) => a[1]).reverse());

                            if (languages.null) {
                                languages.unknown = languages.null;
                                delete languages.null;
                            }

                            const statements = [
                                'You\'ve got skills on',
                                'Wow! You really like',
                                'Good job on',
                                'Keep going on'
                            ];
                            const mysteryStatements = [
                                'Wow, you like the mystery language',
                                'Wow, you are a mystery man!'
                            ];

                            const goodAt = _.maxBy(_.keys(languages), (o) => languages[o]);
                            const goodAtMysteryLanguage = (goodAt === 'unknown');

                            const randomStatement = goodAtMysteryLanguage ? _.sample(mysteryStatements) : _.sample(statements);
                            goodAtMysteryLanguage ? statement = `${randomStatement}` : statement = `${randomStatement} ${goodAt} !`;

                            res.render('index', {
                                title: 'Github Language Checker',
                                username,
                                avatar,
                                languages,
                                showResult,
                                showEmoji,
                                showLanguage,
                                msg,
                                repos,
                                statement
                            });
                        });
                    }
                });
            }
        });
    }
};
