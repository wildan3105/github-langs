const REPOS_PER_PAGE = 100;
const MAX_REPOS_PER_CHART = 20;
const MAX_REPOS_PER_USER = 1000;

const ENV_MISSING_ERROR_MESSAGE = 'Missing ENV environment variables';
const TOKEN_MISSING_ERROR_MESSAGE = 'Missing token';

const RANDOM_STATEMENTS = [
    'You\'ve got skills on',
    'Wow! You really like',
    'Good job on',
    'Keep going on',
    'Awesome! You must like',
    'Excellent! Keep up the good work on'
];

const MISTERY_STATEMENTS = [
    'Wow, you like the mystery language',
    'Wow, you are a mystery man!',
    'You must be like forking someone`s repo!'
];

module.exports = {
    REPOS_PER_PAGE,
    MAX_REPOS_PER_CHART,
    ENV_MISSING_ERROR_MESSAGE,
    TOKEN_MISSING_ERROR_MESSAGE,
    RANDOM_STATEMENTS,
    MISTERY_STATEMENTS,
    MAX_REPOS_PER_USER
};
