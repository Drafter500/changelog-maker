const childProcess = require('child_process');
const { getChangeLog } = require('./git-utils');


async function getCurrentRepoOwnerAndName() {
  return new Promise((resolve, reject) => {
    const getRepoUrlCommand = 'git config --get remote.origin.url';

    childProcess.exec(getRepoUrlCommand, (err, stdout) => {
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
  const [ owner, repo ] = await getCurrentRepoOwnerAndName();

  console.info(await getChangeLog(owner, repo));
}


module.exports = {
  getCurrentRepoOwnerAndName,
  makeChangelog,
};
