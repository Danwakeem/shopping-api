const should = require('should');
const proxyquire = require('proxyquire');

const main = proxyquire('../../../POST/create/index', {
  '@cloudant/cloudant': () => ({
    db: {
      use: () => ({
        insert: () => Promise.resolve({ id: '100', rev: '222' }),
      }),
    },
  }),
});

describe('POST/create/create test suite', () => {
  it('Canary test', () => {
    true.should.equal(true);
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

  describe('createDoc() should', () => {
    const chain = {};
    beforeEach(() => {
      chain.params = {
        cloudantUrl: 'xxx',
        doc: {
          name: 'Dan',
          items: [],
          sharedWith: [],
        },
      };
    });

    it('return chain doc with id and rev keys', () => {
      return main.createDoc(chain)
        .then(chain => chain.params.doc.should.have.keys('id', 'id', '_rev'));
    });

    it('return chain doc with id and rev keys', () => {
      return main.createDoc(chain)
        .then((chain) => {
          chain.params.doc._id.should.equal('100');
          chain.params.doc.id.should.equal('100');
          chain.params.doc._rev.should.equal('222');
        });
    });
  });
});