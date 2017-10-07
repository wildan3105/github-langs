const request = require('request');

const options = {
  url: 'https://api.github.com/users/wildan3105',
  headers: {
    'User-Agent' : 'wildan3105'
  }
}

request.get(options, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
