const querystring = require('querystring');
const { fetchJson } = require('./fetch-json');
const { getDefaultRequestOptions } = require('./request-options');


async function getLatestTagCommitHash(account, repo) {
  try {
    const tags = await fetchJson({
      ...getDefaultRequestOptions(),
      path: `/repos/${account}/${repo}/tags?per_page=1`,
    });

    if(tags.length === 0) {
      throw new Error('No tags found.');
    }

    console.info('Latest tag:', tags[0].name);

    return tags[0].commit.sha;
  } catch(e) {
    console.error('Failed to fetch latest tag');
    throw e;
  }
}

async function getCommitDate(account, repo, commitHash) {
  try {
    const commit = await fetchJson({
      ...getDefaultRequestOptions(),
      path: `/repos/${account}/${repo}/commits/${commitHash}`,
    });

    return commit.commit.committer.date;
  } catch(e) {
    console.error('Failed to get commit date');
    throw e;
  }
}

async function getCommits(account, repo, startDate) {
  const commitsPerPage = 100;
  let page = 0;

  try {
    const query = querystring.stringify({
      per_page: commitsPerPage,
      page,
      ...(startDate && {since: startDate}), //TODO: remove this check
    });

    let fetchResult = await fetchJson({
      ...getDefaultRequestOptions(),
      path: `/repos/${account}/${repo}/commits?${query.toString()}`,
    });

    let commits = [...fetchResult];

    // Get commits from each next page as long as there is something
    while (fetchResult.length === commitsPerPage) {
      page++;

      const newQuery = querystring.stringify({
        per_page: commitsPerPage,
        page,
        ...(startDate && {since: startDate}),
      });

      fetchResult = await fetchJson({
        ...getDefaultRequestOptions(),
        path: `/repos/${account}/${repo}/commits?${newQuery.toString()}`,
      });

      commits = commits.concat(fetchResult);
    }

    return commits.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
    }));
  } catch(e) {
    console.error('Failed to fetch commits');
    throw e;
  }
}

async function getMergeCommitsSinceLastTag(account, repo) {
  const lastTagHash = await getLatestTagCommitHash(account, repo);
  const lastTagDate =  await getCommitDate(account, repo, lastTagHash);
  const commits = getCommits(account, repo, lastTagDate);

  // TODO: filter out commits (leave those starting with Merge, Bump)
}

module.exports = {
  getLatestTagCommitHash,
  getCommits,
  getCommitDate,
};
