const axios = require('axios');

const options = {
  url: 'https://api.github.com/users/wildan3105',
  headers:{
    'User-Agent':'wildan3105'
  }
}

const getUser = () => {
  return axios.get(options)
}

const getGithub = () => {
  return axios.get('https://api.github.com')
}

axios.all([
    axios.get('https://api.github.com/users/kajskajskajsk'),
    axios.get('https://api.github.com/users/codeheaven-io/repos')
  ])
  .then(axios.spread(function (userResponse, reposResponse) {
    //... but this callback will be executed only when both requests are complete.
    console.log('User', userResponse.data);
    console.log('Repositories', reposResponse.data);
  }));
