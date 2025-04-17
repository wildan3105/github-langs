import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
const { json, urlencoded } = bodyParser;
const app = express();

import routes from './routes.js';

import { ENV_MISSING_ERROR_MESSAGE } from '../config.js';

if (!process.env.ENV) {
    throw ENV_MISSING_ERROR_MESSAGE;
}

// template engine setup
app.set('views', 'src/pages');
app.engine('.handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir:'src/pages/layouts',
    partialsDir:'src/pages/partials'
}));
app.set('view engine', '.handlebars');

// useful middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.use('/', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`github-langs running on port: ${process.env.PORT || 3000}`);
});
