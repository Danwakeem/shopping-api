const should = require('should');
const main = require('../../../DELETE/id/index');

describe('DELETE/id/id test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
  });

  it('parseId() should', () => {
    it('reject if an id is not present', () => {
      return main.parseId({})
        .then(() => true.should.be.false())
        .catch(() => true.should.be.true());
    });

    it('resolve if id is already in params', () => {
      return main.parseId({ id: '100' })
        .then(data => data.params.id.should.equal('100'))
        .catch(() => false.should.be.true());
    });

    it('resolve if id is in ___ow_headers', () => {
      return main.parseId({ __ow_headers: { 'x-forwarded-url': 'https://test.com/api/100' } })
        .then(data => data.params.id.should.equal('100'))
        .catch(() => false.should.be.true());
    });
  });

  it('returnData() should', () => {
    it('never reject', () => {
      return main.returnData({ params: {} })
        .then(() => true.should.be.true())
        .catch(() => false.should.be.true());
    });

    it('create a valid success object', () => {
      return main.returnData({ params: { id: '100' } })
        .then(data => data.should.have.keys('success', id));
    });
  });
});