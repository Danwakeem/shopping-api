const parseId = (params) => {
  if ('id' in params) return Promise.resolve(params);
  if (!('__ow_headers' in params)) return Promise.reject({ message: 'Missing headers' });
  params.id = params.__ow_headers['x-forwarded-url'].split('/').pop();
  return Promise.resolve(params);
};

const main = params => parseId(params)
  .then(p => ({ params, p }));

exports.main = main;
