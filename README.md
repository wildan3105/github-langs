# Github Language Checker

[![Build Status](https://travis-ci.org/wildan3105/github-langs.svg?branch=master)](https://travis-ci.org/wildan3105/github-langs)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d8bb38610b33412b993cdd4068bc0713)](https://www.codacy.com/app/wildan3105/github-langs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=wildan3105/github-langs&amp;utm_campaign=Badge_Grade)
[![HitCount](http://hits.dwyl.com/wildan3105/github-langs.svg)](http://hits.dwyl.com/wildan3105/github-langs)   [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/wildan3105/github-langs/issues)


## What ?

> Useful web checker to see what languages are used from a github account.

[Go to the web!](https://githublangs.herokuapp.com)

![Screenshot](screenshot5.png)

## Why ?

Let everyone know their languages statistic on github repo.

## Running the app locally

* [Generate a GitHub OAuth client id and client secret](https://github.com/settings/applications/new) to ensure you don't get rate limited API call.
* Create `.env` file with this content :

```
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

* Install dependency : `npm install`
* **ALWAYS** run test before start the app : `npm run lint`

* Start the app `npm start` and go to : `http://localhost:5000`

## Running app through Docker

* Build image : `docker build -t local/github-langs .`
* Run image : ```docker run -v `pwd`/tests/screenshot-testing/screenshots:/app/tests/screenshot-testing/screenshots -v `pwd`/views:/app/views -v `pwd`/lib:/app/lib -it -p 5000:5000 --env-file .env local/github-langs```
* Start server in appeared terminal : `npm start`
* App is now available on `http://localhost:5000`

## Testing app through Docker

* Build image : `docker build -t local/github-langs .`
* Run image : ```docker run -v `pwd`/tests/screenshot-testing/screenshots:/app/tests/screenshot-testing/screenshots -v `pwd`/views:/app/views -v `pwd`/lib:/app/lib -it -p 5000:5000 --env-file .env local/github-langs```
* Redirect display output to xvfb : `source start-xvfb.sh`
* Execute tests : `npm test`

## TO DO LIST (ordered by priority) :
- [x] : Show repo > 100 (currently, only support repo < 100)
- [x] : Add vertical bar based on languages
- [x] : Refactor the controller (**urgent**) [#22](https://github.com/wildan3105/github-langs/issues/22)
- [x] : Beautify the page [#16](https://github.com/wildan3105/github-langs/issues/16)
- [x] : Toggle graph color (white or colorful)
- [x] : Save graph as image
- [x] : Add social button (fb `share` & twitter `tweet`)
- [ ] : Redirect to `/me` if user already logged in (Github)
- [ ] : Improve UI
- [ ] : Increase speed & security

## Contributing

Check out this [page](CONTRIBUTING.md)
## Related project(s)
- [Githut](https://github.com/madnight/githut)

## License :

MIT (c) Wildan S. Nahar 2017
