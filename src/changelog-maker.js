const childProcess = require('child_process');
const { getChangeLog } = require('./git-utils');


async function getCurrentRepoOwnerAndName() {
  return new Promise((resolve, reject) => {
    const getRepoUrlCommand = 'git config --get remote.origin.url';

    childProcess.exec(getRepoUrlCommand, (err, stdout) => {
      if (err) {
        reject(err);
      }

      if (stdout.includes('git@')) {
        // SSH style
        let [ owner, repo ] = stdout.split('/');
        owner = owner.split(':')[1];
        repo = repo.split('.git')[0];
        resolve([owner, repo]);
      } else {
        // HTTP style
        const [ owner, repo ] = stdout.split('/').slice(-2);
        let repoTrimmed = repo;
        if (repo.endsWith('\n')) {
          repoTrimmed = repo.slice(0, -1);
        }

        resolve([owner, repoTrimmed]);
      }
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
