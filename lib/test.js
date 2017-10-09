const request = require('request');
const r = request.defaults({ proxy:'' });

r.get('https://google.com', (res, err, body) => {
    console.log(res);
    console.log(err);
    console.log(body);
});
