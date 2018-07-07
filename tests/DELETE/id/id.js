const should = require('should');
const main = require('../../../DELETE/id/index');

describe('DELETE/id/id test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('main test', () => {
    main.main().message.should.equal('Hello World!');
  });
});