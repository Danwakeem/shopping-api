const { MongoClient, ObjectID } = require('mongodb');
const _ = require('lodash');

const parseId = (params) => {
  if ('id' in params) return Promise.resolve(params);
  if (!('__ow_headers' in params)) return Promise.reject({ message: 'Missing headers' });
  params.id = params.__ow_headers['x-forwarded-url'].split('/').pop();
  return Promise.resolve(params);
};

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

const main = params => parseId(params)
  .then(() => MongoClient.connect(params.mongo))
  .then(db => ({ db, params }))
  .then(queryDB)
  .then(closeConnection);

exports.main = main;
