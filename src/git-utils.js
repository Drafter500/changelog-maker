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


module.exports = {
  getLatestTagCommitHash,
};
