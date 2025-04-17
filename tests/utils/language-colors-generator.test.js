/* eslint-disable no-undef */
import { getColorsForLanguages } from '../../src/utils/language-colors-generator.js';
import expect from 'expect.js';

describe('emojiGenerator', () => {
    it('should return [`#E8274B`] for language `ABAP`', () => {
        const languages = {
            ABAP: 'ABAP'
        };

        const colorsGenerated = getColorsForLanguages(languages);

        expect(colorsGenerated).to.be.an('array');
        expect(colorsGenerated).to.have.length(1);
        expect(colorsGenerated[0]).to.eql('#E8274B');
    });

    it('should return [`#E8274B`, `#882B0F`] for languages `ABAP` and `ActionScript`', () => {
        const languages = {
            ABAP: 'ABAP',
            ActionScript: 'ActionScript'
        };

        const colorsGenerated = getColorsForLanguages(languages);

        expect(colorsGenerated).to.be.an('array');
        expect(colorsGenerated).to.have.length(2);
        expect(colorsGenerated[0]).to.eql('#E8274B');
        expect(colorsGenerated[1]).to.eql('#882B0F');
    });

    it('should return [`#000`] for unknown language', () => {
        const languages = {
            Unknown: 'Unknown'
        };

        const colorsGenerated = getColorsForLanguages(languages);

        expect(colorsGenerated).to.be.an('array');
        expect(colorsGenerated).to.have.length(1);
        expect(colorsGenerated[0]).to.eql('#000');
    });
});
