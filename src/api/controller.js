'use strict';

const _ = require('lodash');
const axios = require('axios');

// config related variables
const {
    REPOS_PER_PAGE,
    MAX_REPOS_PER_CHART,
    MAX_REPOS_PER_USER,
    RANDOM_STATEMENTS,
    MISTERY_STATEMENTS,
    TOKEN_MISSING_ERROR_MESSAGE
} = require('../config');

// load utils
const { emojiGenerator } = require('../utils/emoji-generator');
const { getColorsForLanguages } =require('../utils/language-colors-generator');


const token = process.env.TOKEN || false;
if (!token) {
    throw TOKEN_MISSING_ERROR_MESSAGE;
}

// initialize service
const OctokitService = require('./octokit');
const octokitService = new OctokitService(token);

const reqRepos = async (username, numberOfPages) => {
    const requests = [];
    for (let i = 1; i <= numberOfPages; i++) {
        requests.push(await octokitService.getReposForUser(username, i));
    }
    return requests;
};

exports.index = async (req, res) => {
    const currentYear = new Date().getFullYear();
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
        currentYear,
        username: ''
    };

    if (_.isUndefined(username)) {
        res.render('layouts/main', {
            ...defaultRenderValue
        });
        return;
    }

    await octokitService.getUser(username)
        .then(async (user) => {
            const userData = user;
            const numberOfRepos = userData.public_repos;

            // display "too many repos" per user layout
            if (numberOfRepos > MAX_REPOS_PER_USER) {
                const warningMessage = 'Uh oh! Looks like this user has a large number of repos! To keep things running smoothly, we can only display a limited amount right now. Please try a different user.';
                res.render('layouts/main', {
                    error: {
                        code: 'Too many repos',
                        message: warningMessage
                    },
                    currentYear
                });
                return;
            }

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

            axios.all(await reqRepos(username, numberOfPages))
                .then((pages) => {
                    const reposData = _.flatMap(pages, (page) => page);

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
