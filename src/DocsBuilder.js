const axios = require('axios');
const accessToken = process.env.ACCESS_TOKEN;
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
//class File {}
function File() {}

class DocsBuilder {
  constructor(method, path, ...contentTypes) {
    this.method = method;
    this.path = path;
    this.params = [];
    this.urlParams = [];
    this.contentTypes = ['application/json', ...contentTypes];
  }

  addParameter(info) {
    if(info.type instanceof Array) {
      if(/^:.{1,}$/.test(info.name)) {
        const p = { key: info.name, value: info.example };
        this.urlParams.push(p);
      }
      this.params.push({
        parameter: info.name,
        type: info.type.toString(),
        description: info.description,
        default: info.default,
        optional: info.default!==undefined,
        example: info.example,
      });
    } else {
      if(/^:.{1,}$/.test(info.name)) {
        const p = { key: info.name, value: info.example };
        this.urlParams.push(p);
      }
      this.params.push({
        parameter: info.name,
        type: info.type.name,
        description: info.description,
        default: info.default,
        optional: info.default!==undefined,
        example: info.example,
      });
    }
    return this;
  }

  async toString() {
    let contentTypes = '';
    for(const contentType of this.contentTypes) {
      contentTypes += `<tr>${contentTypes==='' ? `<th colspan="2" rowspan="${this.contentTypes.length}">허용 타입</th>` : ''}<td colspan="3">${contentType}</td></tr>\n`;
    }
    let params = '';
    for(const param of this.params) {
      params += `<tr><td>${param.parameter}</td><td>${param.type}</td><td>${param.description}</td><td>${param.default ?? ''}</td><td>${param.optional ? '✓' : ''}</td></tr>\n`;
    }
    return (
`- ${this.method} ${this.path}

<table>
${contentTypes}<tr><th>parameter</th><th>type</th><th>description</th><th>default</th><th>optional</th>
${params}</table>
`);
  }

  async createExample() {
    const data = {};
    for(const info of this.params) {
      if(info.example !== undefined && !info.parameter.startsWith(':')) {
        data[info.parameter] = info.example;
      }
    }
    let path = this.path;
    for(const qp of this.urlParams) {
      path = path.replace(qp.key, qp.value);
    }
    let pending = null;
    if(this.method === 'PUT' || this.method === 'POST' || this.method === 'PATCH') {
      pending = axios({
        method: this.method,
        url: new URL(path, HOST).toString(),
        data
      });
    } else {
      const qs = queryString.stringify(data);
      pending = axios({
        method: this.method,
        url: `${new URL(path, HOST).toString()}${!!qs ? `?${qs}`: ''}`,
      });
    }
    let res = null;
    try {
      res = await pending;
    } catch(err) {
      console.log('E: ' + this.method + ' ' + this.path + ` code: (${err?.response?.status ?? -1})`);
      return '';
    }
    const request = beautify(data, null, 2, 100);
    const response = beautify(res.data, null, 3, 100);
    return `\`\`\`json\n//request\n${request}\n\n//response\n${response}\n\`\`\``;
  }
}

var getBoardLike = new DocsBuilder('GET', '/api/v1/board/:boardId/like')
.addParameter({
  name: ':boardId',
  type: Number,
  description: '게시글 번호',
  example: 4
})
var createBoardLike = new DocsBuilder('PUT', '/api/v1/board/:boardId/like')
.addParameter({
  name: ':boardId',
  type: Number,
  description: '게시글 번호',
  example: 4
})
.addParameter({
  name: 'like',
  type: Boolean,
  description: 'true: like, false: dislike',
  example: true
});
var deleteBoardLike = new DocsBuilder('DELETE', '/api/v1/board/:boardId/like')
.addParameter({
  name: ':boardId',
  type: Number,
  description: '게시글 번호',
  example: 4
});



var getBoardReply = new DocsBuilder('GET', '/api/v1/board/:boardId/comment')
.addParameter({
  name: ':boardId',
  type: Number,
  description: '게시글 번호',
  example: 4
});
var createBoardReply = new DocsBuilder('POST', '/api/v1/board/:boardId/comment')
.addParameter({
  name: ':boardId',
  type: Number,
  description: '게시글 번호',
  example: 4
})
.addParameter({
  name: 'content',
  type: String,
  description: '댓글 본문',
  example: '고양이들 넘 기엽내여~~',
});




var getUserDetail = new DocsBuilder('GET', '/api/v1/user/:userId')
.addParameter({
  name: ':userId',
  type: Number,
  description: '사용자 ID',
  example: 4
})




var createBoard = new DocsBuilder('POST', '/api/v1/board', 'multipart/form-data')
.addParameter({
  name: 'content',
  type: String,
  description: '게시글 본문',
  example: '우리집 개냥이들 넘 귀여어어어~~'
})
.addParameter({
  name: 'hashtags',
  type: [String],
  description: '해시태그 목록',
  default: [],
  example: ['개냥이', '단또'],
})
.addParameter({
  name: 'images',
  type: [File],
  description: '게시글 사진(최대 4개)',
  default: [],
})

var getBoard = new DocsBuilder('GET', '/api/v1/board')
.addParameter({
  name: 'start',
  type: Number,
  description: '검색 시작점',
  default: 0,
  example: 2
})
.addParameter({
  name: 'end',
  type: Number,
  description: '검색 종료점',
  default: 15,
  example: 3
})
.addParameter({
  name: 'keyword',
  type: Number,
  description: '사용자 닉네임 또는 해시태그',
  default: ''
})
.addParameter({
  name: 'userId',
  type: Number,
  description: '사용자 ID',
  default: ''
});



var getBoardDetail = new DocsBuilder('GET', '/api/v1/board/:boardId')
.addParameter({
  name: ':boardId',
  type: Number,
  description: '게시글 번호',
  example: 21
});

async function main() {
  //await getBoard.toString().then(console.log);
  //await getBoard.createExample().then(console.log);
  //await getBoardDetail.toString().then(console.log);
  //await getBoardDetail.createExample().then(console.log);
  //await getBoardReply.toString().then(console.log);
  //await getBoardReply.createExample().then(console.log);
  //await createBoardReply.toString().then(console.log);
  //await createBoardReply.createExample().then(console.log);
  //await createBoard.toString().then(console.log);
  await createBoardLike.toString().then(console.log);
  await createBoardLike.createExample().then(console.log);
  await getBoardLike.toString().then(console.log);
  await getBoardLike.createExample().then(console.log);
  await deleteBoardLike.toString().then(console.log);
  await deleteBoardLike.createExample().then(console.log);
  /*
  await getUserDetail.toString().then(console.log);
  await getUserDetail.createExample().then(console.log);
  */
}
main();
