'use strict';
const colorList = require('./public/json/colors.json');
const dotenv = require('dotenv');
const _ = require('lodash');
const { error } = dotenv.config({ silent: true });
const axios = require('axios');
const config = require('./config');

const apiUrl = config.GITHUB_API_URL;

// load environment file
if (error) {
    console.warn(error.message);
}

const client_id = process.env.CLIENT_ID || false;
const client_secret = process.env.CLIENT_SECRET || false;
if (!(client_id && client_secret)) {
    throw 'Missing CLIENT_ID and CLIENT_SECRET environment variables';
}
const clientParams = `client_id=${client_id}&client_secret=${client_secret}`;

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

const getColors = (languages) => {
    const defaultColor = '#000';
    const colors = [];
    Object.keys(languages).forEach((key) => {
        colors.push(colorList[key] || defaultColor);
    });
    return colors;
};

const reqUser = (username) => {
    const url = `${apiUrl}/users/${username}?${clientParams}`;
    const headers = { 'User-Agent': `${username}` };
    return axios.get(url, { headers });
};

const reqRepos = (username, numberOfPages) => {
    const headers = { 'User-Agent': `${username}` };
    const url = (page) =>
        `${apiUrl}/users/${username}/repos?${clientParams}&per_page=100&page=${page}`;
    const requests = [];
    for (let i = 1; i <= numberOfPages; i++) {
        requests.push(axios.get(url(i), { headers }));
    }
    return requests;
};

exports.index = (req, res) => {
    const { username } = req.query;
    const currentYear = new Date().getFullYear();
    let avatar, msg, repos, statement, type, title = '';
    let languages = {};
    const statements = [
        'You\'ve got skills on',
        'Wow! You really like',
        'Good job on',
        'Keep going on'
    ];
    const mysteryStatements = [
        'Wow, you like the mystery language',
        'Wow, you are a mystery man!',
        'You must be like forking someone`s repo!'
    ];
    if (username === undefined) {
        res.render('layouts/main', {
            show: {
                result: false,
                chart: false
            },
            username: '',
            type,
            avatar,
            languages,
            msg,
            repos,
            statement,
            currentYear,
            title
        });
        return;
    }
    reqUser(username)
        .then((usr) => {
            const usrData = usr.data;
            avatar = usrData.avatar_url;
            type = usrData.type === 'Organization' ? 'Organization' : 'Personal';
            title = `| ${username} - ${type}`;
            const numberOfRepos = usrData.public_repos;
            if (numberOfRepos === 0) {
                repos = `${username} has no repo`;
                res.render('layouts/main', {
                    show: {
                        result: true,
                        chart: false
                    },
                    username,
                    type,
                    avatar,
                    languages: {},
                    msg,
                    repos,
                    showEmoji: getEmoji(numberOfRepos),
                    statement,
                    currentYear,
                    title
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

                    // change language of 'unknown' to 'unknown (fork repository)'
                    const oldKey = 'unknown';
                    const newKey = 'Unknown (forked repository)';
                    const isContainUnknown = Object.keys(languages).indexOf(oldKey) > 0 ? true : false;
                    if (isContainUnknown) {
                        delete Object.assign(languages, { [newKey] : languages[oldKey] })[oldKey];
                    }

                    const randomStatement = goodAtMysteryLanguage ? _.sample(mysteryStatements) : _.sample(statements);
                    goodAtMysteryLanguage ? statement = `${randomStatement}` : statement = `${randomStatement} ${goodAt}!`;

                    const limitLabel = Object.keys(languages).length > 20;

                    res.render('layouts/main', {
                        show: {
                            result: true,
                            chart: true
                        },
                        username,
                        type,
                        avatar,
                        languages: JSON.stringify(languages),
                        colors: JSON.stringify(getColors(languages)),
                        showEmoji: getEmoji(numberOfRepos),
                        msg,
                        repos,
                        statement,
                        limitLabel,
                        goodAt,
                        currentYear,
                        title
                    });
                });
        })
        .catch((err) => {
            if (err.response.data.message === 'Not Found') {
                msg = 'User was not found';
                res.render('layouts/main', {
                    show: {
                        result: false,
                        chart: false
                    },
                    username,
                    type,
                    avatar,
                    languages: JSON.stringify(languages),
                    colors: JSON.stringify(getColors(languages)),
                    msg,
                    repos,
                    statement,
                    currentYear,
                    title
                });
                return;
            }
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
