'use strict';

const _ = require('lodash');
const axios = require('axios');

// config related variables
const {
    GITHUB_API_URL,
    CLIENT_ID_AND_CLIENT_SECRET_MISSING_ERROR_MESSAGE,
    REPOS_PER_PAGE,
    MAX_REPOS_PER_CHART,
    RANDOM_STATEMENTS,
    MISTERY_STATEMENTS
} = require('../config');

// load utils
const { emojiGenerator } = require('../utils/emoji-generator');
const { getColorsForLanguages } =require('../utils/language-colors-generator');


const client_id = process.env.CLIENT_ID || false;
const client_secret = process.env.CLIENT_SECRET || false;
if (!(client_id && client_secret)) {
    throw CLIENT_ID_AND_CLIENT_SECRET_MISSING_ERROR_MESSAGE;
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
    let avatar, msg, repos, statement, type, title, languages = {};
    const { username } = req.query;
    const defaultRenderValue = {
        show:
            {
                result: false,
                chart: false
            },
        avatar,
        msg,
        repos,
        statement,
        type,
        title,
        languages,
        currentYear: new Date().getFullYear(),
        username: ''
    };

    if (_.isUndefined(username)) {
        res.render('layouts/main', {
            ...defaultRenderValue
        });
        return;
    }

    await githubService.getUser(username)
        .then((user) => {
            const userData = user.data;
            const numberOfRepos = userData.public_repos;
            const fetchedRenderValue = {
                avatar: userData.avatar_url,
                type: userData.type === 'Organization' ? 'Organization' : 'Personal'
            };

            fetchedRenderValue.title = `| ${username} - ${fetchedRenderValue.type}`;

            if (numberOfRepos === 0) {
                repos = `${username} has no repo`;
                res.render('layouts/main', {
                    ..._.defaults({
                        show: { result: true, chart: false },
                        username,
                        repos,
                        showEmoji: emojiGenerator(numberOfRepos),
                        ...fetchedRenderValue },
                    defaultRenderValue)
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

                    const randomStatement = goodAtMysteryLanguage ? _.sample(MISTERY_STATEMENTS) : _.sample(RANDOM_STATEMENTS);
                    goodAtMysteryLanguage ? statement = `${randomStatement}` : statement = `${randomStatement} ${goodAt}!`;

                    const limitLabel = Object.keys(languages).length > MAX_REPOS_PER_CHART;

                    res.render('layouts/main', {
                        ..._.defaults({
                            show: { result: true, chart: true },
                            username,
                            repos,
                            languages: JSON.stringify(languages),
                            colors: JSON.stringify(getColorsForLanguages(languages)),
                            showEmoji: emojiGenerator(numberOfRepos),
                            statement,
                            limitLabel,
                            goodAt,
                            ...fetchedRenderValue },
                        defaultRenderValue)
                    });
                });
        })
        .catch((err) => {
            if (err.response.data.message === 'Not Found') {
                res.render('layouts/main', {
                    ..._.defaults({ msg: 'User was not found' }, defaultRenderValue)
                });
                return;
            }
        });
};
