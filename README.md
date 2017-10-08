# Github Language Checker

Useful web checker to see what languages are used from a github account inspired by [Hacktoberfestchecker](https://hacktoberfestchecker.herokuapp.com)

[Github-langs](https://github-langs.herokuapp.com)

![Screenshot](screenshot.png)

## Running the app locally

* [Generate a GitHub OAuth client id and client secret](https://github.com/settings/applications/new) to ensure you don't get rate limited API call.

* Create `config.json` file with this content :
```json
{
  "client_id":"your_client_id",
  "client_secret":"your_client_secret"
}
```

* If you want to run test (with eslint) : `npm run eslint`

* Install dependency : `npm install`

* `npm start` and go to : `http://localhost:5000`

## TO DO LIST :
- [ ] : Show repo > 100 (currently, only support repo < 100)
- [ ] : Add vertical bar based on languages
- [ ] : Beautify the page

## License :

MIT (c) Wildan S. Nahar 2017
