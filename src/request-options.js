const fs = require("fs");
const path = require("path");


function getDefaultRequestOptions() {
  let auth;
  try {
    const authRaw = fs.readFileSync(path.join(__dirname, '../.git-auth.json'));
    auth = JSON.parse(authRaw);
  } catch {
    throw new Error('.git-auth.json file is missing or not a valid JSON');
  }

  if (!auth.user || !auth.token) {
    throw new Error('.git-auth.json file must have "user" and "token" values');
  }

  const authString = Buffer
    .from(`${auth.user}:${auth.token}`)
    .toString('base64');

  return {
    hostname: 'api.github.com',
    port: 443,
    method: 'GET',
    headers: {
      'Authorization': `Basic ${authString}`,
      'User-Agent': 'node-js',
    },
  };
}

module.exports = {
  getDefaultRequestOptions,
};
