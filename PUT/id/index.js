const Cloudant = require('@cloudant/cloudant');
const _ = require('lodash');

const parseId = (params) => {
  if ('id' in params) return Promise.resolve({ params });
  if (!('__ow_headers' in params)) return Promise.reject({ message: 'Missing headers' });
  params.id = params.__ow_headers['x-forwarded-url'].split('/').pop();
  return Promise.resolve({ params });
};

const getRevId = (chain) => {
  const cloudant = new Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  return db.get(chain.params.id)
    .then((doc) => {
      chain.params.doc._rev = doc._rev;
      return chain;
    });
};

const updateDoc = (chain) => {
  const cloudant = new Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  return db.insert(chain.params.doc)
    .then(data => _.merge(chain, { data }));
};

const returnData = (chain) => Promise.resolve(chain.data);

const main = params => parseId(params)
  .then(getRevId)
  .then(updateDoc)
  .then(returnData);

exports.main = main;
