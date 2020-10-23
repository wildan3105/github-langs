'use strict';

const _ = require('lodash');
const axios = require('axios');

// config related variables
const { CLIENT_ID_AND_CLIENT_SECRET_MISSING } = require('../../config/error_messages');
const { statements, mysteryStatements } = require('../../config/random_statements');
const { GITHUB_API_URL } = require('../../config/api_url');
const { REPOS_PER_PAGE, MAX_REPOS_PER_CHART } = require('../../config/constants');

// load utils
const { emojiGenerator } = require('../utils/emoji_generator');
const { getColorsForLanguages } = require('../utils/language_colors_generator');


const client_id = process.env.CLIENT_ID || false;
const client_secret = process.env.CLIENT_SECRET || false;
if (!(client_id && client_secret)) {
    throw CLIENT_ID_AND_CLIENT_SECRET_MISSING;
}
const clientParams = `client_id=${client_id}&client_secret=${client_secret}`;

// load service
const GithubService = require('./service');
const githubService = new GithubService();

const reqRepos = (username, numberOfPages) => {
    const headers = { 'User-Agent': `${username}` };
    const url = (page) =>
        `${GITHUB_API_URL}/users/${username}/repos?${clientParams}&per_page=${REPOS_PER_PAGE}&page=${page}`;
    const requests = [];
    for (let i = 1; i <= numberOfPages; i++) {
        requests.push(axios.get(url(i), { headers }));
    }
    return requests;
};

exports.index = async (req, res) => {
    const { username } = req.query;
    const currentYear = new Date().getFullYear();
    let avatar, msg, repos, statement, type, title = '';
    let languages = {};

    if (_.isUndefined(username)) {
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
    await githubService.getUser(username)
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
                    showEmoji: emojiGenerator(numberOfRepos),
                    statement,
                    currentYear,
                    title
                });
                return;
            }
            const numberOfPages = (parseInt(numberOfRepos) / REPOS_PER_PAGE) + 1;
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

                    const limitLabel = Object.keys(languages).length > MAX_REPOS_PER_CHART;

                    res.render('layouts/main', {
                        show: {
                            result: true,
                            chart: true
                        },
                        username,
                        type,
                        avatar,
                        languages: JSON.stringify(languages),
                        colors: JSON.stringify(getColorsForLanguages(languages)),
                        showEmoji: emojiGenerator(numberOfRepos),
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
                    colors: JSON.stringify(getColorsForLanguages(languages)),
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
