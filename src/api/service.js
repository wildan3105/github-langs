'use strict';

const axios = require('axios');
const { GITHUB_API_URL } = require('../../config/api_url');
const { REPOS_PER_PAGE } = require('../../config/constants');

class GithubService {
    constructor() {
        this.url = GITHUB_API_URL,
        this.timeout = 10000;
        this.clientParams = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
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
