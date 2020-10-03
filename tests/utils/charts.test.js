/* eslint-disable no-undef */
const expect = require('expect.js');
const { sum, slugify } = require('../../lib/public/js/chart');

describe('charts', () => {
    it('should return calculated sum of array elements',  () => {
        const total = sum([1, 2, 3, 4]);
        expect(total).to.be.equal(10);
    });

    it('should return slugified version of text',  () => {
        const slugified = slugify(
            'This is 123123 some randome test *&Y*& - message'
        );
        expect(slugified).to.be.eql(
            'this-is-123123-some-randome-test-*&y*&-message'
        );
    });
});
