const DocsBuilder = require('./DocsBuilder');
const Request = require('./Request');
const queryString = require('query-string');
const beautify = require('json-beautify');

const replaceParams = (url, data, bind) => {
  let replaced = url;
  for (const [ key, val ] of Object.entries(bind)) {
    if(typeof key === 'string' && key.startsWith(':')) {
      replaced = replaced.replace(key, val);
    }
  }

  return {
    url: replaced,
    data,
    [Symbol.toPrimitive]() {
      return beautify({
        url: replaced,
        data,
      }, null, 2, 100);
    },
  };
};

const isQueryString = method => !(method === 'PUT' || method === 'POST' || method === 'PATCH');
async function checkQueryString(method, baseUrl, url, data, headers) {
  if(isQueryString(method)) {
    const qs = queryString.stringify(data);
    return await new Request(method, `${new URL(url, baseUrl).toString()}${!!qs ? `?${qs}`: ''}`).flush(null, headers);
  } else {
    return await new Request(method, `${new URL(url, baseUrl).toString()}`).flush(data, headers);
  }
}

async function DocsBundle({
  method = 'GET',
  url = '/',
  baseUrl = 'http://localhost/',
  bind = {},
  data = {},
  headers = {},
  params = p => p,
  stream = process.stdout,
  contentTypes = ['application/json'],
}) {
  // /api/v1/user/:userID => /api/v1/user/3

  const R = replaceParams(url, data, bind);
  // 파라미터 설명 제작
  const A = params(new DocsBuilder(method, url, ...contentTypes));
  // 실제 요청 및 결과 제작
  const B = await checkQueryString(method, baseUrl, R.url, R.data, headers);
  stream.write(
`${A}
\`\`\`js
// request
${R}
// response
${B}
\`\`\`\n\n`
  );
  return B;
}

module.exports = DocsBundle;
