const mongodb = require('mongodb');

const model = {
  name: 'list',
  plural: 'list',
  base: 'PersistedModel',
  idInjection: true,
  options: {
    validateUpsert: true,
  },
  properties: {
    name: {
      type: 'string',
      required: true,
    },
    items: {
      type: 'array',
    },
    userId: {
      type: 'string',
      required: true,
    },
    sharedWith: {
      type: 'array',
    },
    date_created: {
      type: 'date',
    },
  },
  validations: [],
  relations: {},
  acls: [],
  methods: {},
};

const getPropertyDefinition = (m, propName) =>
  m.properties[propName];

const ObjectID = (id) => {
  if (id instanceof mongodb.ObjectID) {
    return id;
  }
  if (typeof id !== 'string') {
    return id;
  }
  try {
    // MongoDB's ObjectID constructor accepts number, 12-byte string or 24-byte
    // hex string. For LoopBack, we only allow 24-byte hex string, but 12-byte
    // string such as 'line-by-line' should be kept as string
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return new mongodb.ObjectID(id);
    }
    return id;
  } catch (e) {
    return id;
  }
};

const isObjectIDProperty = (m, prop, value) => {
  if (prop && ((prop.type === ObjectID)
    || (Array.isArray(prop.type) && prop.type[0] === ObjectID))) return true;
  else if (typeof value === 'string') return /^[0-9a-fA-F]{24}$/.test(value);
  return false;
};

const buildWhere = (where) => {
  const idName = 'id';
  const query = {};
  if (where === null || (typeof where !== 'object')) return query;

  Object.keys(where).forEach((k) => {
    let cond = where[k];
    if (k === 'and' || k === 'or' || k === 'nor') {
      if (Array.isArray(cond)) {
        cond = cond.map(c => buildWhere(c));
      }
      query[`'$${k}`] = cond;
      delete query[k];
      return;
    }
    if (k === idName) {
      k = '_id';
    }
    let propName = k;
    if (k === '_id') {
      propName = idName;
    }

    const prop = getPropertyDefinition(model, propName);

    let spec = false;
    let options = null;
    if (cond && cond.constructor.name === 'Object') {
      options = cond.options; // eslint-disable-line prefer-destructuring
      spec = Object.keys(cond)[0]; // eslint-disable-line prefer-destructuring
      cond = cond[spec];
    }
    if (spec) {
      if (spec === 'between') {
        query[k] = { $gte: cond[0], $lte: cond[1] };
      } else if (spec === 'inq') {
        cond = [].concat(cond || []);
        query[k] = {
          $in: cond.map((x) => {
            if (isObjectIDProperty(model, prop, x)) return ObjectID(x);
            return x;
          }),
        };
      } else if (spec === 'nin') {
        cond = [].concat(cond || []);
        query[k] = {
          $nin: cond.map((x) => {
            if (isObjectIDProperty(model, prop, x)) return ObjectID(x);
            return x;
          }),
        };
      } else if (spec === 'like') {
        query[k] = { $regex: new RegExp(cond, options) };
      } else if (spec === 'nlike') {
        query[k] = { $not: new RegExp(cond, options) };
      } else if (spec === 'neq') {
        query[k] = { $ne: cond };
      } else if (spec === 'regexp') {
        query[k] = { $regex: cond };
      } else {
        query[k] = {};
        query[k][`$${spec}`] = cond;
      }
    } else if (cond === null) {
      // http://docs.mongodb.org/manual/reference/operator/query/type/
      // Null: 10
      query[k] = { $type: 10 };
    } else {
      if (isObjectIDProperty(model, prop, cond)) {
        cond = ObjectID(cond);
      }
      query[k] = cond;
    }
  });

  return query;
};

const buildWhereModel = where => buildWhere(where.where);

module.exports = {
  buildWhereModel,
  buildWhere,
  getPropertyDefinition,
  isObjectIDProperty,
  ObjectID,
};
