const should = require('should');
const main = require('../../../GET/find/index');

describe('find/find test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('parseUserId() should', () => {
    it('reject if an userId is not present', () => {
      return main.parseId({})
        .then(() => true.should.be.false())
        .catch(() => true.should.be.true());
    });

    it('resolve if userId is already in params', () => {
      return main.parseId({ userId: '100' })
        .then(data => data.params.userId.should.equal('100'))
        .catch(() => false.should.be.true());
    });

    it('resolve if userId is in ___ow_headers', () => {
      return main.parseId({ __ow_headers: { 'x-forwarded-url': 'https://test.com/api/100' } })
        .then(data => data.params.userId.should.equal('100'))
        .catch(() => false.should.be.true());
    });
  });

  it('returnData() should', () => {
    it('never reject', () => {
      return main.returnData({})
        .then(() => true.should.be.true())
        .catch(() => false.should.be.true());
    });

    it('create a valid success object', () => {
      return main.returnData({ data: { name: 'HELLO' } })
        .then(data => data.should.deepEqual({ name: 'HELLO' }));
    });
  });
});