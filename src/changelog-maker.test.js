const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const execStub = sinon.stub();
const getChangeLogStub = sinon.stub();
const {
  getCurrentRepoOwnerAndName,
  makeChangelog,
} = proxyquire('./changelog-maker', {
  'child_process': {exec: execStub},
  './git-utils': {getChangeLog: getChangeLogStub},
});


describe('changelog-maker', () => {
  describe('getCurrentRepoOwnerAndName', () => {
    it('rejects with error if command fails', async () => {
      execStub.yields('error', null);

      try {
        await getCurrentRepoOwnerAndName();
        expect.fail('should have failed');
      } catch (e) {
        expect(e).to.equal('error');
      }
    });

    it('returns owner and repo if command succeeds', async () => {
      execStub.yields(null, 'https://github.com/owner-one/repo-two');

      const result = await getCurrentRepoOwnerAndName();
      expect(result).to.deep.equal(['owner-one', 'repo-two']);
    });

    it('strips line feed from the repo name if present', async () => {
      execStub.yields(null, 'https://github.com/owner-one/repo-two\n');

      const result = await getCurrentRepoOwnerAndName();
      expect(result).to.deep.equal(['owner-one', 'repo-two']);
    });
  });

  describe('makeChangelog', () => {
    beforeEach(() => {
      execStub.yields(null, 'https://github.com/owner-one/repo-two');
    });

    it('calls getChangeLog with owner and repo', async () => {
      await makeChangelog();

      expect(getChangeLogStub)
        .to.have.been.calledOnceWith('owner-one', 'repo-two');
    });
  });
});
