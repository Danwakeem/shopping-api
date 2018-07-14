const Cloudant = require('@cloudant/cloudant');
const _ = require('lodash');
const PubNub = require('pubnub');

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

const fixAPIEmptyArray = (doc) => {
  if ('items' in doc && _.isObject(doc.items) && !_.isArray(doc.items)) doc.items = [];
  if ('sharedWith' in doc && _.isObject(doc.sharedWith) && !_.isArray(doc.sharedWith)) doc.sharedWith = [];
  return doc;
};

const updateDoc = (chain) => {
  const cloudant = new Cloudant({ url: chain.params.cloudantUrl, plugins: 'promises' });
  const db = cloudant.db.use('shopping');

  chain.params.doc = fixAPIEmptyArray(chain.params.doc);

  return db.insert(chain.params.doc)
    .then(data => _.merge(chain, { data }));
};

const publishPubNubMessage = (chain) => {
  if ('item' in chain.params) {
    const pubnub = new PubNub({
      publishKey : chain.params.pubnub,
    });
    const publishConfig = {
      channel : "estimate",
      message : chain.params.item,
    };
    return new Promise((resolve) => {
      pubnub.publish(publishConfig, () => {
        resolve(chain);
      });
    });
  } else return Promise.resolve(chain);
};

const returnData = chain => Promise.resolve(chain.data);

const main = params => parseId(params)
  .then(getRevId)
  .then(updateDoc)
  .then(publishPubNubMessage)
  .then(returnData);

module.exports = {
  main,
  parseId,
  getRevId,
  fixAPIEmptyArray,
  updateDoc,
  returnData,
  publishPubNubMessage,
};
