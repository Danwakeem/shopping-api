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
  const id = '59c777e280b3da060e55ce61';

  return collection.findOne(ObjectID(chain.params.id))
    .then(data => _.merge(chain, { data }));
};

const closeConnection = (chain) => {
  chain.db.close();
  return Promise.resolve(chain.data);
};

const main = params => parseId(params)
  .then(p => ({ params, p }));
  /*
  .then(() => MongoClient.connect(params.mongo))
  .then(db => ({ db, params }))
  .then(queryDB)
  .then(closeConnection);
  */

exports.main = main;
