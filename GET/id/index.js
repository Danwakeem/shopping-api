const { MongoClient, ObjectID } = require('mongodb');
const _ = require('lodash');

const queryDB = (chain) => {
  const db = chain.db.db('shopping');
  const collection = db.collection('list');
  const id = '59c777e280b3da060e55ce61';

  return collection.findOne(ObjectID(id))
    .then(data => _.merge(chain, { data }));
};

const closeConnection = (chain) => {
  chain.db.close();
  return Promise.resolve(chain.data);
};

const main = params => MongoClient.connect(params.mongo)
  .then(db => ({ db }))
  .then(queryDB)
  .then(closeConnection);

exports.main = main;
