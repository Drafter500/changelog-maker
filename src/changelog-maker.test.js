const { expect } = require('chai');
const { generateChangeLogText } = require('./changelog-maker');


describe('generateChangeLogText', () => {
  it('returns test', () => {
    expect(generateChangeLogText()).to.equal('test');
  });
});
