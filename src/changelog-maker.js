const { fetchJson } = require('./fetch-json');
const { getDefaultRequestOptions } = require('./request-options');


function generateChangeLogText() {
  return 'test';
}

async function getCurrentRepoOwnerAndName() {
  return new Promise((resolve, reject) => {
    const getRepoUrlCommand = 'git config --get remote.origin.url';

    require('child_process').exec(getRepoUrlCommand, function(err, stdout) {
      if (err) {
        reject(err);
      }

      let [ owner, repo ] = stdout.split('/').slice(-2);
      if (repo.endsWith('\n')) {
        repo = repo.slice(0, -1);
      }

      resolve([owner, repo]);
    });
  });
}

async function makeChangelog() {

}


module.exports = {
  generateChangeLogText,
  getCurrentRepoOwnerAndName,
  makeChangelog
};
