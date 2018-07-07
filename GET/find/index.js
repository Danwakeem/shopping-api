const mongo = require('./../../mongo.lb');
const _ = require('lodash');
const mongoClient = require('mongodb').MongoClient;

const queryDB = (chain) => {
  const db = chain.db.db('shopping');
  const collection = db.collection('list');
  const userId = 'QzNCMkVBOUNRek5DTWtWQk9VTXRSREV6UmkwME9EYzBMVGhHTjBRdFJqVTRNalEwTjBNeU1qZEdEMTNGUXpOQ01rVkJPVU10UkRFelJpMDBPRGMwTFRoR04wUXRSalU0TWpRME4wTXlNamRHNDg3NFF6TkNNa1ZCT1VNdFJERXpSaTAwT0RjMExUaEdOMFF0UmpVNE1qUTBOME15TWpkRzhGN0RRek5DTWtWQk9VTXRSREV6UmkwME9EYzBMVGhHTjBRdFJqVTRNalEwTjBNeU1qZEdGNTgyNDQ3QzIyN0Y=';
  const query = mongo.buildWhereModel({
    where: {
      or: [
        { userId },
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
  .then(db => ({ db }))
  .then(queryDB)
  .then(closeConnection);

exports.main = main;
