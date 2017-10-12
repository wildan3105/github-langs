'use strict';
const dotenv = require('dotenv');
const _ = require('lodash');
const { error } = dotenv.config({ silent: true });
const request = require('request').defaults({ proxy: '' });

// load environment file
if (error) {
    console.warn(error.message);
}

const client_id = process.env.CLIENT_ID || false;
const client_secret = process.env.CLIENT_SECRET || false;
if (!(client_id && client_secret)) {
    throw 'Missing CLIENT_ID and CLIENT_SECRET environment variables';
}

const getPageRepos = (repoOptions, dataRepo, page, callBack) => {
    let pageDataRepo = [];

    request.get({ url: `${repoOptions.url}&page=${page}`, headers: repoOptions.headers }, (err, response, body) => {
        pageDataRepo = JSON.parse(body);
        dataRepo.push(...pageDataRepo);
        page++;

        pageDataRepo.length !== 0 ? getPageRepos(repoOptions, dataRepo, page, callBack) : callBack();
    });
};

const getEmoji = (repoLength) => {
    if (repoLength >= 100) {
        return '💯 👍 😎 👏';
    } else if (repoLength >= 75) {
        return '👍 😎 👏';
    } else if (repoLength >= 50) {
        return '👍 😎';
    } else if (repoLength >= 20) {
        return '👍';
    } else if (repoLength > 0) {
        return '🙂';
    } else if (repoLength === 0) {
        return '😪';
    }

    return '';
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
        repos = '',
        msg = '',
        avatar,
        statement;

    if (username === undefined) {
        res.render('layouts/main', {
            show: {
                result: false,
                chart: false
            },
            username,
            avatar,
            languages,
            msg,
            repos,
            statement
        });

        return;
    }

    request.get(userOptions, (err, response, body) => {
        const data = JSON.parse(body);

        if (data.message === 'Not Found') {
            // user was not found

            msg = 'User was not found';

            res.render('layouts/main', {
                show: {
                    language: false,
                    result: false,
                    chart: false
                },
                username,
                avatar,
                languages,
                msg,
                repos,
                statement
            });

            return;
        }

        avatar = data.avatar_url;

        // get repo
        request.get(repoOptions, (err, response, body) => {
            const dataRepo = JSON.parse(body);
            let repoLength = dataRepo.length;

            if (repoLength === 0) {
                repos = `${username} has no repo`;

                res.render('layouts/main', {
                    show: {
                        result: true,
                        chart: false
                    },
                    username,
                    avatar,
                    languages,
                    msg,
                    repos,
                    showEmoji: getEmoji(repoLength),
                    statement
                });

                return;
            }

            getPageRepos(repoOptions, dataRepo, 2, () => {
                repoLength = dataRepo.length;

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
                goodAtMysteryLanguage ? statement = `${randomStatement}` : statement = `${randomStatement} ${goodAt}!`;

                const limitLabel = Object.keys(languages).length > 20;
                res.render('layouts/main', {
                    show: {
                        result: true,
                        chart: true
                    },
                    username,
                    avatar,
                    languages,
                    showEmoji: getEmoji(repoLength),
                    msg,
                    repos,
                    statement,
                    limitLabel
                });
            });
        });
    });
};


exports.notFound = (req, res) => res
    .status(404)
    .render('layouts/main', {
        error: {
            code: 404,
            message: 'Page not found!'
        }
    });
