/* eslint-disable no-undef */
const { emojiGenerator } = require('../../lib/public/js/emoji_generator');
const expect = require('expect.js');

describe('emojiGenerator', () => {
    it('should return 😪 if the total repo is equal to zero', () => {
        const repo = 0;
        const emojiGenerated = emojiGenerator(repo);

        expect(emojiGenerated).to.equal('😪');
    });
});
