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
  try {
    const query = startDate ? `?since=${startDate}` : '';

    const commits = await fetchJson({
      ...getDefaultRequestOptions(),
      path: `/repos/${account}/${repo}/commits${query}`,
    });

    return commits.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
    }));
  } catch(e) {
    console.error('Failed to fetch commits');
    throw e;
  }
}


module.exports = {
  getLatestTagCommitHash,
  getCommits,
  getCommitDate,
};
