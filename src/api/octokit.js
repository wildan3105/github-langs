'use strict';

const { Octokit } = require('octokit');
const { REPOS_PER_PAGE } = require('../config');

class OctokitService {
    constructor(token) {
        this.token = token,
        this.octokit = new Octokit({
            auth: this.token
        });
    }

    async getUser(username) {
        try {
            const { data } = await this.octokit.request(`GET /users/${username}`);
            return data;
        } catch (e) {
            throw e;
        }
    }

    async getReposForUser(username, page) {
        try {
            const { data } = await this.octokit.request(`GET /users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=${page}`);
            return data;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = OctokitService;
