const DocsBundle = require('../src/DocsBundle');
const stream = process.stdout;
const baseUrl = 'http://127.0.0.1:48000/';
const PASSWORD_TYPE = {
  password: process.env.PASSWORD_TYPE==='0' ? '12345678' : 'passw0rd',
  newPassword: process.env.PASSWORD_TYPE==='0' ? 'passw0rd' : '12345678',
};

async function flow() {
  stream.write(
    `## Sign API\n\n`
  );
  await sign();
  //await signUp();
}
flow();

async function sign() {
  stream.write(
    `### sign\n\n`
  );
  const SIGN = await DocsBundle({
    method: 'POST',
    url: '/api/v1/sign',
    data: {
      email: 'temp2@boongoose.com',
      password: PASSWORD_TYPE.password,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'email',
        type: String,
        description: '사용자 이메일',
      })
      .addParameter({
        name: 'password',
        type: String,
        description: '사용자 비밀번호',
      });
    }
  });
  await DocsBundle({
    method: 'GET',
    url: '/api/v1/sign',
    headers: {
      'Cookie': SIGN.headers['set-cookie'][0],
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'refreshToken',
        type: String,
        description: '(cookie) 리프레시 토큰',
      });
    }
  });
  await DocsBundle({
    method: 'PUT',
    url: '/api/v1/sign',
    data: {
      password: PASSWORD_TYPE.password,
      newPassword: PASSWORD_TYPE.newPassword,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'password',
        type: String,
        description: '사용자 비밀번호',
      })
      .addParameter({
        name: 'newPassword',
        type: String,
        description: '변경할 비밀번호',
      });
    }
  });
}
async function signUp() {
  stream.write(
    `### sign-up\n\n`
  );
  const SIGN = await DocsBundle({
    method: 'POST',
    url: '/api/v1/sign/up',
    data: {
      email: 'temp3@boongoose.com',
      password: '12345678',
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'email',
        type: String,
        description: '가입자 이메일',
      })
      .addParameter({
        name: 'password',
        type: String,
        description: '가입자 비밀번호',
      })
      .addParameter({
        name: 'nickname',
        type: String,
        description: '가입자 별명',
        default: 'random()'
      });
    }
  });
}
