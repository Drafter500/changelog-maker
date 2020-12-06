import { expect } from 'chai';
import mockFs from 'mock-fs';
import { getDefaultOptions } from '../src/request-options';
import path from "path";


describe('request-options', () => {
  afterEach(() => {
    mockFs.restore();
  });

  describe('getDefaultOptions', () => {
    describe('git auth file present is corrupted', () => {
      beforeEach(() => {
        mockFs({
          [path.join(process.cwd(), '.git-auth.json')]: 'not-a-json'
        });
      });

      it('throws', () => {
        expect(getDefaultOptions)
          .to.throw('.git-auth.json file is missing or not a valid JSON');
      });
    });

    describe('git auth file present but missing fields', () => {
      beforeEach(() => {
        mockFs({
          [path.join(process.cwd(), '.git-auth.json')]: '{"foo": "bar"}'
        });
      });

      it('throws', () => {
        expect(getDefaultOptions)
          .to.throw('.git-auth.json file must have "user" and "token" values');
      });
    });

    describe('git auth file is present and valid', () => {
      beforeEach(() => {
        mockFs({
          [path.join(process.cwd(), '.git-auth.json')]:
            '{"user": "foo", "token": "123"}'
        });
      });

      it('returns options with auth header', () => {
        const options = getDefaultOptions();

        expect(options).to.deep.equal({
          hostname: 'api.github.com',
          port: 443,
          method: 'GET',
          headers: {
            'Authorization': `Basic Zm9vOjEyMw==`,
            'User-Agent': 'node-js',
          },
        });
      });
    });
  });
});


