const app = require('./api/app');

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`github-langs running on port: ${server.address().port}`);
});
