const should = require('should');
const main = require('../../../PUT/id/index');

describe('PUT/id/id test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('main test', () => {
    main.main().message.should.equal('Hello World!');
  });
});