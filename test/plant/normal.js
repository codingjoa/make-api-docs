const axios = require('axios');
const https = require('https');
axios.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
const DocsBundle = require('../../src/DocsBundle');
const stream = process.stdout;
const baseUrl = 'https://codingjoa.kro.kr:49000/';
async function flow() {
  stream.write(
    `# API Documentation\n\n`
  );
  await subscribeAdmin();
  //await board();
  //await subscribe();
  //await user();
  //await sign();
}
flow();

const FormData = require('form-data');
const fs = require('fs');

async function subscribeAdmin() {

  const SIGN_IN = await DocsBundle({
    method: 'POST',
    url: '/api/v1/admin/sign',
    data: {
      id: 'admin',
      password: '1234',
    },
    baseUrl,
    stream,
  });
/*
  const formData = new FormData();
  formData.append('image', fs.createReadStream('../logo192.png'));
  const SUBSCRIBE = await DocsBundle({
    method: 'POST',
    url: '/api/v1/admin/subscribe/:subscribeId/plant/:subscribePlantId',
    bind: {
      ':subscribeId': 2,
      ':subscribePlantId': 4,
    },
    headers: {
      ...formData.getHeaders(),
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    data: formData,
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'farmId',
        type: Number,
        description: '밭 번호',
      });
    },
  });
  */
  const SUBSCRIBE = await DocsBundle({
    method: 'GET',
    url: '/api/v1/admin/subscribe',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'farmId',
        type: Number,
        description: '밭 번호',
      });
    },
  });

  const SUBSCRIBE_DETAIL = await DocsBundle({
    method: 'GET',
    url: '/api/v1/admin/subscribe/:subscribeId',
    bind: {
      ':subscribeId': 2,
    },
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'farmId',
        type: Number,
        description: '밭 번호',
      });
    },
  });

  const SUBSCRIBE_PLANT = await DocsBundle({
    method: 'GET',
    url: '/api/v1/admin/subscribe/:subscribeId/plant',
    bind: {
      ':subscribeId': 2,
    },
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'farmId',
        type: Number,
        description: '밭 번호',
      });
    },
  });

  const SUBSCRIBE_PLANT_DETAIL = await DocsBundle({
    method: 'GET',
    url: '/api/v1/admin/subscribe/:subscribeId/plant/:subscribePlantId',
    bind: {
      ':subscribeId': 2,
      ':subscribePlantId': 4,
    },
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'farmId',
        type: Number,
        description: '밭 번호',
      });
    },
  });
}

async function board() {
  stream.write(
    `## Board API\n\n`
  );
  stream.write(
    `### board-notice\n\n`
  );
  const NOTICE = await DocsBundle({
    method: 'GET',
    url: '/api/v1/board/notice',
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'page',
        type: Number,
        description: '페이지 번호',
        default: 1,
      })
      .addParameter({
        name: 'pageSize',
        type: Number,
        description: '1 페이지 당 크기',
        default: 15,
      })
    }
  });
  const NOTICE_DETAIL = await DocsBundle({
    method: 'GET',
    url: '/api/v1/board/notice/:noticeID',
    bind: {
      ':noticeID': 1,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':noticeID',
        type: String,
        description: '페이지 번호',
      });
    }
  });
}

async function user() {
  stream.write(
    `## User API\n\n`
  );
  stream.write(
    `### user-me\n\n`
  );
  const SIGN_IN = await DocsBundle({
    method: 'POST',
    url: '/api/v1/sign',
    data: {
      id: 'ky2',
      password: '1234',
    },
    baseUrl,
    stream,
  });
  const USER_ME = await DocsBundle({
    method: 'GET',
    url: '/api/v1/user/me',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
  });
}

async function sign() {
  stream.write(
    `## Sign API\n\n`
  );

  stream.write(
    `### sign-up\n\n`
  );
  const SIGNUP = await DocsBundle({
    method: 'POST',
    url: '/api/v1/sign/up',
    data: {
      name: 'ky',
      id: 'alice1234',
      password: '12345678',
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'id',
        type: String,
        description: '가입자 ID',
      })
      .addParameter({
        name: 'password',
        type: String,
        description: '가입자 비밀번호',
      })
      .addParameter({
        name: 'name',
        type: String,
        description: '가입자 이름',
      });
    }
  });
  stream.write(
    `### sign\n\n`
  );
  const SIGN_IN = await DocsBundle({
    method: 'POST',
    url: '/api/v1/sign',
    data: {
      id: 'alice1234',
      password: '12345678',
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'id',
        type: String,
        description: '가입자 ID',
      })
      .addParameter({
        name: 'password',
        type: String,
        description: '가입자 비밀번호',
      });
    }
  });
  const SIGN = await DocsBundle({
    method: 'GET',
    url: '/api/v1/sign',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
  });
  const SIGN_OUT = await DocsBundle({
    method: 'DELETE',
    url: '/api/v1/sign',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
  });
}

async function subscribe() {
  const SIGN_IN = await DocsBundle({
    method: 'POST',
    url: '/api/v1/sign',
    data: {
      id: 'ky',
      password: '1234',
    },
    baseUrl,
    stream,
  });
  stream.write(
    `## Subscribe API\n\n`
  );
  stream.write(
    `### subscribe\n\n`
  );
  /*
  const SUBSCRIBE = await DocsBundle({
    method: 'POST',
    url: '/api/v1/subscribe',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    data: {
      farmId: 2,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'farmId',
        type: Number,
        description: '밭 번호',
      });
    },
  });

  stream.write(
    `### subscribe-plant\n\n`
  );

  const SUBSCRIBE_PLANT = await DocsBundle({
    method: 'POST',
    url: '/api/v1/subscribe/plant',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    data: {
      plantId: 1,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'plantId',
        type: Number,
        description: '작물 번호',
      });
    },
  });
  */
  const GET_SUBSCRIBE_PLANT = await DocsBundle({
    method: 'GET',
    url: '/api/v1/subscribe/plant',
    headers: {
      'Cookie': SIGN_IN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
  });
}
