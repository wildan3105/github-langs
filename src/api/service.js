'use strict';

const axios = require('axios');
const { GITHUB_API_URL } = require('../../config/api_url');

class GithubService {
    constructor() {
        this.url = GITHUB_API_URL,
        this.timeout = 10000;
        this.clientParams = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;
    }

    async getUser(username) {
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': `${username}`
            },
            url: `${this.url}/users/${username}?${this.clientParams}`
        };

        try {
            return await axios(options);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getReposForUser(username, page) {
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': `${username}`
            },
            url: `${this.url}/users/${username}/repos?${this.clientParams}&per_page=100&page=${page}`
        };

        try {
            return await axios(options);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

module.exports = GithubService;
