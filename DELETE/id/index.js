const { MongoClient, ObjectID } = require('mongodb');
const _ = require('lodash');

const queryDB = (chain) => {
  const db = chain.db.db('shopping');
  const collection = db.collection('list');

  return collection.deleteOne(ObjectID(chain.params.id))
    .then(data => _.merge(chain, { data }));
};

const closeConnection = (chain) => {
  chain.db.close();
  return Promise.resolve(chain.data);
};

const main = params => MongoClient.connect(params.mongo)
  .then(db => ({ db, params }))
  .then(queryDB)
  .then(closeConnection);

exports.main = main;