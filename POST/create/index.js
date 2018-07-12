const Cloudant = require('@cloudant/cloudant');
const _ = require('lodash');

const fixAPIEmptyArray = (doc) => {
  if (_.isObject(doc.items) && !_.isArray(doc.items)) doc.items = [];
  if (_.isObject(doc.sharedWith) && !_.isArray(doc.sharedWith)) doc.sharedWith = [];
  return doc;
};

const createDoc = (chain) => {
  const cloudant = Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  chain.params.doc = fixAPIEmptyArray(chain.params.doc);

  return db.insert(chain.params.doc)
    .then((data) => {
      chain.params.doc.id = data.id;
      chain.params.doc._id = data.id;
      chain.params.doc._rev = data.rev;
      return _.merge(chain, { data: chain.params.doc });
    });
};

const returnData = chain => Promise.resolve(chain.data);

const main = params => createDoc({ params })
  .then(returnData);

module.exports = {
  main,
  fixAPIEmptyArray,
  createDoc,
};
