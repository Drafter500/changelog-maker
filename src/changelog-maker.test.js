const { expect } = require('chai');
const sinon = require('sinon');
const mock = require('mock-require');
const {
  generateChangeLogText,
  getCurrentRepoOwnerAndName,
} = require('./changelog-maker');


describe('changelog-maker', () => {
  describe('generateChangeLogText', () => {
    it('returns test', () => {
      expect(generateChangeLogText()).to.equal('test');
    });
  });

  describe('getCurrentRepoOwnerAndName', () => {
    const execStub = sinon.stub();
    mock('child_process',{exec: execStub});

    beforeEach(() => {
      execStub.reset();
    });

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
});
