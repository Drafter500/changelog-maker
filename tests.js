import { expect } from 'chai';
import { generateChangeLogText } from './changelog-maker';


describe('generateChangeLogText', () => {
  it('returns test', () => {
    expect(generateChangeLogText()).to.equal('test');
  });
});
