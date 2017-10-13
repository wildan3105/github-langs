// load environment file
const dotenv = require('dotenv');
const { error } = dotenv.config({ silent: true });
if (error) {
    console.warn(error.message);
}

const app = require('./lib/app');


app.listen(app.get('port'), () => console.log('github-langs running on port', app.get('port')));
