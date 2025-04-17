'use strict';

import { Octokit } from 'octokit';
import { REPOS_PER_PAGE } from '../config.js';

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
            console.log('An error occurred while fetching user:', e);
            throw e;
        }
    }

    async getReposForUser(username, page) {
        try {
            const { data } = await this.octokit.request(`GET /users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=${page}`);
            return data;
        } catch (e) {
            console.log('An error occurred while fetching repos for user:', e);
            throw e;
        }
    }
}

export default OctokitService;
