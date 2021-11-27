const axios = require('axios');
const accessToken = process.env.ACCESS_TOKEN;
const DEBUG = false;
if(accessToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}
const queryString = require('query-string');
const beautify = require('json-beautify');
const HOST = 'http://localhost:48000';
// Authorization Header 추가하기
Array.prototype.toString = function toString() {
  if(this.length && this[0] instanceof Function) {
    return `Array&lt;${this[0].name}&gt;`;
  } else {
    let arr = '[';
    for(let i=0; i<this.length; i++) {
      arr += this[i];
    }
    arr += ']';
    return arr;
  }
}


class DocsBuilder {
  constructor(method, path, ...contentTypes) {
    this.method = method;
    this.path = path;
    this.params = [];
    this.urlParams = [];
    this.contentTypes = contentTypes.length ? contentTypes : ['application/json'];
    this.testList = [];
  }

  [Symbol.toPrimitive]() {
    const args = this.printArguments();
    return `${args}\n`;
  }

  addParameter(info) {
    if(/^:.{1,}$/.test(info.name)) {
      //const p = { key: info.name, value: info.example };
      //this.urlParams.push(p);
      this.urlParams.push(info.name);
    }
    const type = (info.type instanceof Array) ? info.type.toString() : info.type.name;
    this.params.push({
      parameter: info.name,
      type: type,
      description: info.description,
      default: info.default,
      optional: info.default!==undefined,
      example: info.example,
    });
    return this;
  }

  addTestCase(params) {
    if(params instanceof Function) {
      const option = {
        params: null,
        setParams(params) {
          this.params = params;
        },
      };
      params(option);
      option.params && this.testList.push(option.params);
    } else {
      this.testList.push(params);
    }
    return this;
  }

  async test() {
    const args = this.printArguments();
    let cases = null;
    for(const params of this.testList) {
      cases = await this.printTastCase(params);
    }

    return {
//      payload: res.data,
      toString() {
        return (
`${args}
${cases}
`
        );
      }
    };
  }

  printArguments() {
    let contentTypes = '';
    for(const contentType of this.contentTypes) {
      contentTypes += `<tr>${contentTypes==='' ? `<th colspan="2" rowspan="${this.contentTypes.length}">허용 타입</th>` : ''}<td colspan="3">${contentType}</td></tr>\n`;
    }
    let params = '';
    for(const param of this.params) {
      params += `<tr><td>${param.parameter}</td><td>${param.type}</td><td>${param.description}</td><td>${param.default ?? '❌'}</td><td>${param.optional ? '✅' : '❌'}</td></tr>\n`;
    }
    return (
`- ${this.method} ${this.path}

<table>
${contentTypes}<tr><th>parameter</th><th>type</th><th>description</th><th>default</th><th>optional</th>
${params}</table>
`);
  }

  async printTastCase(testCase) {
    const share = this.share;
    const req = this.createRequest(testCase);
    const res = await this.createResponse({ ...req, ...share });
    return {
      res,
      [Symbol.toPrimitive]() {
        return (
`\`\`\`js
//request
${req}

//response
${res}
\`\`\``
        );
      },
    }
  }

  createRequest(datas) {
    let path = this.path;
    for(const param of this.urlParams) {
      path = path.replace(param, datas[param]);
    }
    const data = {};
    for(const info of this.params) {
      if(!info.parameter.startsWith(':')) {
        if(datas[info.parameter]) {
          data[info.parameter] = datas[info.parameter];
        }
      }
    }
    const useBS = this.method === 'PUT' || this.method === 'POST' || this.method === 'PATCH';
    if(!useBS) {
      const qs = queryString.stringify(data);
      path = `${new URL(path, HOST).toString()}${!!qs ? `?${qs}`: ''}`;
    } else {
      path = new URL(path, HOST).toString();
    }
    console.log(path);
    const request = beautify(data, null, 2, 100);
    return {
      method: this.method,
      url: path,
      data,
      [Symbol.toPrimitive]() {
        return request;
      },
    }
  }

  async createResponse(req) {
    try {
      const res = await axios(req);
      const response = beautify(res.data, null, 3, 100);
      return {
        data: res.data,
        [Symbol.toPrimitive]() {
          return response;
        },
      }
    } catch(err) {
      DEBUG && console.error(err);
      console.log('E: ' + this.method + ' ' + this.path + ` code: (${err?.response?.status ?? -1})`);
      return '';
    }
  }
}

module.exports = DocsBuilder;
