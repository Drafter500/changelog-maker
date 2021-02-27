const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');


const fetchStub = sinon.stub();
const { getLatestTagCommitHash, getCommits } = proxyquire(
  './git-utils',
  {
    './fetch-json': {fetchJson: fetchStub},
  }
);

describe('git-utils', () => {
  describe('getLatestTagCommitHash', () => {
    it('returns latest tag commit hash', async () => {
      fetchStub.resolves([
        {
          name: 'v3.5.1',
          zipball_url: 'zipball',
          tarball_url: 'tarball',
          commit: {
            sha: 'einzweipolizei',
            url: 'https://api.github.com/repos/owner-one/repo-two/commits/einzweipolizei'
          },
          node_id: 'MDM6UmVmMTIzOTMzOTY5OnJlZnMvdGFncy92Mi43LjA='
        }
      ]);
      const res = await getLatestTagCommitHash('org-one', 'repo-two');
      expect(res).to.equal('einzweipolizei');
    });

    it('throws error when no tags available', async () => {
      fetchStub.resolves([]);

      try {
        await getLatestTagCommitHash('org-one', 'repo-two');
        expect.fail('should have failed');
      } catch(e) {
        expect(e.message).to.equal('No tags found.')
      }
    });

    it('throws error if request fails', async () => {
      fetchStub.rejects(new Error('failure'));

      try {
        await getLatestTagCommitHash('org-one', 'repo-two');
        expect.fail('should have failed');
      } catch(e) {
        expect(e.message).to.equal('failure')
      }
    });
  });

  describe('getCommits', () => {
    it('returns commits', async () => {
      fetchStub.resolves([
        {
          sha: '1234981249cn9438',
          commit: {
            message: 'Makes everything work',
          },
        },
        {
          sha: '1234981249cn9439',
          commit: {
            message: 'Fixes the bug',
          },
        },
        {
          sha: '1234981249cn9440',
          commit: {
            message: 'Makes everything work great',
          },
        },
      ]);

      const expectedResult = [
        {
          sha: '1234981249cn9438',
          message: 'Makes everything work',
        },
        {
          sha: '1234981249cn9439',
          message: 'Fixes the bug',
        },
        {
          sha: '1234981249cn9440',
          message: 'Makes everything work great',
        },
      ];

      const res = await getCommits('org-one', 'repo-two');
      expect(res).to.deep.equal(expectedResult);
    });

    it('throws error if request fails', async () => {
      fetchStub.rejects(new Error('failure'));

      try {
        await getCommits('org-one', 'repo-two');
        expect.fail('should have failed');
      } catch(e) {
        expect(e.message).to.equal('failure')
      }
    });
  });
});
