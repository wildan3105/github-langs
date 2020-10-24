const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.index);

router.use('*', (req, res) => {
    res.render('layouts/main', {
        error: {
            code: 404,
            message: 'Page not found!'
        }
    });
});

module.exports = router;
