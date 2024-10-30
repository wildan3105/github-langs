const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.index);

router.use('*', (_, res) => {
    res.render('layouts/main', {
        error: {
            code: 404,
            message: 'Page not found!'
        },
        currentYear: new Date().getFullYear()
    });
});

module.exports = router;
