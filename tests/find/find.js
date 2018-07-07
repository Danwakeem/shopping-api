const should = require('should');
const main = require('../../find/index');

describe('find/find test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('main test', () => {
    main.main().message.should.equal('Hello World!');
  });
});