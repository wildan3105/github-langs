
const emojiGenerator = (repoLength) => {
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

module.exports = {
    emojiGenerator
};
