'use strict';

import _ from 'lodash';
const { isUndefined, defaults, flatMap, fromPairs, sortBy, toPairs, maxBy, keys, sample } = _;
import { all } from 'axios';

// config related variables
import { REPOS_PER_PAGE, MAX_REPOS_PER_CHART, MAX_REPOS_PER_USER, RANDOM_STATEMENTS, MISTERY_STATEMENTS, TOKEN_MISSING_ERROR_MESSAGE } from '../config.js';

// load utils
import { emojiGenerator } from '../utils/emoji-generator.js';
import { getColorsForLanguages } from '../utils/language-colors-generator.js';

const token = process.env.TOKEN || false;
if (!token) {
    throw TOKEN_MISSING_ERROR_MESSAGE;
}

// initialize service
import OctokitService from './octokit.js';
const octokitService = new OctokitService(token);

const reqRepos = async (username, numberOfPages) => {
    const requests = [];
    for (let i = 1; i <= numberOfPages; i++) {
        requests.push(await octokitService.getReposForUser(username, i));
    }
    return requests;
};

export async function index(req, res) {
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

    if (isUndefined(username)) {
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
                    ...defaults({
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

            all(await reqRepos(username, numberOfPages))
                .then((pages) => {
                    const reposData = flatMap(pages, (page) => page);

                    (numberOfRepos === 1) ? repos = `${numberOfRepos} repo` : repos = `${numberOfRepos} repos`;
                    reposData.forEach((repo) => {
                        languages[repo.language] = (languages[repo.language] || 0) + 1;
                    });
                    languages = fromPairs(sortBy(toPairs(languages), (a) => a[1]).reverse());

                    if (languages.null) {
                        languages.unknown = languages.null;
                        delete languages.null;
                    }
                    const goodAt = maxBy(keys(languages), (o) => languages[o]);
                    const goodAtMysteryLanguage = (goodAt === 'unknown');

                    // change language of 'unknown' to 'unknown (fork repository)'
                    const oldKey = 'unknown';
                    const newKey = 'Unknown (forked repository)';
                    const isContainUnknown = Object.keys(languages).indexOf(oldKey) > 0 ? true : false;
                    if (isContainUnknown) {
                        delete Object.assign(languages, { [newKey] : languages[oldKey] })[oldKey];
                    }

                    const randomStatement = goodAtMysteryLanguage ? sample(MISTERY_STATEMENTS) : sample(RANDOM_STATEMENTS);
                    goodAtMysteryLanguage ? statement = `${randomStatement}` : statement = `${randomStatement} ${goodAt}!`;

                    const limitLabel = Object.keys(languages).length > MAX_REPOS_PER_CHART;

                    res.render('layouts/main', {
                        ...defaults({
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
                    ...defaults({ msg: 'User was not found' }, defaultRenderValue)
                });
                return;
            }
        });
}
