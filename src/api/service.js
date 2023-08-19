'use strict';

const axios = require('axios');
const { REPOS_PER_PAGE } = require('../config');

class GithubService {
    constructor(url, clientId, clientSecret) {
        this.url = url,
        this.clientParams = `client_id=${clientId}&client_secret=${clientSecret}`;

        this.timeout = 10000;
        this.reposPerPage = REPOS_PER_PAGE;
    }

    async getUser(username) {
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': `${username}`
            },
            timeout: this.timeout,
            url: `${this.url}/users/${username}?${this.clientParams}`
        };

        try {
            return await axios(options);
        } catch (e) {
            throw e;
        }
    }

    async getReposForUser(username, page) {
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': `${username}`
            },
            timeout: this.timeout,
            url: `${this.url}/users/${username}/repos?${this.clientParams}&per_page=${this.reposPerPage}&page=${page}`
        };

        try {
            return await axios(options);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = GithubService;
