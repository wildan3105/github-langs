const app = require('./lib/app');

app.listen(app.get('port'), () => {
  console.log('github-langs running on port', app.get('port'));
});
