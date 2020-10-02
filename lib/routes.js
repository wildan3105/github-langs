const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.index);

router.use('*', controller.notFound);

module.exports = router;
