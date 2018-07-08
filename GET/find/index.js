const mongo = require('./../../shared/mongo.lb');
const _ = require('lodash');
const mongoClient = require('mongodb').MongoClient;

const queryDB = (chain) => {
  const db = chain.db.db('shopping');
  const collection = db.collection('list');
  const query = mongo.buildWhereModel({
    where: {
      or: [
        { userId: chain.params.userId },
        { sharedWith: userId },
      ],
    },
  });
  return collection.find(query).toArray()
    .then(data => _.merge(chain, { data }));
};

const closeConnection = (chain) => {
  chain.db.close();
  return Promise.resolve(chain.data);
};

const main = params => mongoClient.connect(params.mongo)
  .then(db => ({ db, params }))
  .then(queryDB)
  .then(closeConnection);

exports.main = main;
