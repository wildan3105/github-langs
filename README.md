# Github Language Checker

![test pipeline](https://github.com/wildan3105/github-langs/actions/workflows/node.js.yml/badge.svg)
[![HitCount](http://hits.dwyl.com/wildan3105/github-langs.svg)](http://hits.dwyl.com/wildan3105/github-langs) 
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/wildan3105/github-langs/issues)

## What ?

> A website to show the stats of programming language in the repos that a certain github account has.

[Go to the web!](https://github-langs-5e166fe51f35.herokuapp.com/)

![Screenshot](screenshot.png)

## Why does this project exist?

So people can see the stats of programming language being used in their repositories easily.

## Key features
- Show statistics of repo's programming language (overall) from a given github account
- Display the total of each programming language based on github [programming language color](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml)
- Browse the repo with specific programming language directly from the chart bar
- Ability to switch between multicolor or single color (white)
- Ability to download the chart in a JPG file
- Ability to share the result via facebook or twitter

## Running locally

### Supported environment:
* Prerequisite: Node >= v18.0.0 and NPM >= 9.5.0

* [Generate access token (classic)](https://github.com/settings/tokens/new) to ensure you don't get rate limited API call.

* Define environment variable with the following values:
```
TOKEN=your-access-token
ENV=local
```

An example of environment variable is provided [here](.env.example)

* Install dependency: `npm install`
* Start the app `<list-of-env-and-values> npm run start` and go to `http://localhost:3000`

## Feature tracker:
You can see the feature progress and pick up some issues in the [issues](https://github.com/wildan3105/github-langs/issues) or [projects](https://github.com/wildan3105/github-langs/projects) or [milestones](https://github.com/wildan3105/github-langs/milestones)

## Contributing

Check out this [page](CONTRIBUTING.md)
## Other similar projects:
- [Githut](https://github.com/madnight/githut)
- [Hacktoberfest Checker](https://github.com/jenkoian/hacktoberfest-checker) (unfortunately it's now archived)

## License :

MIT (c) Wildan S. Nahar 2017 - 2023
