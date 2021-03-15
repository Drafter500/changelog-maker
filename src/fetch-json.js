const https = require('https');


async function fetchJson(reqOptions) {
  return new Promise((resolve, reject) => {
    const req = https.request(reqOptions, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

module.exports = {
  fetchJson,
};
