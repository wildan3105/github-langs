/* eslint-disable no-undef */
const { emojiGenerator } = require('../../src/utils/emoji_generator');
const expect = require('expect.js');

describe('emojiGenerator', () => {
    it('should return `` if the total repo is not a number', () => {
        const repo = '';
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('');
    });

    it('should return 😪 if the total repo is equal to zero', () => {
        const repo = 0;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('😪');
    });

    it('should return 🙂 if the total repo is more than 0 and less than 25', () => {
        const repo = 10;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('🙂');
    });

    it('should return `👍` if the total repo is more than 25 and less than 50', () => {
        const repo = 49;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('👍');
    });

    it('should return `👍 😎` if the total repo is more than 50 and less than 75', () => {
        const repo = 70;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('👍 😎');
    });

    it('should return `👍 😎 👏` if the total repo is more than 75 and less than 100', () => {
        const repo = 85;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('👍 😎 👏');
    });

    it('should return `💯 👍 😎 👏` if the total repo is more than 100', () => {
        const repo = 101;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('💯 👍 😎 👏');
    });
});
