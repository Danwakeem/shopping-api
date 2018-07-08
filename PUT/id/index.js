const { MongoClient, ObjectID } = require('mongodb');
const _ = require('lodash');

const updateDoc = (chain) => {
  const db = chain.db.db('shopping');
  const collection = db.collection('list');

  return collection.update(ObjectID(chain.params.doc.id), chain.params.doc)
    .then(data => _.merge(chain, { data }));
};

const closeConnection = (chain) => {
  chain.db.close();
  return Promise.resolve(chain.data);
};

const main = params => MongoClient.connect(params.mongo)
  .then(db => ({ db, params }))
  .then(createDoc)
  .then(closeConnection);

exports.main = main;
