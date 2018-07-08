const should = require('should');
const main = require('../../../POST/create/index');

describe('POST/create/create test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('main test', () => {
    main.main().message.should.equal('Hello World!');
  });
});