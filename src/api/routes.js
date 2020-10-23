const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.index);

// testing 
const GithubService = require('./service');
const githubService = new GithubService();

router.get('/api/user', async (req, res) => {
    try {
        const user = await githubService.getUser(req.query.username);
        return res.status(200).send(user.data);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.get('/api/repos', async (req, res) => {
    try {
        const user = await githubService.getReposForUser(req.query.username, req.query.page);
        return res.status(200).send(user.data);
    } catch (e) {
        res.status(e.response.status).send(e.response.data);
    }
});

router.get('/api/existing/repos', controller.index);

router.use('*', (req, res) => {
    res.render('layouts/main', {
        error: {
            code: 404,
            message: 'Page not found!'
        }
    });
});

module.exports = router;
