const DocsBundle = require('../src/DocsBundle');
function File() {}
const stream = process.stdout;
const baseUrl = 'http://127.0.0.1:48000/';

async function flow() {
  await user();
  await userMe();
  await userId();
  await userRelation();
  await userRandom();
}
flow();

async function user() {
  stream.write(
    `### user\n\n`
  );
  await DocsBundle({
    method: 'GET',
    url: '/api/v1/user',
    data: {
      start: 1
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'start',
        type: Number,
        description: '검색 시작점',
        default: 0,
        example: 5,
      })
      .addParameter({
        name: 'end',
        type: Number,
        description: '검색 개수',
        default: 0,
        example: 10,
      })
      .addParameter({
        name: 'keyword',
        type: String,
        description: '사용자 닉네임',
        default: '',
      });
    }
  });
}

async function userMe() {
  stream.write(
    `### user-me\n\n`
  );
  await DocsBundle({
    method: 'GET',
    url: '/api/v1/user/me',
    baseUrl,
    stream,
  });
  await DocsBundle({
    method: 'PUT',
    url: '/api/v1/user/me',
    data: {
      nickname: 'ky',
      description: 'hello, world!',
    },
    contentTypes: ['application/json', 'multipart/form-data'],
    baseUrl,
    stream,
    params(app) {
      return app.addParameter({
        name: 'nickname',
        type: String,
        description: '변경할 닉네임',
        default: '',
        example: 'ky',
      })
      .addParameter({
        name: 'description',
        type: String,
        description: '변경할 자기소개',
        default: '',
        optional: true,
        example: 'hello, world!',
      })
      .addParameter({
        name: 'image',
        type: File,
        description: '변경할 프로필 사진',
        default: '',
        optional: true,
      })
    }
  })
}

async function userId() {
  stream.write(
    `### user-detail\n\n`
  );
  await DocsBundle({
    method: 'GET',
    url: '/api/v1/user/:userId',
    data: {
      ':userId': 24,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':userId',
        type: Number,
        description: '사용자 ID',
      });
    }
  });
}

async function userRelation() {
  stream.write(
    `### user-relation\n\n`
  );
  await DocsBundle({
    method: 'PUT',
    url: '/api/v1/user/:userId/relation',
    data: {
      ':userId': 24,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':userId',
        type: Number,
        description: '사용자 ID',
      });
    }
  });
  await DocsBundle({
    method: 'DELETE',
    url: '/api/v1/user/:userId/relation',
    data: {
      ':userId': 24,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':userId',
        type: Number,
        description: '사용자 ID',
      });
    }
  });
}

async function userRandom() {
  stream.write(
    `### user-random\n\n`
  );
  await DocsBundle({
    method: 'GET',
    url: '/api/v1/user/random',
    baseUrl,
    stream,
  });
}
