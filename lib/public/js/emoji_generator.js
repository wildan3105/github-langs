
const generateEmoji = (repoLength) => {
    switch (repoLength) {
    case repoLength >= 100: return '💯 👍 😎 👏';
    case repoLength < 100 && repoLength >= 75: return '👍 😎 👏';
    case repoLength < 75 && repoLength >= 50: return '👍 😎';
    case repoLength < 50 && repoLength >= 20: return '👍';
    case repoLength < 20 && repoLength > 0: return '🙂';
    case repoLength === 0: return '😪';
    default: return '';
    }
};

module.exports = {
    generateEmoji
};
