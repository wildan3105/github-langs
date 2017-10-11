# Github Language Checker

[![Build Status](https://travis-ci.org/wildan3105/github-langs.svg?branch=master)](https://travis-ci.org/wildan3105/github-langs) [![HitCount](http://hits.dwyl.com/wildan3105/github-langs.svg)](http://hits.dwyl.com/wildan3105/github-langs)   [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/wildan3105/github-langs/issues)


> Useful web checker to see what languages are used from a github account.

[Go to the web!](https://githublangs.herokuapp.com)

![Screenshot](screenshot3.png)

## Running the app locally

* [Generate a GitHub OAuth client id and client secret](https://github.com/settings/applications/new) to ensure you don't get rate limited API call.
* Create `.env` file with this content :
```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```
* Install dependency : `npm install`
* **ALWAYS** run test before start the app : `npm run test`
* Start the app `npm start` and go to : `http://localhost:5000`

## Running app through Docker

* Build image : `docker build -t local/github-langs .`
* Run image : `docker run -p 5000:5000 --env-file .env local/github-langs`
* App now available on `http://localhost:5000`

## TO DO LIST :
- [x] : Show repo > 100 (currently, only support repo < 100)
- [x] : Add vertical bar based on languages
- [ ] : Beautify the page

## Contributing

Check out this [page](CONTRIBUTING.md)

## License :

MIT (c) Wildan S. Nahar 2017
