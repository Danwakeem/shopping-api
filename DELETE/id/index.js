const Cloudant = require('@cloudant/cloudant');
const _ = require('lodash');

const parseId = (params) => {
  if ('id' in params) return Promise.resolve({ params });
  if (!('__ow_headers' in params)) return Promise.reject({ message: 'Missing headers' });
  params.id = params.__ow_headers['x-forwarded-url'].split('/').pop();
  return Promise.resolve({ params });
};

const getDoc = (chain) => {
  const cloudant = new Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  return db.get(chain.params.id)
    .then(doc => _.merge(chain, { doc }));
};

const destroyDoc = (chain) => {
  const cloudant = new Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  return db.destroy(chain.doc._id, chain.doc._rev)
    .then(() => chain);
};

const returnData = chain => Promise.resolve({ id: chain.params.id, success: true });

const main = params => parseId(params)
  .then(getDoc)
  .then(destroyDoc)
  .then(returnData);

exports.main = main;
