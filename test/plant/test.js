const Request = require('./Request');

async function notice(cookie) {
  const POST_BOARD = await new Request('POST', 'http://192.168.0.63:49000/api/v1/admin/board/notice')
  .flush({
    title: '게시글 테스트입니다.',
    content: '게시글 테스트 중입니다.',
  }, {
    'Cookie': cookie,
  });
  const GET_BOARD = await new Request('GET', 'http://192.168.0.63:49000/api/v1/admin/board/notice')
  .flush(null, {
    'Cookie': cookie,
  });
  const GET_BOARD_DETAIL = await new Request('GET', `http://192.168.0.63:49000/api/v1/admin/board/notice/${POST_BOARD.data.id}`)
  .flush(null, {
    'Cookie': cookie,
  });
  const PUT_BOARD_DETAIL = await new Request('PUT', `http://192.168.0.63:49000/api/v1/admin/board/notice/${POST_BOARD.data.id}`)
  .flush({
    title: '게시글 변경 테스트입니다.',
    content: '게시글 변경 테스트 중입니다.',
  }, {
    'Cookie': cookie,
  });
  const DELETE_BOARD_DETAIL = await new Request('DELETE', `http://192.168.0.63:49000/api/v1/admin/board/notice/${POST_BOARD.data.id}`)
  .flush(null, {
    'Cookie': cookie,
  });
  return (
`${POST_BOARD}
${GET_BOARD}
${GET_BOARD_DETAIL}
${PUT_BOARD_DETAIL}
${DELETE_BOARD_DETAIL}`
  );
}

async function faq(cookie) {
  const POST_BOARD = await new Request('POST', 'http://192.168.0.63:49000/api/v1/admin/board/faq')
  .flush({
    title: '이건 뭐지',
    question: '어떻게 쓰는거지',
    ask: '몰?루',
  }, {
    'Cookie': cookie,
  });
  const GET_BOARD = await new Request('GET', 'http://192.168.0.63:49000/api/v1/admin/board/faq')
  .flush(null, {
    'Cookie': cookie,
  });
  const GET_BOARD_DETAIL = await new Request('GET', `http://192.168.0.63:49000/api/v1/admin/board/faq/${POST_BOARD.data.id}`)
  .flush(null, {
    'Cookie': cookie,
  });
  const PUT_BOARD_DETAIL = await new Request('PUT', `http://192.168.0.63:49000/api/v1/admin/board/faq/${POST_BOARD.data.id}`)
  .flush({
    title: '이건 뭐지',
    question: '어떻게 수정되는거지',
    ask: '아?루',
  }, {
    'Cookie': cookie,
  });
  const DELETE_BOARD_DETAIL = await new Request('DELETE', `http://192.168.0.63:49000/api/v1/admin/board/faq/${POST_BOARD.data.id}`)
  .flush(null, {
    'Cookie': cookie,
  });

  return (
`${POST_BOARD}
${GET_BOARD}
${GET_BOARD_DETAIL}
${PUT_BOARD_DETAIL}
${DELETE_BOARD_DETAIL}`
  );
}

async function plant(cookie) {
  const GET_BANNER = await new Request('GET', 'http://192.168.0.63:49000/api/v1/admin/plant/banner')
  .flush(null, {
    'Cookie': cookie,
  });
  return (
`${GET_BANNER}`
  );
}

async function userLayer() {
  const POST = await new Request('POST', 'http://192.168.0.63:49000/api/v1/sign')
  .flush({
    id: 'temp2',
    password: '12345678',
  });
  const USER = await new Request('GET', 'http://192.168.0.63:49000/api/v1/user/me')
  .flush(null, {
    'Cookie': POST.headers['set-cookie'][0],
  });
  const NOTICE = await new Request('GET', 'http://192.168.0.63:49000/api/v1/board/notice')
  .flush();
  const NOTICE_DETAIL = await new Request('GET', 'http://192.168.0.63:49000/api/v1/board/notice/1')
  .flush();
  const FAQ = await new Request('GET', 'http://192.168.0.63:49000/api/v1/board/faq')
  .flush();
  const FAQ_DETAIL = await new Request('GET', 'http://192.168.0.63:49000/api/v1/board/faq/1')
  .flush();
  const DELETE = await new Request('DELETE', 'http://192.168.0.63:49000/api/v1/sign')
  .flush(null, {
    'Cookie': POST.headers['set-cookie'][0],
  });
  console.log(
`${POST}
${USER}
${NOTICE}
${NOTICE_DETAIL}
${FAQ}
${FAQ_DETAIL}
${DELETE}`
  );
}

const FormData = require('form-data');
const fs = require('fs');

async function main() {
  const POST = await new Request('POST', 'http://192.168.0.63:49000/api/v1/admin/sign')
  .flush({
    id: 'admin',
    password: '1234',
  });
  const NOTICE = await notice(POST.headers['set-cookie'][0]);
  const FAQ = await faq(POST.headers['set-cookie'][0]);
  const PLANT = await plant(POST.headers['set-cookie'][0]);

  const formData = new FormData();
  formData.append('image', fs.createReadStream('../../project-bong-server/img/profile/7f2d121d0c864ff289682b3a119386ae.png'));
  const FILE_TEST = await new Request('POST', 'http://192.168.0.63:49000/api/v1/admin/plant/banner')
  .flush(formData, {
    ...formData.getHeaders(),
    'Cookie': POST.headers['set-cookie'][0],
  });
  const FILE_DELETE = await new Request('DELETE', `http://192.168.0.63:49000/api/v1/admin/plant/banner/${FILE_TEST.data.id}`)
  .flush(null, {
    'Cookie': POST.headers['set-cookie'][0],
  })

  const DELETE = await new Request('DELETE', 'http://192.168.0.63:49000/api/v1/admin/sign')
  .flush(null, {
    'Cookie': POST.headers['set-cookie'][0],
  });
  console.log(
`${POST}
${NOTICE}
${FAQ}
${PLANT}
${FILE_TEST}
${FILE_DELETE}
${DELETE}
`

  );
}
main().catch(console.error);
//userLayer().catch(console.error);
