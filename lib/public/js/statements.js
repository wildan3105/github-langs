
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

const statements = [
    'You\'ve got skills on',
    'Wow! You really like',
    'Good job on',
    'Keep going on',
    'Awesome! You must like',
    'Excellent! Keep up the good work on'
];

const mysteryStatements = [
    'Wow, you like the mystery language',
    'Wow, you are a mystery man!',
    'You must be like forking someone`s repo!'
];

module.exports = {
    statements,
    mysteryStatements,
    getEmoji
};
