const should = require('should');
const main = require('../../../PUT/id/index');

describe('PUT/id/id test suite', () => {
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

  describe('fixAPIEmptyArray() should', () => {
    it('return empty array for both items and sharedWith keys', () => {
      main.fixAPIEmptyArray({
        items: {},
        sharedWith: {}
      }).should.deepEqual({
        items: [],
        sharedWith: []
      });
    });

    it('return empty array for items', () => {
      main.fixAPIEmptyArray({
        items: {},
        sharedWith: ['10']
      }).should.deepEqual({
        items: [],
        sharedWith: ['10']
      });
    });

    it('return empty array for sharedWith', () => {
      main.fixAPIEmptyArray({
        items: [{ name: 'Hello' }],
        sharedWith: {}
      }).should.deepEqual({
        items: [{ name: 'Hello' }],
        sharedWith: []
      });
    });

    it('not modify keys', () => {
      main.fixAPIEmptyArray({
        items: [{ name: 'Hello' }],
        sharedWith: ['100']
      }).should.deepEqual({
        items: [{ name: 'Hello' }],
        sharedWith: ['100']
      });
    });
  });
});