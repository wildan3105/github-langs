import { Router } from 'express';
const router = Router();

import { index } from './controller.js';

router.get('/', index);

router.use('*', (_, res) => {
    res.render('layouts/main', {
        error: {
            code: 404,
            message: 'Page not found!'
        },
        currentYear: new Date().getFullYear()
    });
});

export default router;
