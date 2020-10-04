/* eslint-disable no-undef */
const { JSDOM } = require('jsdom');
const expect = require('expect.js');

const loading = '<div id="overlay"></div>';
const content = '<div id="realContent"></div>';
const username = '<input id="username" value="test">';

const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
      ${loading}
      ${content}
      ${username}
    </body>
</html>`);

global.document = dom.window.document;

const showLoader = require('../../lib/public/js/spinner');
const loadingEl = document.getElementById('overlay');
const contentEl = document.getElementById('realContent');
const usernameEl = document.getElementById('username');

describe('showSpinner', () => {
    after(() => {
        global.document = undefined;
    });

    it('should hide the spinner on load', () => {
        expect(loadingEl.style.visibility).to.be('hidden');
        expect(contentEl.style.visibility).to.be('visible');
    });

    it('should show the spinner when the user is filled', () => {
        showLoader();

        expect(loadingEl.style.visibility).to.be('visible');
        expect(contentEl.style.visibility).to.be('hidden');
    });

    it('should not show the spinner when the user is empty', () => {
        loadingEl.style.visibility = 'hidden';
        contentEl.style.visibility = 'visible';
        usernameEl.value = '';
        showLoader();

        expect(loadingEl.style.visibility).to.be('hidden');
        expect(contentEl.style.visibility).to.be('visible');
    });
});
