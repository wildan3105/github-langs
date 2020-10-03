/* eslint-disable no-undef */

import { chart,sum } from "../../lib/public/js/chart";
console.log(a)
const expect = require('expect.js');

describe('charts', () => {

    it('should return calculated sum of array elements', async () => {
        const sum = await sum([1,2,3,4]);
        expect(sum).to.be.equal(10);
    });
});