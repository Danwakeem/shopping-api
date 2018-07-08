const mongo = require('./../../shared/mongo.lb');
const _ = require('lodash');
const mongoClient = require('mongodb').MongoClient;

const parseUserId = (params) => {
  if (!('__ow_headers' in params)) return Promise.reject({ message: 'Missing headers' });
  params.userId = params.__ow_headers['x-forwarded-url'].split('/').pop();
  return Promise.resolve(params);
};

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

const main = params => parseUserId(params)
  .then(() => mongoClient.connect(params.mongo))
  .then(db => ({ db, params }))
  .then(queryDB)
  .then(closeConnection);

exports.main = main;
