const { MongoClient } = require('mongodb');
const _ = require('lodash');

const createDoc = (chain) => {
  const db = chain.db.db('shopping');
  const collection = db.collection('list');

  return collection.insertOne(chain.params.doc)
    .then((data) => {
      chain.params.doc.id = data.insertedId;
      return _.merge(chain, { data: chain.params.doc });
    });
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
