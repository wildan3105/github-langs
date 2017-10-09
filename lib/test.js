const request = require('request');
const r = request.defaults({ proxy:'http://wildansn:74647276@cache.itb.ac.id:8080' });

r.get('https://google.com', (res, err, body) => {
    console.log(res);
    console.log(err);
    console.log(body);
});
