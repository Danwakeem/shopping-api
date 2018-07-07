const should = require('should');
const main = require('../../id/index');

describe('id/id test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('main test', () => {
    main.main().message.should.equal('Hello World!');
  });
});