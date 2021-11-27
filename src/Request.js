const axios = require('axios');
const beautify = require('json-beautify');
const FormData = require('form-data');

function validate(data, headers) {
  if(data instanceof FormData) {
    return {
      data,
      headers: {
        ...headers,
        ...data.getHeaders(),
      },
    };
  }
  return {
    data,
    headers,
  };
}

class Request {
  constructor(method, url) {
    this.share = {
      method,
      url,
    };
  }

  async flush(data, headers) {
    const res = await axios({
      ...this.share,
      ...validate(data, headers),
    }).catch(err => {
      console.log('E: ' + err?.request?.method + ' ' + err?.request?.path + ` code: (${err?.response?.status ?? -1}) message: (${err?.response?.data?.message})`);
      return {
        data: null,
      };
    });
    const response = beautify(res.data, null, 3, 100);
    return {
      data: res.data,
      headers: res.headers,
      [Symbol.toPrimitive]() {
        return `${response}`;
      },
    };
  }
}

module.exports = Request;
