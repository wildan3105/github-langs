'use strict';
const dotenv = require('dotenv');
const _ = require('lodash');
const { error } = dotenv.config({ silent: true });
const axios = require('axios');

// load environment file
if (error) {
    console.warn(error.message);
}

const client_id = process.env.CLIENT_ID || false;
const client_secret = process.env.CLIENT_SECRET || false;
if (!(client_id && client_secret)) {
    throw 'Missing CLIENT_ID and CLIENT_SECRET environment variables';
}

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

const reqUser = (username) => {
    const url = `https://api.github.com/users/${username}?client_id=${client_id}&client_secret=${client_secret}`;
    const headers = { 'User-Agent': `${username}` };
    return axios.get(url, { headers });
};

const reqRepos = (username, numberOfPages) => {
    const headers = { 'User-Agent': `${username}` };
    const url = (page) =>
        `https://api.github.com/users/${username}/repos?client_id=${client_id}&client_secret=${client_secret}&per_page=100&page=${page}`;
    const requests = [];
    for (let i = 1; i <= numberOfPages; i++) {
        requests.push(axios.get(url(i), { headers }));
    }
    return requests;
};

exports.index = (req, res) => {
    const { username } = req.query;
    let avatar, msg, repos, statement;
    let languages = {};
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
    if (username === undefined) {
        res.render('layouts/main', {
            show: {
                result: false,
                chart: false
            },
            username: '',
            avatar,
            languages,
            msg,
            repos,
            statement
        });
        return;
    }
    reqUser(username)
        .then((usr) => {
            const usrData = usr.data;
            avatar = usrData.avatar_url;
            const numberOfRepos = usrData.public_repos;
            if (numberOfRepos === 0) {
                repos = `${username} has no repo`;
                res.render('layouts/main', {
                    show: {
                        result: true,
                        chart: false
                    },
                    username,
                    avatar,
                    languages: {},
                    msg,
                    repos,
                    showEmoji: getEmoji(numberOfRepos),
                    statement
                });
                return;
            }
            const numberOfPages = parseInt(numberOfRepos / 100) + 1;
            axios.all(reqRepos(username, numberOfPages))
                .then((pages) => {
                    const reposData = _.flatMap(pages, (page) => page.data);

                    (numberOfRepos === 1) ? repos = `${numberOfRepos} repo` : repos = `${numberOfRepos} repos`;
                    reposData.forEach((repo) => {
                        languages[repo.language] = (languages[repo.language] || 0) + 1;
                    });
                    languages = _.fromPairs(_.sortBy(_.toPairs(languages), (a) => a[1]).reverse());

                    if (languages.null) {
                        languages.unknown = languages.null;
                        delete languages.null;
                    }

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
                        showEmoji: getEmoji(numberOfRepos),
                        msg,
                        repos,
                        statement,
                        limitLabel
                    });
                });
        })
        .catch((err) => {
            if (err.response.data.message === 'Not Found') {
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
        });
};

exports.notFound = (req, res) => res
    .status(404)
    .render('layouts/main', {
        error: { message: 'Page not found!' }
    });
