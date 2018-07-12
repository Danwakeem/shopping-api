const Cloudant = require('@cloudant/cloudant');
const _ = require('lodash');

const parseUserId = (params) => {
  if ('userId' in params) return Promise.resolve({ params });
  if (!('__ow_headers' in params)) return Promise.reject({ message: 'Missing headers' });
  params.userId = params.__ow_headers['x-forwarded-url'].split('/').pop();
  return Promise.resolve({ params });
};

const queryDB = (chain) => {
  const cloudant = new Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  return db.view('user', 'find', { key: chain.params.userId, include_docs: true })
    .then(data => _.merge(chain, { data: _.map(data.rows, r => r.doc) }));
};

const returnData = chain => Promise.resolve({ data: chain.data });

const main = params => parseUserId(params)
  .then(queryDB)
  .then(returnData);

exports.main = main;
