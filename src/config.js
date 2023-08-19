const GITHUB_API_URL = 'https://api.github.com';

const REPOS_PER_PAGE = 100;
const MAX_REPOS_PER_CHART = 20;

const ENV_MISSING_ERROR_MESSAGE = 'Missing ENV environment variables';
const CLIENT_ID_AND_CLIENT_SECRET_MISSING_ERROR_MESSAGE = 'Missing CLIENT_ID and CLIENT_SECRET environment variables';

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
    GITHUB_API_URL,
    REPOS_PER_PAGE,
    MAX_REPOS_PER_CHART,
    ENV_MISSING_ERROR_MESSAGE,
    CLIENT_ID_AND_CLIENT_SECRET_MISSING_ERROR_MESSAGE,
    RANDOM_STATEMENTS,
    MISTERY_STATEMENTS
};
